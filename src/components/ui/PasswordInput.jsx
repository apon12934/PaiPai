'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Modern, clean PasswordInput with SVG toggle icon.
 * Preserves all standard HTML input properties and styling while preventing text overlap.
 */
export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  className = '',
  required = false,
  minLength,
  id,
  name,
  autoComplete,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex items-center w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        id={id}
        name={name}
        autoComplete={autoComplete}
        className={`w-full pr-10 ${className}`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        tabIndex={-1}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-2.5 p-1 rounded text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors focus:outline-none"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4 stroke-[1.75]" />
        ) : (
          <Eye className="w-4 h-4 stroke-[1.75]" />
        )}
      </button>
    </div>
  );
}
