import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Guidelines - LowKey',
  description: 'The principles that keep LowKey a quiet, thoughtful place.',
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
          Think. <span className="text-zinc-600 italic">Don't perform.</span>
        </h1>

        <div className="prose prose-invert prose-lg max-w-none text-zinc-400 font-light space-y-12">
          <p className="text-xl leading-relaxed border-l-2 border-white pl-6">
            LowKey is designed for conversation, not broadcast. To keep this space useful, we ask
            you to follow these principles.
          </p>

          <section>
            <h2 className="text-3xl font-serif text-white mb-4">1. The Core Standard</h2>
            <p className="mb-4">Disagreement is welcome. Disrespect is not.</p>
            <p>
              You are here to share thoughts, solve problems, and reflect. You are not here to win
              arguments, chase clout, or demean others.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif text-white mb-4">2. Anti-Harassment</h2>
            <p>We have zero tolerance for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>Bullying:</strong> Repeated unwanted contact, swarming, or targeted insults.
              </li>
              <li>
                <strong>Doxxing:</strong> Sharing private personal information of others without
                consent.
              </li>
              <li>
                <strong>Threats:</strong> Any expression of intent to harm a person, group, or
                property.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-serif text-white mb-4">3. Hate Speech</h2>
            <p>
              We do not allow content that promotes violence or hatred against individuals or groups
              based on race, religion, gender identity, sexual orientation, disability, or
              nationality.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif text-white mb-4">4. Mental Health & Crisis</h2>
            <p>LowKey is a support network, not a clinic.</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>Support:</strong> You may discuss mental health challenges openly.
              </li>
              <li>
                <strong>Self-Harm:</strong> We do not allow content that encourages or promotes
                self-harm.
              </li>
            </ul>
          </section>

          <div className="pt-12 border-t border-white/[0.08]">
            <p className="text-sm text-zinc-500">Last updated: February 11, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
