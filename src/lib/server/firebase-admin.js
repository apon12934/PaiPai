import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function initAdmin() {
  if (getApps().length > 0) {
    const app = getApps()[0];
    return {
      adminAuth: getAuth(app),
      adminDb: getFirestore(app),
    };
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (privateKey) {
    // Replace escaped newlines if passed in via string env
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (projectId && clientEmail && privateKey) {
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    return {
      adminAuth: getAuth(app),
      adminDb: getFirestore(app),
    };
  }

  // Fallback for default application credentials (e.g. Google Cloud / Firebase Hosting environment)
  try {
    const app = initializeApp({ projectId });
    return {
      adminAuth: getAuth(app),
      adminDb: getFirestore(app),
    };
  } catch (err) {
    console.warn('Firebase Admin SDK initialized in unauthenticated mode:', err.message);
    return {
      adminAuth: null,
      adminDb: null,
    };
  }
}

let services = null;

export function getAdmin() {
  if (!services) {
    services = initAdmin();
  }
  return services;
}
