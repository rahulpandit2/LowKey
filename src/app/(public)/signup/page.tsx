import type { Metadata } from 'next';

import SignupForm from './components/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up - LowKey',
  description: 'Join LowKey and start your thoughtful journey with email or pseudonymous handle.',
};

export default function SignupPage() {
  return (
    <>
      <main className="min-h-screen pt-12 flex items-center justify-center">
        <SignupForm />
      </main>
    </>
  );
}
