-- LowKey - Policy Insertion Script
-- Drafted with the "Good Internet" philosophy: Calm, Direct, Human.

BEGIN;

-- 1. TERMS OF USE
-- Covers: Introduction, Terms, Account Policy, IP, Copyright, Security, Changes, Contact.
INSERT INTO policy_versions (doc_type, version, title, status, changelog_note, content)
VALUES (
  'terms_of_use',
  1,
  'Terms of Use',
  'published',
  'Initial Release',
  E'# LowKey Terms of Use\n\n**Last Updated:** February 11, 2026\n\nLowKey is a quiet space for thoughtful sharing. By using it, you agree to treat this space—and the people in it—with respect.\n\n## 1. The Basics\n\nYou agree that:\n*   You are at least 13 years old.\n*   You are a real person. We do not allow bots, automated scrapers, or fake accounts designed to deceive.\n*   You are responsible for the content you contribute. Your words are your own.\n*   You will not use LowKey for illegal activities or to harm the platform''s infrastructure.\n\n## 2. Your Account\n\nYou are welcome here as yourself.\n\n*   **One Account:** We encourage you to maintain a single primary identity. Creating multiple accounts to manipulate discussions, evade suspensions, or harass others is strictly prohibited.\n*   **Identity:** While many users verify their identity, pseudonyms are permitted as long as they are not impersonating others (e.g., admins, public figures, or other users).\n*   **Security:** You are responsible for keeping your access credentials secure. If you suspect a breach, contact us immediately.\n\n## 3. Intellectual Property\n\n*   **Your Content:** You own what you post. You grant LowKey a license to display, store, and moderate your content to operate the service, but we do not claim ownership of your ideas.\n*   **Our Content:** The LowKey interface, logo, and "Good Internet" branding are protected. Please do not use them without permission.\n\n## 4. Copyright & DMCA\n\nWe respect creative rights. If you believe content on LowKey infringes your copyright, please submit a takedown request to [legal@lowkey.com](mailto:legal@lowkey.com) with:\n\n1.  Proof of ownership.\n2.  The specific content URL.\n3.  A statement of good faith belief.\n\nWe process valid requests and remove infringing material under applicable laws.\n\n## 5. Security & Stability\n\nWe prioritize the safety of this space. You must not:\n*   Attempt to access non-public areas of our system.\n*   Introduce viruses, malware, or harmful code.\n*   Overload our servers (e.g., DDoS attacks).\n\n## 6. Changes to These Terms\n\nWe may update these terms as LowKey evolves. For significant changes, we will notify you directly. Continued use of the platform implies acceptance of the new terms.\n\n## 7. Contact Us\n\n*   **General:** [support@lowkey.com](mailto:support@lowkey.com)\n*   **Legal:** [legal@lowkey.com](mailto:legal@lowkey.com)'
)
ON CONFLICT (doc_type, version) DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 2. PRIVACY POLICY
-- Covers: Privacy, Data Usage, Cookies, Data Retention, Third-Party, Law Enforcement, Deletion.
INSERT INTO policy_versions (doc_type, version, title, status, changelog_note, content)
VALUES (
  'privacy_policy',
  1,
  'Privacy Policy',
  'published',
  'Initial Release',
  E'# LowKey Privacy Policy\n\n**Data exists to serve you, not to be sold.**\n\nWe collect the minimum data necessary to create a safe, functioning community. We do not sell your personal data to advertisers.\n\n## 1. What We Collect\n\n*   **Account Info:** Username, email, and password hash (encrypted). Date of birth (for age verification).\n*   **Activity:** Types of posts, comments, and reactions you create.\n*   **Technical Data:** IP address, device type, and login timestamps for security and moderation logs.\n*   **Verification Data:** If you verify your identity, we process your ID/license strictly for verification and do not store raw ID images longer than necessary.\n\n## 2. How We Use Data\n\nYour data is used solely to:\n*   Operate the platform (login, posting, notifications).\n*   Ensure safety (moderation, preventing abuse).\n*   Improve performance (fixing bugs, optimizing speed).\n\n**We do not use your private content to train generative AI models without your explicit consent.**\n\n## 3. Data Usage & Sharing\n\n*   **No Selling:** We do not sell your data.\n*   **Service Providers:** We may use trusted third parties for hosting (e.g., database), email delivery, and security. They are contractually bound to protect your data.\n*   **Legal Requests:** We do not voluntarily share data with law enforcement. We only comply with valid, legally binding court orders or warrants.\n\n## 4. Cookies\n\nWe use essential cookies for:\n*   Keeping you logged in.\n*   Remembering your preferences (e.g., dark mode).\n*   Security (CSRF protection).\n\nWe do not use third-party tracking cookies for behavioral advertising.\n\n## 5. Retention & Deletion\n\n*   **Retention:** We keep your data only as long as your account is active.\n*   **Deletion:** You can request account deletion at any time.\n    *   Your account is strictly deactivated immediately.\n    *   There is a **30-day recovery window** in case you change your mind.\n    *   After 30 days, your data is permanently erased from our active systems.\n\n## 6. Security\n\nWe use industry-standard encryption for passwords and data in transit. Access to user data is strictly restricted to authorized staff for maintenance and safety purposes only.'
)
ON CONFLICT (doc_type, version) DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 3. COMMUNITY GUIDELINES
-- Covers: Guidelines, Tone, Harassment, Hate Speech, Misinformation, Mental Health, Accessibility.
INSERT INTO policy_versions (doc_type, version, title, status, changelog_note, content)
VALUES (
  'community_guidelines',
  1,
  'Community Guidelines',
  'published',
  'Initial Release',
  E'# Community Guidelines\n\n**Think. Don''t perform.**\n\nLowKey is designed for conversation, not broadcast. To keep this space useful, we ask you to follow these principles.\n\n## 1. The Core Standard\n\nDisagreement is welcome. Disrespect is not.\n\nYou are here to share thoughts, solve problems, and reflect. You are not here to win arguments, chase clout, or demean others.\n\n## 2. Anti-Harassment\n\nWe have zero tolerance for:\n*   **Bullying:** Repeated unwanted contact, swarming, or targeted insults.\n*   **Doxxing:** Sharing private personal information of others without consent.\n*   **Threats:** Any expression of intent to harm a person, group, or property.\n\n## 3. Hate Speech & Extremism\n\nWe do not allow content that promotes violence or hatred against individuals or groups based on:\n*   Race or ethnicity\n*   Religion\n*   Gender identity or sexual orientation\n*   Disability\n*   Nationality\n\nDehumanizing language (comparing people to animals, insects, or filth) is strictly prohibited.\n\n## 4. Misinformation\n\nWe value truth. While we do not police every opinion, we may remove or label content that:\n*   Spreads proven falsehoods about public health or civic processes.\n*   Encourages dangerous actions based on false claims.\n*   Is orchestrated disinformation.\n\n## 5. Mental Health & Crisis\n\nLowKey is a support network, not a clinic. \n*   **Support:** You may discuss mental health challenges openly.\n*   **Self-Harm:** We do not allow content that *encourages* or *promotes* self-harm or eating disorders.\n*   **Crisis:** If you express immediate risk of self-harm, we may provide resources or, in extreme cases involving imminent threat to life, contact emergency services.\n\n## 6. Accessibility\n\nWe aim to be accessible to everyone.\n*   Please use **Alt Text** for images whenever possible.\n*   Avoid excessive flashing images.\n*   Use Clear language.\n\nLet''s build a quieter, smarter internet together.'
)
ON CONFLICT (doc_type, version) DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 4. CONTENT POLICY
-- Covers: Specific Content Rules, Prohibited Content, Child Safety.
INSERT INTO policy_versions (doc_type, version, title, status, changelog_note, content)
VALUES (
  'content_policy',
  1,
  'Content Policy',
  'published',
  'Initial Release',
  E'# Content Policy\n\nThis policy defines the boundaries of what can be hosted on LowKey.\n\n## 1. Prohibited Content\n\nWe strictly prohibit:\n*   **Illegal Acts:** Content promoting or soliciting illegal acts (e.g., selling drugs, weapons, or trafficked goods).\n*   **Sexual Exploitation:** Any non-consensual sexual content ("revenge porn") or sexual violence.\n*   **Gore & Violence:** Gratuitous, real-world violence posted for shock value.\n*   **Spam & Scams:** Phishing, fraud, or automated commercial spam.\n\n## 2. Child Safety\n\n**Zero Tolerance.**\nWe strictly prohibit any content depicting child sexual abuse or exploitation (CSAM). We report all such content to the NCMEC and relevant authorities immediately. We also prohibit content that grooms or endangers minors.\n\n## 3. Post Types\n\nUse the right format for your intent:\n*   **Thought:** For ideas and reflections.\n*   **Problem:** For challenges you are facing.\n*   **Dilemma:** When you are stuck between choices.\n*   **Achievement:** For genuine milestones, not bragging.\n*   **Help (Incognito):** For sensitive questions where you need privacy.\n\n## 4. Nudity & Adult Content\n\nLowKey is not a platform for pornography. Artistic nudity or health-related contexts (e.g., breastfeeding, medical recovery) may be allowed with proper content warnings/tags, but explicit sexual conduct is not permitted.'
)
ON CONFLICT (doc_type, version) DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 5. PLATFORM MECHANICS (Verification, Rewards, Moderation)
-- Covers: Verification types, Points system, Moderation process, Appeals.
INSERT INTO policy_versions (doc_type, version, title, status, changelog_note, content)
VALUES (
  'other',
  1,
  'Platform Mechanics: Verification, Rewards & Moderation',
  'published',
  'Initial Release',
  E'# Platform Mechanics\n\nTransparency on how our specific features work.\n\n## 1. Verification\n\nVerification is about trust, not status.\n\n*   **ID Verification:** Confirms you are a real person matching your name. It does not endorse your character.\n*   **Professional Verification:** (e.g., "Certified Therapist"). Confirms you hold a valid, active license in your jurisdiction. \n    *   *Disclaimer:* This verifies *credentials*, not quality of care. LowKey does not employ these professionals and is not responsible for their advice.\n\n## 2. Points & Rewards\n\nWe use "Reflection Points" to recognize contribution, not popularity.\n*   **Earning:** Points are awarded for helpful feedback, thoughtful posts, and community support.\n*   **Caps:** Points are capped daily and monthly. You cannot "grind" your way to influence.\n*   **Badges:** Badges recognize sustained behavior (e.g., "Deep Thinker"), not short-term virality.\n\n## 3. Moderation & Enforcement\n\nWe use a mix of automated tools and human review.\n*   **Reporting:** You can report content that violates our policies. Reports are anonymous to the author.\n*   **Actions:** We may warn, hide content, suspend, or ban accounts depending on severity.\n*   **Emergency:** We have tools for rapid takedown of dangerous content.\n\n## 4. Appeals\n\nIf we got it wrong, tell us. \n*   You can appeal moderation decisions through the app.\n*   Appeals are reviewed by a different moderator whenever possible.\n*   We aim to be fair, but safety comes first.'
)
ON CONFLICT (doc_type, version) DO UPDATE SET
  content = EXCLUDED.content,
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  updated_at = NOW();

COMMIT;
