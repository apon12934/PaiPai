let services = null;

/**
 * Lazy/dynamic loader for Firebase Admin SDK.
 * Only loads and initializes firebase-admin when service account credentials are explicitly provided.
 * This prevents serverless cold-start crashes on Vercel when running with SMTP only.
 */
export async function getAdmin() {
  if (services) return services;

  let projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  let clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  // Support full JSON string pasted into FIREBASE_SERVICE_ACCOUNT_KEY
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      if (parsed.project_id) projectId = parsed.project_id;
      if (parsed.client_email) clientEmail = parsed.client_email;
      if (parsed.private_key) privateKey = parsed.private_key;
    } catch (e) {
      console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:', e.message);
    }
  }

  if (projectId && clientEmail && privateKey) {
    try {
      const { initializeApp, getApps, cert } = await import('firebase-admin/app');
      const { getAuth } = await import('firebase-admin/auth');
      const { getFirestore } = await import('firebase-admin/firestore');

      privateKey = privateKey.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '');

      const app =
        getApps().length > 0
          ? getApps()[0]
          : initializeApp({
              credential: cert({
                projectId,
                clientEmail,
                privateKey,
              }),
            });

      services = {
        adminAuth: getAuth(app),
        adminDb: getFirestore(app),
      };
      return services;
    } catch (err) {
      console.warn('Failed to load Firebase Admin SDK:', err.message);
    }
  }

  // Fallback when private key is not configured
  services = {
    adminAuth: null,
    adminDb: null,
  };
  return services;
}
