import crypto from 'crypto';
import { getAdmin } from '@/lib/server/firebase-admin';
import { sendOtpEmail } from '@/lib/server/mailer';

// In-memory fallback cache for development or environments without Firestore Admin credentials
const fallbackCache = new Map();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email: rawEmail, type = 'signup' } = body;

    if (!rawEmail || typeof rawEmail !== 'string') {
      return Response.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const email = rawEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Please enter a valid email address format.' },
        { status: 400 }
      );
    }

    if (type !== 'signup' && type !== 'reset') {
      return Response.json(
        { success: false, error: 'Invalid verification type.' },
        { status: 400 }
      );
    }

    const { adminAuth, adminDb } = await getAdmin();

    // Check account existence against Firebase Auth (if Admin SDK is configured)
    if (adminAuth) {
      try {
        const existingUser = await adminAuth.getUserByEmail(email);
        if (type === 'signup' && existingUser) {
          return Response.json(
            {
              success: false,
              error: 'This email is already registered. Please log in or reset your password.',
            },
            { status: 400 }
          );
        }
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          if (type === 'reset') {
            return Response.json(
              {
                success: false,
                error: 'No PaiPai account found with this email address.',
              },
              { status: 404 }
            );
          }
        } else if (err.code !== 'auth/invalid-email') {
          console.warn('Firebase Admin getUserByEmail check warning:', err.message);
        }
      }
    }

    // Rate Limiting & Cooldown: Enforce 60-second cooldown per email
    const now = Date.now();
    let existingOtp = null;

    if (adminDb) {
      try {
        const docRef = adminDb.collection('_auth_otps').doc(email);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          existingOtp = docSnap.data();
        }
      } catch (dbErr) {
        console.warn('Firestore OTP lookup warning, using cache:', dbErr.message);
        existingOtp = fallbackCache.get(email);
      }
    } else {
      existingOtp = fallbackCache.get(email);
    }

    if (existingOtp && existingOtp.lastSentAt) {
      const elapsed = now - existingOtp.lastSentAt;
      const cooldownMs = 60 * 1000;
      if (elapsed < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - elapsed) / 1000);
        return Response.json(
          {
            success: false,
            error: `Please wait ${remainingSeconds}s before requesting a new verification code.`,
          },
          { status: 429 }
        );
      }
    }

    // Generate cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto
      .createHash('sha256')
      .update(`${otp}:${email}`)
      .digest('hex');

    const otpData = {
      hash: otpHash,
      type,
      expiresAt: now + 10 * 60 * 1000, // 10 minutes expiry
      lastSentAt: now,
      attempts: 0,
    };

    // Save OTP to Firestore (or in-memory cache)
    if (adminDb) {
      try {
        await adminDb.collection('_auth_otps').doc(email).set(otpData);
      } catch (saveErr) {
        console.warn('Failed to save to Firestore _auth_otps, using memory cache:', saveErr.message);
        fallbackCache.set(email, otpData);
      }
    } else {
      fallbackCache.set(email, otpData);
    }

    // Send the email via Gmail SMTP
    try {
      await sendOtpEmail({ to: email, otp, type });
    } catch (mailErr) {
      console.error('SMTP email dispatch error:', mailErr);
      return Response.json(
        {
          success: false,
          error:
            mailErr.message ||
            'Failed to dispatch verification email. Please check SMTP configuration.',
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Verification code sent to your email.',
    });
  } catch (error) {
    console.error('Unhandled send-otp error:', error);
    return Response.json(
      { success: false, error: 'Internal server error while processing verification.' },
      { status: 500 }
    );
  }
}
