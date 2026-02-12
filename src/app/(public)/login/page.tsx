import type { Metadata } from 'next';

import LoginForm from './components/LoginForm';

export const metadata: Metadata = {
  title: 'Login - LowKey',
  description: 'Sign in to LowKey with your email or pseudonymous handle.',
};

export default function LoginPage() {
  return (
    <>
      <main className="min-h-screen pt-12 flex items-center justify-center">
        <LoginForm />
      </main>
    </>
  );
}
