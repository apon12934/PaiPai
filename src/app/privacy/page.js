export const metadata = {
  title: 'Privacy Policy - PaiPai',
  description: 'Privacy Policy for PaiPai Debt Tracker',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-200 p-8 md:p-16 flex justify-center">
      <div className="max-w-3xl w-full space-y-8 animate-fade-in">
        
        <div className="border-b border-slate-200 dark:border-white/10 pb-6">
          <h1 className="text-3xl font-black tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-400">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">1. Information We Collect</h2>
            <p>
              PaiPai collects basic profile information securely provided by Google Authentication (such as your email address and name) 
              solely for the purpose of identifying your account. We also store the transaction data you manually input into the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">2. How We Use Your Information</h2>
            <p>
              Your data is strictly used to provide the core functionality of the PaiPai application (tracking debts and expenses). 
              We do not sell, rent, or share your personal information or transaction history with any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">3. Data Storage & Security</h2>
            <p>
              Your data is securely stored using Google Firebase Firestore. Authentication is handled directly by Google Identity services. 
              We utilize strict database security rules to ensure that your data can only be accessed by you when you are authenticated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">4. Contact</h2>
            <p>
              If you have any questions or concerns about this privacy policy or your data, please contact the developer via the support email provided on the Google Authentication screen.
            </p>
          </section>
        </div>
        
        <div className="pt-8">
          <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-sm">
            &larr; Return to Application
          </a>
        </div>

      </div>
    </div>
  );
}
