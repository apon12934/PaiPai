import crypto from 'crypto';
import { getAdmin } from '@/lib/server/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email: rawEmail, otp: rawOtp, password, newPassword, type = 'signup', verificationToken } = body;

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
    const now = Date.now();
    let isOtpValid = false;

    // 1. First verify via stateless HMAC verificationToken (works across all serverless lambdas)
    const secret =
      process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
      process.env.SMTP_PASS ||
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      'paipai-fallback-otp-secret-key';

    if (verificationToken) {
      try {
        const payloadStr = Buffer.from(verificationToken, 'base64url').toString('utf8');
        const tokenPayload = JSON.parse(payloadStr);

        if (
          tokenPayload.email === email &&
          tokenPayload.type === type &&
          now <= tokenPayload.expiresAt
        ) {
          const expectedSig = crypto
            .createHmac('sha256', secret)
            .update(`${email}:${otp}:${tokenPayload.expiresAt}:${type}`)
            .digest('hex');

          if (
            tokenPayload.sig &&
            expectedSig &&
            tokenPayload.sig.length === expectedSig.length &&
            crypto.timingSafeEqual(Buffer.from(tokenPayload.sig), Buffer.from(expectedSig))
          ) {
            isOtpValid = true;
          }
        }
      } catch (tokenErr) {
        console.warn('Stateless verification token parse error:', tokenErr.message);
      }
    }

    // 2. If stateless verification token was not present or didn't match, check Firestore _auth_otps
    let docRef = null;
    let otpData = null;

    if (!isOtpValid && adminDb) {
      try {
        docRef = adminDb.collection('_auth_otps').doc(email);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          otpData = docSnap.data();
        }
      } catch (dbErr) {
        console.warn('Firestore OTP lookup warning:', dbErr.message);
      }

      if (otpData) {
        if (otpData.type === type && now <= otpData.expiresAt) {
          const currentAttempts = (otpData.attempts || 0) + 1;
          if (currentAttempts > 5) {
            await docRef.delete().catch(() => {});
            return Response.json(
              {
                success: false,
                error: 'Too many incorrect attempts. Please request a new verification code.',
              },
              { status: 429 }
            );
          }

          const submittedHash = crypto
            .createHash('sha256')
            .update(`${otp}:${email}`)
            .digest('hex');

          if (submittedHash === otpData.hash) {
            isOtpValid = true;
          } else {
            await docRef.update({ attempts: currentAttempts }).catch(() => {});
            const remaining = 5 - currentAttempts;
            return Response.json(
              {
                success: false,
                error: `Incorrect verification code. ${remaining} attempt(s) remaining.`,
              },
              { status: 400 }
            );
          }
        }
      }
    }

    if (!isOtpValid) {
      return Response.json(
        {
          success: false,
          error: 'Invalid or expired verification code. Please check your code or request a new one.',
        },
        { status: 400 }
      );
    }

    // Clean up active Firestore OTP record if present
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
              'Password reset requires Firebase Admin credentials. Please add FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_ADMIN_PRIVATE_KEY in Vercel environment variables.',
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
