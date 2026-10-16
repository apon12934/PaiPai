import crypto from 'crypto';
import { getAdmin } from '@/lib/server/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email: rawEmail, otp: rawOtp, password, newPassword, type = 'signup' } = body;

    if (!rawEmail || typeof rawEmail !== 'string') {
      return Response.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const email = rawEmail.trim().toLowerCase();
    const otp = (rawOtp || '').toString().trim();

    if (!/^\d{6}$/.test(otp)) {
      return Response.json(
        { success: false, error: 'Verification code must be exactly 6 digits.' },
        { status: 400 }
      );
    }

    const targetPassword = type === 'reset' ? newPassword || password : password;
    if (!targetPassword || targetPassword.length < 6) {
      return Response.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const { adminAuth, adminDb } = await getAdmin();

    // Retrieve active OTP record
    let otpData = null;
    let docRef = null;

    if (adminDb) {
      try {
        docRef = adminDb.collection('_auth_otps').doc(email);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          otpData = docSnap.data();
        }
      } catch (dbErr) {
        console.warn('Firestore OTP lookup warning:', dbErr.message);
      }
    }

    if (!otpData) {
      return Response.json(
        {
          success: false,
          error: 'No active verification code found for this email. Please request a new code.',
        },
        { status: 400 }
      );
    }

    // Verify type match
    if (otpData.type !== type) {
      return Response.json(
        {
          success: false,
          error: 'Invalid verification session. Please request a new code.',
        },
        { status: 400 }
      );
    }

    // Verify expiration
    const now = Date.now();
    if (now > otpData.expiresAt) {
      if (docRef) await docRef.delete().catch(() => {});
      return Response.json(
        {
          success: false,
          error: 'Verification code has expired. Please request a new code.',
        },
        { status: 400 }
      );
    }

    // Verify attempt limit (brute force protection)
    const currentAttempts = (otpData.attempts || 0) + 1;
    if (currentAttempts > 5) {
      if (docRef) await docRef.delete().catch(() => {});
      return Response.json(
        {
          success: false,
          error: 'Too many incorrect attempts. This code has been invalidated. Please request a new code.',
        },
        { status: 429 }
      );
    }

    // Check code hash
    const submittedHash = crypto
      .createHash('sha256')
      .update(`${otp}:${email}`)
      .digest('hex');

    if (submittedHash !== otpData.hash) {
      if (docRef) {
        await docRef.update({ attempts: currentAttempts }).catch(() => {});
      }
      const remainingAttempts = 5 - currentAttempts;
      return Response.json(
        {
          success: false,
          error: `Incorrect verification code. ${remainingAttempts} attempt(s) remaining.`,
        },
        { status: 400 }
      );
    }

    // Code is valid! Invalidate OTP to prevent replay attacks
    if (docRef) {
      await docRef.delete().catch(() => {});
    }

    // Perform Authentication Actions
    if (type === 'signup') {
      if (adminAuth) {
        try {
          const userRecord = await adminAuth.createUser({
            email,
            password: targetPassword,
            emailVerified: true,
          });

          const customToken = await adminAuth.createCustomToken(userRecord.uid);
          return Response.json({
            success: true,
            customToken,
            message: 'Account created and verified successfully.',
          });
        } catch (authErr) {
          if (authErr.code === 'auth/email-already-exists') {
            return Response.json(
              {
                success: false,
                error: 'This email is already registered. Please log in.',
              },
              { status: 400 }
            );
          }
          console.error('Firebase Admin createUser error:', authErr);
          return Response.json(
            { success: false, error: authErr.message || 'Failed to create user account.' },
            { status: 500 }
          );
        }
      } else {
        // Fallback when adminAuth is not yet configured in local dev
        return Response.json({
          success: true,
          verified: true,
          message: 'Email verified. Ready for client sign-up.',
        });
      }
    } else if (type === 'reset') {
      if (adminAuth) {
        try {
          const userRecord = await adminAuth.getUserByEmail(email);
          await adminAuth.updateUser(userRecord.uid, {
            password: targetPassword,
          });

          const customToken = await adminAuth.createCustomToken(userRecord.uid);
          return Response.json({
            success: true,
            customToken,
            message: 'Password reset successfully.',
          });
        } catch (resetErr) {
          console.error('Firebase Admin reset error:', resetErr);
          return Response.json(
            { success: false, error: resetErr.message || 'Failed to reset password.' },
            { status: 500 }
          );
        }
      } else {
        return Response.json(
          {
            success: false,
            error:
              'Password reset requires Firebase Admin credentials. Please add FIREBASE_ADMIN_PRIVATE_KEY to .env.local.',
          },
          { status: 500 }
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Unhandled verify-otp error:', error);
    return Response.json(
      { success: false, error: 'Internal server error while verifying code.' },
      { status: 500 }
    );
  }
}
