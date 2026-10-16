import nodemailer from 'nodemailer';

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || 'system.apon@gmail.com';
  const rawPass = process.env.SMTP_PASS;

  if (!rawPass) {
    throw new Error(
      'SMTP_PASS environment variable is missing. Please set your Gmail App Password in .env.local.'
    );
  }

  const pass = rawPass.replace(/\s+/g, '');

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends a branded, monochromatic HTML email containing a 6-digit OTP code.
 * Optimized with standard OTP patterns and Schema.org metadata to trigger
 * Gmail's automated "Copy code" button on web and mobile.
 *
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.otp - 6-digit OTP string
 * @param {'signup' | 'reset'} params.type - OTP reason
 */
export async function sendOtpEmail({ to, otp, type = 'signup' }) {
  const transporter = createTransporter();
  const senderEmail = process.env.SMTP_USER || 'system.apon@gmail.com';

  const isSignup = type === 'signup';

  // Strictly use "verification code" pattern (matching Vercel / Google auth patterns)
  // to ensure Android & Gmail NLP triggers the "Copy code: [OTP]" action chip.
  const subject = `${otp} is your PaiPai verification code`;

  const title = isSignup ? 'Confirm Your Email' : 'Reset Your Password';
  const description = isSignup
    ? 'Welcome to PaiPai! Please use the 6-digit verification code below to verify your email address and activate your account.'
    : 'We received a request to reset your PaiPai account password. Enter the 6-digit code below to set a new password.';

  // Plain text fallback parsed by Android TextClassifier & Gmail NLP
  const text = `${otp} is your PaiPai verification code.\n\nYour verification code is: ${otp}\n\nUse this code to complete your ${
    isSignup ? 'account registration' : 'password reset'
  } on PaiPai.\n\nThis code is valid for 10 minutes.\n\nIf you did not request this code, you can safely ignore this email.`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <!-- Preheader text for inbox preview & Android/Gmail OTP action chip detection -->
  <div style="display: none; font-size: 1px; color: #0a0a0a; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${otp} is your PaiPai verification code. Valid for 10 minutes.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 480px; background-color: #141414; border: 1px solid #262626; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #1f1f1f;">
              <img 
                src="https://paipai-app.vercel.app/icon-192x192.png" 
                width="54" 
                height="54" 
                style="display: block; margin: 0 auto 14px auto; border-radius: 50%; border: 1px solid #2e2e2e; background-color: #0a0a0a; box-shadow: 0 4px 12px rgba(0,0,0,0.4);" 
                alt="PaiPai Logo" 
              />
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; color: #ffffff;">
                PaiPai <span style="font-size: 14px; font-weight: 400; color: #71717a; margin-left: 4px;">(পাই পাই)</span>
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; font-weight: 600;">
                Debt & Expense Tracker
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #ffffff; text-align: center;">
                ${title}
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #a1a1aa; text-align: center;">
                ${description}
              </p>

              <!-- Phrasing specifically tuned for Gmail's 'Copy code' chip detection -->
              <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #d4d4d8; text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">
                Your verification code is:
              </p>

              <!-- OTP Code Display -->
              <div style="background-color: #0a0a0a; border: 1px solid #2e2e2e; border-radius: 12px; padding: 22px 16px; text-align: center; margin: 0 0 24px 0;">
                <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 38px; font-weight: 800; letter-spacing: 0.25em; color: #ffffff; text-indent: 0.25em;">
                  ${otp}
                </div>
                <div style="font-size: 11px; color: #71717a; margin-top: 10px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">
                  Valid for 10 minutes
                </div>
              </div>

              <p style="margin: 20px 0 0 0; font-size: 12px; line-height: 1.5; color: #71717a; text-align: center;">
                If you did not request this verification code, you can safely ignore this email. Someone may have entered your email address by mistake.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0e0e0e; border-top: 1px solid #1f1f1f; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #52525b;">
                Sent securely by PaiPai System Auth &bull; 
                <a href="https://paipai.ddns.net" style="color: #71717a; text-decoration: none;">paipai.ddns.net</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return transporter.sendMail({
    from: `"PaiPai" <${senderEmail}>`,
    to,
    subject,
    text,
    html,
  });
}
