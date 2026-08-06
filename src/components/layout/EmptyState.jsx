'use client';

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-transparent">
      <div className="w-16 h-16 mb-4 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-slate-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-slate-300 mb-2">Select a person</h2>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        Choose someone from the sidebar or add a new person to start tracking your balances.
      </p>
    </div>
  );
}
