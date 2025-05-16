'use client';

import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
      <LoginForm />
    </div>
  );
}
