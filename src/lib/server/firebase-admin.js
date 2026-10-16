let services = null;
let initError = null;

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

      privateKey = privateKey
        .replace(/\\r/g, '')
        .replace(/\\n/g, '\n')
        .replace(/^["']|["']$/g, '')
        .trim();

      const APP_NAME = 'paipai-admin';
      const existingApps = getApps();
      const app =
        existingApps.find((a) => a.name === APP_NAME) ||
        initializeApp(
          {
            credential: cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          },
          APP_NAME
        );

      services = {
        adminAuth: getAuth(app),
        adminDb: getFirestore(app),
        error: null,
      };
      return services;
    } catch (err) {
      console.error('Failed to load Firebase Admin SDK:', err);
      initError = err.message || 'Firebase Admin initialization exception';
    }
  } else {
    initError = `Missing credentials: projectId=${!!projectId}, clientEmail=${!!clientEmail}, privateKey=${!!privateKey}`;
  }

  // Fallback when credentials are not configured or fail to initialize
  return {
    adminAuth: null,
    adminDb: null,
    error: initError,
  };
}
