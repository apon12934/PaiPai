# 🛡️ PaiPai Security Notice: Firestore Rules

**CRITICAL SECURITY ACTION REQUIRED**

Because PaiPai is a purely client-side application (JAMstack), your Firebase database is accessed directly from the user's browser. If your Firestore Security Rules are left as the default (e.g., `allow read, write: if request.auth != null;`), **ANY logged-in user can read, modify, or delete the transaction history of ANY OTHER USER.**

You must immediately apply the following strict security rules in your Firebase Console to properly isolate each user's data.

## How to Secure Your Database

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your PaiPai project.
3. Click on **Firestore Database** in the left sidebar.
4. Click on the **Rules** tab at the top.
5. Replace the existing code with the exact rules below:

\`\`\`javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Completely lock down the database by default
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Only allow users to read and write to their OWN specific document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
  }
}
\`\`\`

6. Click **Publish**.

This guarantees that an attacker cannot spoof another user's UID to steal their data or manipulate their balances.
