# Public Pages & Sections

## Common Purpose

These pages are **publicly visible on the internet**.
They support **SEO**, **brand trust**, **discovery**, and **first-time user understanding**.

They should clearly answer:

* What is this platform?
* Why does it exist?
* Why should I trust and use it?

---

## Pages, URLs & Purpose

### **Home** — `/` | `/home` | `/homepage`

**Landing page of the platform**

Purpose:

* Clear introduction to what the platform is and why it exists
* Explain the core idea and philosophy
* Show how it is different from other social platforms
* Highlight main features and benefits
* Introduce the community aspect
* Build trust and curiosity
* Strong calls to action:

  * Join now
  * Explore communities
  * Try Incognito Help

Key sections:

* Hero message (short, strong, honest)
* What problem we solve
* How we are different
* Core features overview
* Community preview
* Call to action

---

### **About** — `/about`

**The story and intent behind the project**

Purpose:

* Explain *why* this project was created
* Share the motivation behind building it despite many existing platforms
* Clearly state the principles and values
* Compare with traditional social media:

  * What we avoid
  * What we do better
* Build emotional connection and trust
* End with a clear call to action

Extras:

* Creator’s note / vision
* Social links for transparency and reach

---

### **Contact** — `/contact`

**Open and welcoming communication page**

Purpose:

* Encourage users to reach out without fear
* Invite feedback, questions, reports, and support requests
* Show that real humans are listening

Contact form fields:

* First name
* Last name (optional)
* Email
* Reason for contact:

  * Query
  * Support
  * Feedback
  * Report
* Message
* Consent to receive emails

Additional content:

* Other ways to reach us (email, social handles)
* Expected response time (TAT)
* Friendly reassurance message

---

### **Features** — `/product-features`

**How the platform works**

Purpose:

* Explain the product in simple terms
* Walk users through the app workflow
* Explain how users interact with content and communities
* Introduce **Incognito (Lowkey Help) Mode**
* Explain achievements, badges, and recognition

Key sections:

* Platform overview
* How posting and interaction works
* Incognito Help mode (brief)
* Achievements and badges
* Safety-first design approach

---

### **Help (Incognito)** — `/help`

**Deep explanation of Incognito Help mode**

Purpose:

* Explain what Incognito Help is
* Why it exists
* When and how to use it
* Real-life examples (simple and relatable)

Important warning & guidance:

* People may share sensitive or emotional issues
* Respect is mandatory
* No blaming, shaming, or mocking
* No misleading or harmful advice
* Encourage empathy and responsibility

This page sets the **tone of humanity and safety**.

---

### **Community** — `/community-directory`

**Discover and build communities**

Purpose:

* Explain what communities are
* How they help people connect around interests
* How users can create a community
* Showcase:

  * Trending communities
  * New communities
  * Interest-based communities

Calls to action:

* Create a community
* Join a community

Also:

* Link clearly to Community Guidelines

---

### **Community Guidelines** — `/community-guidelines`

**Rules and behaviour framework**

Purpose:

* Define acceptable behaviour
* Rules for:

  * Creating communities
  * Managing communities
  * Posting and commenting
* Privacy expectations
* Reporting and moderation process

Tone:

* Firm but respectful
* Safety-first
* Community-driven

---

### **Privacy Policy** — `/privacy-policy`

**Transparency and trust**

Purpose:

* Clearly state that:

  * No personal data is collected for ads
  * Data is used only for platform functionality
* List all types of data collected
* Explain how data is stored and protected
* User rights:

  * Request their data
  * Request account deletion

Important note:

* Once an account is deleted:

  * All data is permanently removed
  * Nothing is recoverable

---

### **Sign Up** — `/signup`

**User registration page**

Purpose:

* Simple and fast onboarding
* Minimum required fields
* Clear consent and policy links
* Trust signals (privacy-first, no ads)

---

### **Login** — `/login`

**User access page**

Purpose:

* Secure login
* Easy recovery options
* Clear path to signup for new users

# Pages visible after login

Nice work so far. I’ve expanded your logged-in pages with extra pages, security, data model, UI patterns, moderation and operations needs. I used your “Thought / Problem / Achievement / Dilemma” post structure from your uploaded brief as a building block. 

Use this as a single reference spec you can hand to product, design or dev.

---

## Quick rules that apply to **every** logged-in page

* **Strict no-index:** add `<meta name="robots" content="noindex,nofollow">` on these pages and set `X-Robots-Tag: noindex, nofollow` in server responses.
* **Auth guard:** every route must require a valid session token (server-side check). No client-only gating.
* **No public caching:** set headers to prevent shared caches and proxies from serving content to unauthenticated users.
* **Audit & logging:** any read/write on user data must be logged to `audit_logs` with user, action, IP, time.
* **Rate limits:** protect composer, messaging and report endpoints from abuse (per-user and per-IP).
* **Input safety:** server-side input sanitisation, XSS protection, CSRF tokens on forms.
* **Encryption:** TLS in transit; sensitive fields (passwords, tokens) hashed/ encrypted at rest.
* **Soft-delete + 30-day window:** when user or community "delete" is requested, soft-delete immediately, remove public visibility, then hard-delete after configurable window (default 30 days). Allow restore within window. (You already described this—keep it.)
* **Accessibility & localisation:** keyboard nav, screen-reader labels, and local language support (Hindi, Tamil, Bengali, etc.) from day one.

---

## Core logged-in pages (enhanced)

### 1. Onboarding — `/onboarding`

* Show a short guided tour of features (composer, feed filters, incognito help, communities, privacy).
* Feature toggles for quick privacy setup (who can see posts, who can message).
* Prompt for first post with the **Thought / Problem / Achievement / Dilemma** templates (from your PDF) and a “Try Incognito Help” option. 
* Save a small default profile (avatar + bio) step so users appear friendly in communities.
* Track completion % and reward small reflection points for finishing.

---

### 2. Post composer / Post manager — `/post-composer` & `/post-manager`

Composer features:

* Draft autosave, undo, edit history (versioning), attachments (images, docs, links), tags, optional location, scheduled publishing.
* Option: **Mark as Help (Incognito)** — stores post in `incognito_posts`; author id hidden from public. Comments and feedback are linked but author identity is masked.
* Composer UX: show privacy selector (Public / Followers / Community-only / Incognito).
* Client-side validations + server-side checks for banned words/links.

Post manager:

* List of own posts with filters (all, drafts, incognito, scheduled).
* Edit, delete, duplicate, export (JSON), and view analytics (views, reactions, feedback counts).
* Version rollback to previous drafts.

---

### 3. Feed — `/feed`

Feed design & behaviour:

* Server-side feed API with cursor-based pagination. Query params: `filter=contacts|communities|nearby|interest|popular|help` + `sort=recent|trending|recommended`.
* Personalisation signals: follows, past reactions, community membership, recent searches, locality (optional).
* Clear affordance for reporting posts and users; quick access to block user.
* **Help posts**: visible to all but anonymous; include clear callout that identity is hidden. Provide an opt-in "request profile" or "request direct message" flow: request → recipient can accept/reject → if accept, restricts visibility to requester + accepter only.
* Post cards show reaction counts by type (not by user). Show Quick Actions: react, save (quiet engagement), feedback, share.
* Dedicated page for user’s saved/quiet-engagement items with notes.

Interactions (implement as separate resources in backend):

* **Quiet engagement**: `marks` table — private tags (Read carefully / Saved in mind / Inspired).
* **Reactions**: `reactions` table — type enum, show counts. No per-user reaction listing on public UI.
* **Feedbacks**: `feedbacks` table — subtypes: `empathic`, `constructive` (with structured fields), `integrate_source` (link + note). Add upvote/downvote on feedbacks (agree/disagree), but keep feedback author identity visible only according to privacy rules.
* **Share**: controlled share intents stored as `shares` (so you can audit and limit resharing of incognito content per community policy).

---

### 4. Profile pages — `/users/:username` & subpages

* Public profile shows: display name, avatar, bio, public posts, badges, achievements (optional toggle). No incognito posts shown to anyone but owner.
* `/:username/followers` and `/following` lists (with "mutual" and "close contact" tags).
* Privacy checks: profile visibility control (public / followers / private / community-only).
* Username policy: block reserved app-like names and offensive terms. Implement automated checks + manual appeals.
* Export profile data button (JSON/CSV) — triggers background job and email when ready.

---

### 5. Notifications — `/notifications`

* Notification kinds: reaction, feedback, mention, message, community-invite, moderation, system.
* Allow bulk actions (mark read/unread, mute source, save as important).
* Notification preferences per channel (in-app, email, push), and per type.
* Digest option (daily/weekly) to reduce noise.

---

### 6. Settings — `/settings`

Sections:

* Profile (name, username, avatar)
* Privacy (post visibility default, who can DM, block list)
* Notifications (as above)
* Security (password, 2FA, active sessions, sign-out everywhere)
* Points & Rewards (show balance, decay toggle, redemption history)
* Badges & Achievements (display preferences)
* Data (export, download, request deletion)
* Developer/API (personal API tokens with scopes, revoke)
* Legal (show T&Cs, policy links)

Account deletion flow:

* Soft delete immediate (profile hidden), 30-day window for restore, permanent purge after window. Show explicit confirmation and list of consequences.

---

### 7. Messages — `/messages`

* Threaded messages with read receipts (opt-in), attachments, message search.
* Privacy: allow "accept messages only from followers" or "allow requests" pattern.
* Block/report inline.
* Incognito special: if incognito user accepts DM request, the conversation is one-to-one but both sides can control what profile info is revealed, users can have conversation without revealing their profile through an incognito post.

---

### 8. Community pages — `/community/:handle` + admin views

Community public view:

* Community header (handle, description, rules), join/leave button, trending posts, pinned posts.

Community post composer & manager:

* Community-level composer inherits community rules, auto-tags, required fields (e.g., content warnings).
* Post visibility respects community settings: public / members only / moderated approval required.

Community members & roles:

* Roles: owner (creator), admin, moderator, member. Add `trusted` flag for community mentors.
* Invite flows, join requests, membership approval.

Community settings & moderation:

* Admin UI to edit settings, change visibility, configure post approvals, manage members, moderation logs, and set auto-moderation rules (bad words, blocked links).
* Soft-archive + 30-day deletion for communities.

Moderation page:

* Queue of reported posts/comments with priority scoring (severity + reports).
* Quick actions: warn, delete, mute, ban, escalate to Trust & Safety team.
* Case notes and appeal status tracked in `moderation_cases`.
* Audit trail for every moderator action.

Rulebook:

* Read-only `/community/:handle/rulebook` for members; include links to global community policy.

---

## Extra pages & admin / ops tools

### A. Trust & Safety dashboard (internal)

* Live queue of high-severity reports, response SLAs, metrics (average resolution time), repeat offenders.
* Case management with escalation to legal or emergency services (with a human review step).

### B. Moderator tools & training hub

* Macro moderation actions, canned responses, moderator conduct guide, and a training sandbox.

### C. Site admin console

* User search, suspend/reactivate accounts, scheduled maintenance, job queues, exports, database backup control.

### D. Analytics & Health dashboard

* Key metrics: DAU/MAU, feed health (time to first helpful reply for help posts), community growth, moderator load, false positive rate of auto-moderation.

---

## Data model (high level tables)

Keep these minimal and extensible. Each item should have created_at, updated_at, deleted_at for soft deletes.

* `users`
* `profiles` (profile fields separate for faster queries)
* `posts`
* `incognito_posts` (or posts with `is_incognito` + special access record)
* `post_versions`
* `reactions` (post_id, user_id, type)
* `marks` (quiet engagement; private to user)
* `feedbacks` (post_id, user_id, type, structured fields)
* `bookmarks`
* `communities`
* `community_members`
* `community_roles`
* `reports` (reporter_id, target_type, target_id, reason, severity)
* `moderation_cases`
* `messages` / `message_threads`
* `notifications`
* `audit_logs`
* `points` / `transactions`
* `badges`
* `exports` (export jobs)
* `sessions` (active sessions)

---

## API and backend patterns (brief)

* Use REST or GraphQL with cursor-based pagination for feeds.
* Keep reaction & feedback endpoints separate (so you can scale them independently).
* Webhooks: expose safe webhooks for external analytics or partner communities (with signed secrets).
* Background jobs: for export, scheduled posts, heavy moderation tasks.

---

## UX / microcopy and state handling (examples)

* Composer empty state: “Share a thought, problem or a win. Try our guided template.”
* Incognito badge copy: “Help — poster identity is hidden.” Hover tooltip explains the request-profile flow.
* Report flow: short form → optional screenshot → choose severity → confirm. Then show “We got it. We’ll review within 24 hours” (or show SLA tracker).
* Empty feed: “You don’t follow anyone yet. Try joining a community or follow suggested users.”
* Error states: show clear next steps and support contact.

---

## Safety, legal & operations

* **Moderation SLA**: set clear response times for harassment, self-harm, illegal content.
* **Escalation**: from auto-moderation → human moderator → Trust & Safety → legal (if needed).
* **Transparency**: publish quarterly transparency report with moderation stats (removals, appeals).
* **Data requests:** admin process to handle lawful requests; log every request and response.
* **Backups:** nightly backups, tested restores quarterly.

---

## Metrics to track (product + safety)

* Time to first helpful reply on help posts.
* % of help posts that receive a helpful reply within 24/72 hours.
* Moderator resolution time.
* Community retention and growth.
* Rate of false-positive auto-moderation.
* DAU/MAU, retention cohorts, average session length.


# Server / Site Admin Console — internal only, never public

An internal **Server / Site Admin Console**. It is *never* visible on the internet and is for authorised staff only (Trust & Safety, Legal, Ops, Product). I keep language simple and direct so devs, ops and legal can act on it.

---

# High-level rules (apply to whole admin console)

* **Access control:** admin access requires SSO + MFA. Use role-based access control (RBAC).
* **Principle of least privilege:** give minimum rights needed. Use temporary elevated roles for sensitive actions.
* **Two-person approval:** any destructive action (hard-delete, mass ban, legal hold release) needs two admins sign-off.
* **Full audit trail:** every admin action must be logged with admin id, IP, time, target, reason, and request metadata. Audit logs must be immutable (append-only).
* **Encrypted at rest & in transit:** admin console must only be available over private network/VPN and use TLS. Secrets stored in secret manager.
* **Rate limiting & throttles:** protect admin APIs against accidental mass operations.
* **Admin session timeout & re-auth:** short session TTL (say 1 hour) and re-auth for critical actions.
* **Admin UI + API:** all admin actions available via secure internal API (so automation and CLI tools can use it).
* **Backup & recovery:** daily backups, tested restores, and a documented recovery runbook.
* **Change log & versioning:** track changes to privacy policy, global guidelines and site settings with version number, author and notes.

---

# Top-level admin console sections (UI / API)

1. **Dashboard (Ops summary)**
2. **Users & Accounts**
3. **Communities**
4. **Content Moderation**
5. **Deletion & Recovery**
6. **Privacy Policy & Global Guidelines**
7. **Site Settings & Metadata**
8. **Security & Access**
9. **Audit Logs & Reports**
10. **System Tools & Maintenance**
11. **Automation & Rules Engine**
12. **Legal & Compliance**
13. **Backups & DR**
14. **Integrations & Webhooks**
15. **Help & Runbooks**

Below each section I list UI elements, actions, data fields, workflows and recommended safeguards.

---

# 1. Dashboard (Ops summary)

Purpose: quick view of site health and urgent items.

UI widgets:

* Active users (DAU/MAU), signups last 24h
* Current open moderation cases (by severity)
* Pending deletion requests (count)
* Pending appeals (count)
* Live system alerts (errors, failed jobs)
* Top 10 flagged keywords in last 24h
* Jobs queue status (backlog length)
* Backup last run / restore test last run
* Trust & Safety SLA meter (e.g., % cases closed within 24h)

Actions:

* Jump to any queue (moderation, deletion, appeals)
* Acknowledge and assign alerts

Security:

* Dashboard limited to Ops + Lead moderators.

---

# 2. Users & Accounts

Purpose: create, edit, restrict, suspend, ban, recover users.

UI / API operations:

* **Search & filter:** by user id, username, email, phone, IP, signup date, status.
* **View account:** profile, posts, communities, messages (metadata), last login, sessions, device list, linked emails, phone, 2FA status, points & badges, soft-delete timestamp if any.
* **Create user:** create account with email/phone and initial flags (role, verified, points). Add note/reason.
* **Edit user:** name, username, bio, email, phone, profile visibility, roles, manual verification status.
* **Suspend / unsuspend:** set suspension start/end, reason, appeal id. Suspension types: temporary, permanent.
* **Restrict actions:** disable posting, disable messaging, disable joining communities, restrict search, restrict reactions.
* **Ban user:** permanent ban, link to legal case if any.
* **Soft delete / hard delete:** soft-delete marks; hard delete requires two-person approval.
* **Recover user:** within soft-delete window, allow restore (restore posts, restore community memberships). Show dependencies and affected data.
* **Accept/reject deletion requests:** workflow to approve user-initiated deletion. If user requests deletion, admin can:

  * Accept immediate purge (rare), or
  * Approve soft-delete with 30-day window, or
  * Put hold (legal hold) if required by law enforcement (with reason and case id).
* **Manual export:** export user data (JSON/ZIP) for legal/data subject request.
* **Impersonate / preview:** view-as (read-only) to debug UX (must be logged in to audit and note impersonation).
* **Session & tokens:** view active sessions and revoke them individually or all.

Data & fields:

* user_id, username, email(s), phone(s), created_at, last_login, status, roles, suspension_reason, suspension_until, deletion_requested_at, deleted_at, deleted_by, locked_flags, notes, manual_flags.

Safeguards:

* Changing email or username must record old value and send verification email.
* Any restore or hard-delete action requires audit note and sign-off.

---

# 3. Communities

Purpose: manage creation, settings, members, deletes, visibility.

UI / API:

* **Search & view community:** handle, id, owner, created_at, members count, posts count, visibility, approval setting (open/approval/invite-only).
* **Edit community settings:** name, handle, description, icon/banner, visibility, default post visibility, rules text, tags, location, category.
* **Membership actions:** list members, promote/demote (owner, admin, mod, mentor), remove or restore members, invite/rescind invites.
* **Moderation actions:** delete or archive community, set soft-delete timer, transfer ownership, lock community (read-only), set automatic post approval rules.
* **Data export:** export community posts and member list (useful for legal requests).
* **View logs:** community-wise audit logs (who changed name, who removed user).
* **Approval queue:** view posts waiting for approval, bulk approve/reject.

Safeguards:

* Community deletion or transfer requires two-person approval if community large (threshold e.g., members > 1000).
* Notify community owner and admins on major changes.

---

# 4. Content Moderation

Purpose: manage reports, remove content, ban users, train auto-moderation.

UI / API:

* **Reports queue:** list reports with severity, type (harassment, illegal, copyright), reporter id (masked if anonymous), target (post/comment/profile), created_at, evidence (screenshots), status.
* **Triage view:** pick item, read context, see past actions on user, see similar reports.
* **Case actions:** warn user, remove content, temporarily hide (soft remove) content, permanently remove, escalate to Trust & Safety, add legal hold.
* **Batch actions:** remove multiple posts by user or by keyword.
* **Appeals queue:** see appeals, history, outcome, and re-instate content if appeal succeeds.
* **Moderator notes:** internal notes with tags, visible to other moderators.
* **Auto-moderation tuning:** view false positives, adjust blocked keywords and thresholds.
* **Moderation metrics:** per moderator stats (actions, reversal rate, avg handling time). These are private to admin leads.

Data fields:

* report_id, reporter_id, target_type, target_id, reason_code, severity, evidence_urls, status, assigned_moderator, actions_taken, case_notes.

Safeguards:

* Provide undo for moderator actions within short TTL.
* Track moderator actions in audit logs and require justification for permanent bans.

---

# 5. Deletion & Recovery

Purpose: manage user & community deletion requests and possible recovery.

Workflows:

* **User-initiated deletion request:** user requests deletion → create deletion_request record, send confirmation to user, set soft-delete (default 30 days), set recovery window, notify admin queue.
* **Admin acceptance / rejection:** admin can accept (start soft-delete) or reject (with reason).
* **Legal hold:** option to put hold on deletion (store reason & case id). If legal hold present, deletion cannot proceed until hold removed.
* **Hard delete flow:** after soft-delete window and no holds, a scheduled job performs hard delete. Admin can run immediate hard delete with two-person approval.
* **Recovery:** user or admin can restore during soft-delete window. Restoring returns posts, communities, credits, and other data. Show restore dependencies and conflicts.

UI items:

* pending deletion list with timers, reason, related reports, legal hold flag, restoration link.

Safeguards:

* Any immediate hard deletion must create a data export backup first and require sign-off.

---

# 6. Privacy Policy & Global Guidelines editor

Purpose: update policies, publish versions, rollout and communication.

Features:

* **Rich text editor** with markdown and WYSIWYG.
* **Versioning:** each save is a new version with author, date, changelog note.
* **Preview:** preview on staging and production (internal preview).
* **Diff view:** show differences between versions.
* **Approval workflow:** Draft → Legal review → Product/Trust & Safety review → Publish. Use two-person approval for major changes.
* **Publish scheduling:** schedule policy update for a future date/time.
* **User notification:** choose whether to notify users (email, in-app banner, digest). Edit text for notification.
* **Rollback:** quick rollback to previous version.
* **Audit:** who changed what, when, and notes.

Extra:

* **Global guidelines** for community mods (separate document) with same versioning and review.
* **Change log page** visible internally with user-facing summary of changes.

Compliance:

* Save each published policy version as immutable record for legal audit.

---

# 7. Site Settings & Metadata

Purpose: update site-wide config, contact info, social links, SEO metadata.

Settings list:

* **Contact emails:** support, abuse, press, legal — edit and test send.
* **Opening hours & TAT:** set office hours and TAT (e.g., moderation SLA, support SLA); TAT used in automated replies.
* **Social links:** add/enable/disable social links (Twitter, Instagram, LinkedIn). Toggle visibility.
* **Site metadata:** global site title, description, keywords (for public pages only), canonical domain, base URL (for building links).
* **SEO toggles:** enable/disable sitemap (internal), robots for public pages; but ensure logged-in pages always noindex.
* **Default privacy defaults:** default post visibility, default DM settings.
* **Feature flags:** toggle features on/off (composer fields, reactions, badges) for gradual rollout.
* **Localization:** default language, list of supported locales, date & time formats.
* **Email templates:** edit and preview system emails (welcome, deletion confirmation, policy update). Template versioning.
* **Push notifications config:** API keys, toggles.
* **Brand assets:** upload logos, favicon, legal footer text.

Safeguards:

* Track changes with author & timestamp. For critical public-facing items (policy, support address), require two-person approval.

---

# 8. Security & Access

Purpose: manage admin access, keys, SSO, WAF.

Features:

* **Admin users list:** create admin accounts, assign roles, view last login, sessions.
* **Audit & role change:** role change requires justification and is logged.
* **SSO settings:** configure identity provider, test connection.
* **MFA enforcement:** enforce on roles; view recovery tokens.
* **API keys & tokens:** list, create, revoke API tokens (scoped). Use secrets manager for storage.
* **IP allowlist / VPN configuration:** restrict admin console access to internal network or VPN.
* **WAF / firewall:** view blocked requests and whitelist IPs.
* **Vulnerability & patch status:** link to server patch records.
* **Security incidents:** dashboard for incidents and incident runbook.

Safeguards:

* Two-person approval for creating high-privilege roles and creating service accounts.

---

# 9. Audit Logs & Reports

Purpose: track all actions and generate reports for review or legal.

Logs:

* **Admin action logs:** admin_id, action, target_id, before/after, ip, user_agent, timestamp, request_id.
* **System logs:** job failures, email bounces, payment errors.
* **User activity logs:** login history, IPs, actions (post, delete, finance).
* **Moderation logs:** full case timeline.

Reports & exports:

* Export logs by user, community, or time-range (CSV/JSON) with access control.
* Scheduled reports: weekly moderation summary, monthly transparency.
* Search & filter logs with saved queries.

Retention:

* Define retention policy for logs (e.g., 1 year for admin logs, 7 years for legal requests) and be able to set legal holds to extend retention.

Safeguards:

* Logs are append-only and stored in secure archive. Access to logs restricted and audited.

---

# 10. System Tools & Maintenance

Purpose: operational controls for the site.

Tools:

* **Maintenance mode:** enable with message & ETA; schedule maintenance windows.
* **Cache controls:** clear CDN cache, purge pages, re-generate sitemap, reindex search.
* **Job queue monitor:** view queued jobs, retry, requeue, move to dead-letter.
* **Reindex search:** run full or partial reindex, show progress.
* **Database tools:** read-only DB clone for debugging, run safe queries (with approvals), export table snapshot.
* **Email testing:** send test email, check delivery logs, view bounces.
* **Feature flag management:** enable/disable for all users or subset.
* **System health checks:** view CPU, memory, DB load, error rate, latency.

Safeguards:

* Destructive DB actions need approvals and runbooks.

---

# 11. Automation & Rules Engine

Purpose: automate repetitive operations and escalate.

Features:

* **Keyword blocklist & allowlist:** manage global and community-level lists. Show hits and false positive rate.
* **Auto-actions:** if a post matches rules (keyword + severity + user history), automatically hide and create moderation case.
* **Auto-ban thresholds:** define thresholds based on number of reports in time window.
* **Scheduled tasks:** schedule messages, data exports, or maintenance tasks.
* **Workflow builder:** create automation steps (trigger → condition → actions).
* **Testing & staging:** test rules on staging dataset and show sample matches.

Safeguards:

* Always show sample items before enabling new auto-rule in production; require approver sign-off.

---

# 12. Legal & Compliance

Purpose: handle data subject requests, subpoenas, export controls.

Features:

* **Data Subject Requests (DSR):** intake form for requests (export, deletion, rectification). Track status, due dates, assigned owner, evidence.
* **Subpoena & law enforcement requests:** intake, legal review, redaction tools, response log. Support legal hold flagging.
* **Export & DPIA:** export user/community data with audit trail and encryption.
* **Policy archive:** keep prior policy versions and a record of user notices.
* **Breach & incident reporting:** logs for incidents, notification templates, regulator contact list.

Workflows:

* SLA settings for legal requests and tracking.
* Template responses for common legal scenarios.

Safeguards:

* Only Legal role can approve production release of data to law enforcement (unless emergency override with two-person sign-off).

---

# 13. Backups & Disaster Recovery (DR)

Purpose: ensure recoverability.

Controls:

* **Backup config:** schedule, frequency (daily/full weekly/incremental), retention.
* **Restore UI:** request restore by time range; test restore button to return sample data to staging.
* **Restore logs:** who requested, who approved, reason.
* **DR runbook:** steps for full-site restore, DNS change, failover cluster.
* **Restore tests:** scheduled quarterly test restores and results logged.

Safeguards:

* Test restore in staging only; production restore requires approval and runbook steps.

---

# 14. Integrations & Webhooks

Purpose: manage third-party connectors.

Features:

* **Connected apps list:** OAuth apps and tokens with scopes and last-used date.
* **Create & revoke webhooks:** set secret, endpoint, event types.
* **Third-party health:** webhook delivery failures and retry logs.
* **Partner dashboards:** status of integrations (analytics, notification providers).

Security:

* Use signed payloads and rate limits.

---

# 15. Help & Runbooks

Purpose: give admins operational guidance.

Content:

* **Runbooks:** step-by-step for common tasks (suspend user, emergency takedown, restore user, respond to legal request).
* **Contact list:** who to call for infra, legal, senior ops, CEO.
* **Escalation matrix:** when to escalate a case.
* **Training:** moderator training guide and quizzes.
* **Playbooks:** for mass-harassment events, data breach, or legal subpoenas.

---

# Permission matrix (example roles)

* **Super Admin:** full access (very few people). Two-person approval for destructive actions.
* **Ops Admin:** dashboards, system tools, backups, restores.
* **Trust & Safety Lead:** full moderation, case closure, appeals.
* **Moderator:** triage & actions, limited hard-delete.
* **Legal:** DSRs, subpoenas, hold, privacy policy approvals.
* **Product Admin:** feature flags, site settings, content of public pages (but not legal holds).
* **Support Agent:** view user data, export data, raise deletion or restore requests (cannot enact without higher approval).

---

# Sample data models (admin side)

* `admin_users` (admin_id, email, role, last_login, mfa_enabled, active)
* `admin_actions` (action_id, admin_id, action_type, target_type, target_id, before, after, reason, created_at, request_id)
* `deletion_requests` (id, user_id, requested_at, status, hold_flag, hold_reason, approved_by, approved_at)
* `moderation_cases` (case_id, reported_items[], severity, status, assigned_admin, actions[], created_at)
* `policy_versions` (policy_id, version, content, author_admin_id, notes, published_at)
* `backup_jobs` (job_id, started_at, completed_at, success, file_location)

---

# Example workflows (short)

1. **Accept user deletion request**

   * Admin views request → sees legal hold flag → if no hold, clicks Approve (note required) → system sets soft-delete timestamp (30 days) and schedules hard delete job → user sent confirmation email → add audit entry.

2. **Immediate recovery**

   * Admin opens deleted user → clicks Restore → shows dependencies → confirms → system restores user, re-indexes posts, clears soft-delete flag → audit log entry.

3. **Emergency takedown**

   * Moderator flags content as urgent → T&S Lead uses Emergency Takedown button → content hidden globally, related posts flagged, owner temporarily suspended, system emails legal & ops → two-person follow up required to make permanent.

4. **Publish privacy policy**

   * Product drafts → Legal reviews → two approvals → schedule publish → choose notification channel(s) → publish → system creates versioned record and send in-app banner + email.

---

# Alerts, monitoring & SLAs

* **Alerts:** high-severity reports, repeated abuse, spikes in signups, failed backups, system errors. Integrate with PagerDuty or equivalent.
* **SLA examples:** harassment cases: initial review within 2 hours, resolution target 24 hours; self-harm flags: within 1 hour. Set configurable SLAs and display SLA board.

---

# Useful admin UI components

* **Unified search bar** (user, post, community, case)
* **Bulk action tool** with preview and undo buffer
* **Timeline view** for user / community (shows major events)
* **Context panel** showing related entities (e.g., when viewing user, show related reports, communities, IPs)
* **Change preview & diff** (for policy / site settings)
* **Approval modal** with checklist for critical ops

---

# Final notes & next steps

If you want, I can now:

* Produce a **detailed ER diagram / SQL schema** for the admin tables.
* Draft **UI wireframes** for the admin console pages.
* Produce a **runbook** for deletion & recovery with exact commands and checks.
  Pick one and I’ll produce it right away.

Below is a **structured reward system design** for your platform.
It includes:

* Points logic
* Monthly cap
* Anti-abuse safeguards
* Default achievements
* Default badges
* Special internal badges
* Verification badges
* Backend admin panel structure

Language kept simple and practical.

---

# 1. Reflection Points System

## Purpose

Reward:

* Honest sharing
* Constructive engagement
* Helpful feedback
* Positive community behaviour

Not reward:

* Spam
* Low-effort reactions
* Quantity without quality

---

# 2. Monthly Points Limit

### Recommended Default:

**Maximum 1,000 points per user per calendar month**

Why:

* Prevent farming
* Encourage quality over quantity
* Maintain badge prestige

### Soft Limits (to prevent abuse)

* Max 100 points per day
* Max 30% of monthly points from one single activity type
* No points from self-interaction
* No points from repeated identical content

Admin configurable in backend.

---

# 3. Tasks That Reward Points

## A. Posting Activity

| Task                                                             | Points | Conditions               |
| ---------------------------------------------------------------- | ------ | ------------------------ |
| Create a public post (Thought / Problem / Achievement / Dilemma) | 15     | Minimum content length   |
| Create an Incognito Help post                                    | 20     | Encourages vulnerability |
| Post receives 5+ meaningful reactions                            | 10     | One-time reward          |
| Post receives 3+ constructive feedbacks                          | 15     | One-time reward          |
| Post marked as “Helpful” by author                               | 10     | For feedback providers   |

---

## B. Feedback & Engagement

| Task                                            | Points | Conditions                   |
| ----------------------------------------------- | ------ | ---------------------------- |
| Empathetic feedback                             | 5      | Must meet min word count     |
| Constructive feedback (structured)              | 15     | All 3 fields filled properly |
| Integrate source (resource sharing)             | 10     | Valid external link          |
| Feedback marked as “Helpful” by post owner      | +10    | Bonus                        |
| Agree/Disagree on feedback                      | 1      | Daily limit applies          |
| Meaningful reaction (Me too, Motivated me etc.) | 2      | Daily cap applies            |

---

## C. Community Participation

| Task                                        | Points            |
| ------------------------------------------- | ----------------- |
| Join a community                            | 5                 |
| Create a community                          | 30                |
| Community reaches 50 members                | 50 (Owner reward) |
| Moderate a reported post correctly          | 20 (Mods only)    |
| Receive 10+ positive reactions in community | 15                |

---

## D. Behaviour & Trust

| Task                               | Points |
| ---------------------------------- | ------ |
| Complete onboarding                | 10     |
| Verify profile (ID verified)       | 25     |
| Complete profile bio + photo       | 10     |
| Maintain 30 days without violation | 20     |
| First helpful reply on a Help post | 15     |

---

## E. Special Contributions

| Task                                        | Points |
| ------------------------------------------- | ------ |
| Participate in platform survey              | 10     |
| Report harmful content correctly            | 10     |
| Win monthly “Helpful Contributor” selection | 100    |

---

# 4. Anti-Abuse Rules

* AI moderation checks for spam farming
* Points revoked if:

  * Content deleted for violation
  * Fake engagement detected
* Points not given for:

  * Self reactions
  * Repeated copied comments
  * Bot behaviour
* Admin override allowed

---

# 5. Default Achievements (Milestone Based)

Achievements are milestone-based and permanent.

## Posting Achievements

* 🌱 First Post
* 🗣 Shared 10 Posts
* 📚 Shared 50 Posts
* 💭 100 Reflections Shared

## Help Achievements

* 🤝 First Help Given
* 🛟 10 People Helped
* 💙 50 Helpful Feedbacks

## Community Achievements

* 🏘 Community Starter (Created 1 community)
* 🏆 Community Builder (100 members reached)

## Trust Achievements

* 🔒 Verified Profile
* 📅 6 Months Active
* 🛡 No Violations for 1 Year

---

# 6. Default Badges (Public Display)

Badges can be:

* Permanent
* Toggle visibility on profile

## Contribution Badges

* Helpful Mind
* Deep Thinker
* Motivator
* Constructive Voice
* Community Pillar

## Activity Badges

* Consistent Contributor
* Early Member
* Reflection Champion

---

# 7. Special Badges (Admin Only)

These can only be assigned manually from backend.

## Internal Team Badges

* 🛠 Dev
* 🚀 Founder
* 🧭 Core Team
* 🛡 Trust & Safety
* 🎯 Moderator

These cannot be earned by users.

---

# 8. Verification Badges

## Verified Profile Badge

Meaning:
User has verified identity using government-issued ID.

Display text:

> Verified Profile — Identity confirmed using government-issued ID. This confirms the person is real. It does not endorse opinions or quality.

---

## Certified Therapist Badge

Requirements:

* Verified government ID
* Verified active professional licence number
* Manual admin approval

Display text:

> Certified Therapist — This user has verified their therapy licence. We confirm authenticity of licence, not quality of service or expertise level.

Important:

* Platform does NOT rank or promote based on this.
* No algorithm advantage.
* Clear disclaimer shown on profile.

---

## Other Professional Badges (Optional Future)

* Lawyer Verified
* Doctor Verified
* Educator Verified
* NGO Verified

All require:

* Identity verification
* Licence / registration proof
* Manual admin approval

---

# 9. Badge Levels (Optional Upgrade)

Some badges can have levels:

* Bronze
* Silver
* Gold
* Platinum

Based on point milestones.

---

# 10. Points Redemption (Optional Future Feature)

Points can be used for:

* Custom profile themes
* Special frame around avatar
* Featured post boost (limited & controlled)
* Donate points to community pool

Admin configurable.

---

# 11. Backend Admin Panel — Reward System Section

Create a dedicated section:

## Admin → Rewards & Recognition

Sub-sections:

### 1. Points Configuration

* Set monthly cap
* Set daily cap
* Edit task reward values
* Enable/disable specific tasks
* Revoke points manually
* View point history per user

---

### 2. Tasks Manager

Admin can:

* Create new task
* Edit points
* Set conditions
* Add expiration rule
* Enable / Disable
* Limit per month

Task fields:

* task_id
* name
* description
* points
* monthly_limit
* daily_limit
* is_active
* category
* created_by_admin

---

### 3. Achievements Manager

Admin can:

* Create milestone achievements
* Set required count
* Set badge icon
* Enable/disable
* Edit description

Fields:

* achievement_id
* name
* description
* milestone_value
* linked_task_type
* is_active

---

### 4. Badges Manager

Admin can:

* Create new badge
* Set type (Public / Admin-only / Verification)
* Upload icon
* Add disclaimer text
* Set eligibility logic
* Assign manually
* Remove badge
* Make badge non-removable (internal only)

Badge fields:

* badge_id
* name
* description
* badge_type
* is_public
* is_assignable
* requires_manual_review
* disclaimer_text
* icon_url

---

### 5. Verification Panel

Admin can:

* Review submitted ID documents
* Approve / Reject
* Upload proof file
* Add notes
* Assign verification badge

For professional verification:

* Upload licence document
* Verify licence number
* Set expiry date
* Auto-expire badge if licence expires

---

### 6. Points Audit

* View full points ledger
* Filter by user
* Filter by date
* Export CSV
* Detect abnormal activity
* Reverse transaction

Points ledger table:

* transaction_id
* user_id
* points_added
* reason
* related_post_id
* created_at
* revoked_flag

---

# 12. Safeguards

* Badge assignment logged in audit table
* Professional badges reviewed annually
* Auto-remove professional badge if licence expires
* Internal badges visible but cannot be edited by regular admins
* Monthly leaderboard optional but anonymised if needed

---

# 13. Transparency Section (User-Facing)

User can see:

* Their points earned this month
* Monthly cap remaining
* Achievements unlocked
* Badges earned
* Points history
* Why they lost points (if revoked)

---

# 14. Recommended Starting Configuration

* Monthly cap: 1000
* Daily cap: 100
* Constructive feedback high reward (15+)
* Simple reactions low reward (1–2)
* Help-post support high value
* Verification gives one-time reward only










# Compressed
---
**Complete, non-technical site structure for “The Good Internet / LowKey”**
All pages, user-facing flows, admin panels and backend functions are described fully. No technical schemas or code — only product, UX and operations details. Language is simple Indian English.

# Table of contents

1. Summary & goals
2. Public pages (SEO) — full list & details
3. Logged-in pages — full list & details
4. Post types, interactions & rules (user-facing)
5. Community features & flows
6. Rewards, achievements & badges (user-facing + admin controls)
7. Verification & professional badges (user-facing + admin controls)
8. Notifications, emails & system messages (user-facing)
9. Admin / Server console — full panels & operations (backend)
10. Moderation, escalation & SLAs (backend + user flows)
11. Privacy, data handling & deletion (user flows + admin controls)
12. Safety, accessibility & localisation (user-facing)
13. Onboarding, help & education (user-facing)
14. Release checklist & handover notes

---

# 1. Summary & goals

Purpose: Build a private-first social platform that helps people share thoughts, problems, achievements and dilemmas. The site must be safe, respectful and useful. Public pages should introduce the product and attract users. Logged-in pages must be functional, private and supportive. Admin console must let staff manage policy, safety, badges and system settings.

Success looks like:

* New users understand the product quickly.
* Help posts get useful replies fast.
* Communities are healthy and easy to manage.
* Admins can act quickly on safety and policy changes.
* Users feel safe, seen and rewarded.

---

# 2. Public pages (SEO) — full list & details

These pages are visible to everyone, indexed on search engines. They explain the product, give trust signals, and provide contact.

## 2.1 Home — `/`

Purpose: Hero message, quick benefits, calls to action.

Sections:

* Short mission line and one-line value.
* 3 core features: Incognito Help, Structured Feedback, Communities.
* How it works (3 steps, visual).
* Testimonials or community highlights.
* CTA buttons: Sign up, Explore communities.
* Footer with contact links and policy links.

## 2.2 About — `/about`

Purpose: Story, values, why we built it.

Sections:

* Founders note (concise).
* Principles: privacy, empathy, non-exploitative design.
* Short comparison with mainstream social apps.
* Team and contact links.

## 2.3 Contact — `/contact`

Purpose: Let people reach support or send feedback.

Form fields:

* First name, Last name (optional), Email, Reason (Query / Support / Feedback / Report), Message, Consent to receive emails.

Also show: support email addresses, estimated reply time (TAT), social links.

## 2.4 Features — `/product-features`

Purpose: Explain features with examples.

Sections:

* Composer basics.
* Incognito Help explained.
* Feedback types.
* Rewards and badges.
* Community tools.

## 2.5 Help (Incognito) explainer — `/lowkey-help`

Purpose: Detailed explanation of the Incognito Help feature.

Content:

* What it does and when to use it.
* Example posts and safe reply examples.
* Warnings about sensitive topics and respect rules.
* Emergency resources links (hotlines and crisis lines).

## 2.6 Community Directory — `/community-directory`

Purpose: Show trending and suggested communities with search and category filters.

## 2.7 Community Guidelines — `/community-guidelines`

Purpose: Public rules and expectations for behaviour.

## 2.8 Privacy Policy — `/privacy-policy`

Purpose: Full privacy text in clear language.

Key points:

* No personal data used for ads.
* Data collected for function only.
* Right to request export or deletion.
* Deletion process explained (soft-delete + time window).

## 2.9 Sign up — `/signup` & Login — `/login`

Purpose: Create or access account. Show privacy assurances and link to privacy policy.

---

# 3. Logged-in pages — full list & details

All logged-in pages must be private and never indexed. Each page description includes its purpose, required elements and user flows.

> Global rules for logged-in pages:
>
> * Must require login on server side.
> * Show clear privacy label on pages that contain user content.
> * Always allow easy access to report / block / help.

## 3.1 Dashboard / Home (logged-in) — `/home` or `/feed`

Purpose: Main personalised feed for the user.

Elements:

* Feed filters (All, Contacts, Communities, Nearby, Interests, Popular, Help).
* Sorting options (Recent, Trending, Recommended).
* Recommended actions: Create post, Join community, Try Incognito Help.
* Quick access to Messages, Notifications, New Post.

Flows:

* Each post shows reactions, feedback counts, save/mark options, share and report.
* Incognito posts have a clear “Anonymous / Help” badge with explanation.

## 3.2 Onboarding — `/onboarding`

Shown once after signup.

Steps:

1. Short guided tour.
2. Privacy settings (default visibility & DM rules).
3. Profile basics (display name + optional avatar).
4. First post prompt using templates (Thought / Problem / Achievement / Dilemma) or Incognito Help.
5. Small reward on completion.

## 3.3 Post Composer — `/post-composer`

Purpose: Create a new post.

Fields & options:

* Post type selector (Thought / Problem / Achievement / Dilemma / Help).
* Title (optional), Body (required), Tags, Community selector, Attachments, Content Warning checkbox.
* Privacy selector: Public / Followers / Community-only / Private / Incognito (Help).
* Save draft, schedule, autosave.
* Show preview and content policy hints.

Important behavior:

* When Incognito selected, warn user about identity being hidden and how reveal requests work.
* Show point reward estimate for posting (if applies).

## 3.4 Post Manager — `/post-manager`

Purpose: Manage own posts.

Actions:

* Edit post, Delete (soft), Duplicate, Export (JSON), View analytics (counts), Convert to/from scheduled.
* Incognito posts appear here but not on public profile.

## 3.5 Post view page — `/posts/:postId`

Purpose: Read a full post, see feedback and discussion.

Elements:

* Post content, tags, community.
* Reactions summary and reaction buttons.
* Feedback section with options to add empathic, constructive or resource feedback.
* Quiet engagement tools (private marks).
* Share and report.
* For help posts: “Request profile” and “Request DM” buttons with clear consent flow.

## 3.6 Feed filters & saved views — `/feed?filter=...`

Purpose: Save and use filters. Provide user-specific feeds like “Only Help posts” or “Community X only”.

## 3.7 Profile — `/users/:username`

Purpose: Show user public profile and tabs.

Sections:

* Header (avatar, display name, badges).
* Tabs: Posts, Help posts (owner-only), Feedback given, Bookmarks, Communities, Achievements, Followers, Following.
* Profile privacy settings link.

Privacy:

* Incognito posts not shown to others.
* Users can hide points or badges.

## 3.8 Notifications — `/notifications`

Purpose: Manage and view notifications.

Functions:

* Mark read/unread, mute source, bulk delete, go to linked item.

## 3.9 Settings — `/settings`

Purpose: Central control for account.

Sections:

* Profile (name, username, avatar)
* Privacy (default post visibility, who can message)
* Notifications (email, push, in-app)
* Security (password, 2FA)
* Points & Rewards (view balance and history)
* Badges & Achievements (manage visibility)
* Data (export, request delete)
* Developer & API (personal tokens — shown only if user enabled)
* Support & Legal

Account deletion flow:

* Request delete → confirm identity → show consequences → soft-delete begins (default 30 days) → allow restore within window.

## 3.10 Messages — `/messages`

Purpose: One-to-one conversations and requests.

Features:

* Threads view, send messages, attachments, search threads.
* Request to message flow (when privacy blocks direct messages).
* Block / report user inline.
* Archive and pin threads.

## 3.11 Community Directory & Community page — `/community/:handle`

Purpose: Explore and take part in community.

Community page sections:

* Header: description, rules, join/leave button, settings (owner/admin only).
* Tabs: Posts, About, Members, Events (optional), Moderation log (admins), Rulebook.
* Community composer (when joined).
* Pinned posts and announcements.

Community privacy:

* Public — anyone can view posts.
* Members-only — join to view.
* Invite-only — admins invite.

## 3.12 Community Settings — `/community/:handle/settings` (admins only)

Purpose: Manage community behaviour and appearance.

Actions:

* Edit name, description, icon and banner.
* Set privacy, post approval mode, tags, default post visibility.
* Invite and manage member roles.
* Configure community-specific blocked keywords and auto-approval rules.
* Archive or request deletion (soft-archive with restore window).

## 3.13 Community Moderation — `/community/:handle/moderation` (admins only)

Purpose: Approve/reject posts, manage reports and members.

Features:

* Report queue, bulk actions, member ban/unban, remove posts, warnings to members, case notes.

## 3.14 Community Rulebook — `/community/:handle/rulebook` (read-only)

Purpose: Show rules and moderation expectations to members.

## 3.15 Search — `/search`

Purpose: Find posts, users, communities. Filters for post type, community, date, and relevance.

## 3.16 Saved / Marks page — `/saved`

Purpose: Show user’s private marks and saved posts (Read carefully, Saved in mind, Inspired me to reflect). Allow notes and tags.

## 3.17 Help & Support — `/help` (logged-in)

Purpose: Quick access to FAQs, how-to, contact support, safety resources, report flow.

---

# 4. Post types, interactions & rules (user-facing)

This section lists all user actions and the exact expected behaviour.

## 4.1 Post types

* Thought — short reflection or idea.
* Problem — personal issue seeking help or clarity.
* Achievement — share wins.
* Dilemma — show two choices and ask for views.
* Help (Incognito) — author requests help and remains anonymous publicly.

## 4.2 Interactions

1. Quiet Engagement (private to user)

   * Read carefully
   * Saved in mind
   * Inspired me to reflect
   * Bookmark with note
   * These do not notify the post author.

2. Reactions (public counts)

   * Me too, Interesting, Unique, Loved it, Challenged me, Made me question, Relatable struggle, Motivated me
   * Show counts per reaction type, not who reacted.
   * Creator gets notified that someone reacted (but not who did what).

3. Feedback (structured)

   * Empathic perspective: free text to show empathy.
   * Constructive feedback: three fields — What's not working? What's working? What can be done?
   * Integrate source: link + short note.
   * Feedback may be anonymous at author’s choice (if allowed by system).
   * Feedback authors get notified if post owner marks feedback helpful.

4. Request Reveal / Request DM (for Incognito posts)

   * Request profile: asks the incognito author for permission to see identity.
   * Request DM: asks the author for permission to start a private conversation.
   * Author can accept/reject. If accept, identity revealed only to the requester. All actions are logged.

5. Share

   * Share to your profile or to another community (if community allows).
   * Shares from Incognito posts respect original privacy rules — Incognito posts cannot be shared with identity.

6. Report

   * Structured report form with reason, severity and optional screenshot.

## 4.3 Limits & anti-abuse (user-facing)

* No farming: repeated similar posts or low-effort posts will not give points and may be flagged.
* Reports and appeals are available and processed with SLA.
* Users can block other users and hide interactions from them.

---

# 5. Community features & flows

Clear steps for every community action.

## 5.1 Create Community

* User chooses name, handle, description, tags, visibility, rules.
* System warns about reserved names (like lowkey.admin).
* Creator becomes owner.

## 5.2 Join / Leave

* Public: join instantly.
* Members-only: request that admin approves.
* Invite-only: invite link or admin invite.

## 5.3 Roles & Permissions

* Owner (transferable)
* Admin (manage settings, members)
* Moderator (handle reports)
* Trusted / Mentor (special experts)
* Member (normal)

## 5.4 Moderation within community

* Reports go into moderation queue scoped to community.
* Admins/mods can warn, remove posts, ban users from community.
* Mods log reasons for actions (auditable).

## 5.5 Community Growth & owner rewards

* Owners get small points for hitting growth milestones (e.g., 50 members).
* Owners see a dashboard with member growth, post activity, and pending moderation items.

## 5.6 Community deletion/archival

* Owner can request archive or delete.
* Archive: community read-only, members notified.
* Delete: soft-delete with 30-day window, admins can restore or hard-delete after window.
* For large communities, deletion requires secondary admin approval.

---

# 6. Rewards, achievements & badges (user-facing + admin controls)

Complete definitions and rules, plus how admin can manage them.

## 6.1 Points (Reflection Points)

* Points encourage helpful sharing and feedback.
* Default monthly cap: **1,000 points**. Default daily cap: **100 points**.
* Points awarded for quality actions (posting, structured feedback, helpful replies).
* Points not awarded for spam, repeated identical posts, self-reactions.

## 6.2 Tasks & points (examples)

(These are defaults; admin can change later)

* Create public post: 15 pts
* Create Incognito Help post: 20 pts
* Post gets 5+ meaningful reactions: 10 pts
* Post gets 3+ constructive feedbacks: 15 pts
* Give constructive feedback (structured): 15 pts
* Give empathic feedback: 5 pts
* Give integrate-source feedback: 10 pts
* Complete onboarding: 10 pts
* Verify profile with ID: 25 pts
* Create community: 30 pts
* Join community: 5 pts
* Monthly “Helpful Contributor” winner: 100 pts

## 6.3 Achievements

Permanent milestones that show on profile.

Examples:

* First Post
* 10 Posts
* 50 Posts
* 100 Posts
* First Help Given
* 10 People Helped
* Community Starter
* 6 Months Active
* No Violations for 1 Year

## 6.4 Badges

Visible icons shown on profile. Two types: public badges (earned) and admin-only badges.

Public badges:

* Helpful Mind, Deep Thinker, Motivator, Constructive Voice, Community Pillar, Early Member

Admin-only badges (only assignable by staff):

* Dev, Founder, Core Team, Trust & Safety, Moderator

## 6.5 Verification badges

* Verified Profile (government ID verified): shows identity confirmed, not an endorsement.
* Certified Therapist (licence verified): shows licence checked, with disclaimer that quality is not judged.
* Other professional badges possible (Doctor Verified, Lawyer Verified) — admin must verify.

## 6.6 Points & badge UI for users

* Points balance shown in Settings and small badge on profile (option to hide).
* Monthly cap and remaining points visible.
* Points history with reasons for each credit.
* Achievements & badges page to view earned items and next goals.

## 6.7 Admin control over rewards

Admin panel lets staff:

* Create/edit tasks that give points.
* Create/edit achievements and badges.
* Assign admin-only badges.
* Review verification requests and assign verification badges.
* Revoke points if abuse confirmed.
* Set monthly and daily caps.

---

# 7. Verification & professional badges (user + admin)

Clear process for verification and staff controls.

## 7.1 User flow for verification

* User uploads a government ID (image) or licence document.
* User fills small verification request form that states purpose and consent for storage.
* Admin receives request, reviews documents, approves or rejects.
* On approval, user gets Verified Profile badge and notification. Points awarded once.
* For professional verification (Therapist), admin must manually check licence and approve. Badge shows expiry if licence has expiry date.

## 7.2 Admin verification controls

* Review queue with documents and notes.
* Approve or reject with notes and reason sent to user.
* Set expiry dates on professional badges and re-check on expiry.
* Encrypted or secure storage for sensitive docs (admin-only access).

## 7.3 Display & disclaimers

* Each verification badge shows short text on profile:

  * Verified Profile: “Identity confirmed via government ID.”
  * Certified Therapist: “Licence verified. We do not assess quality.”

---

# 8. Notifications, emails & system messages (user-facing)

List of common notifications, in-app messages and email templates and expected triggers.

## 8.1 In-app notifications

Triggers:

* Reaction on post
* Feedback on your post
* Feedback marked helpful
* Request profile or DM (for Incognito)
* Message received
* Community invite or join approval
* Moderator action on your content
* Verified profile approved / rejected
* Points awarded or revoked
* System announcements (policy changes)

Actions:

* Click notification to open context.
* Mark read/unread, mute source, delete.

## 8.2 Email templates (short list)

* Welcome email (after signup)
* Verify email / password reset
* Post flagged / removed (explain reason and appeal)
* Account deletion confirmation
* Verification result (approved/rejected)
* Policy updates (major changes)
* Monthly digest (optional)

Each email includes contact link for support and the TAT (editable by admin).

## 8.3 System banners & in-app notices

* Policy updates: banner with short summary + link.
* Emergency takedown: top banner when critical content is removed.
* Maintenance mode: site-wide message with ETA.

---

# 9. Admin / Server console — full panels & operations (backend)

This section describes the backend console and all actions admins need to run the site. No technical details, only functions and clear instructions.

> Access: Admin console is private only; staff must use secure access and two-person approval for serious actions.

## 9.1 Dashboard (overview)

Shows:

* Active users and signups
* Pending moderation cases
* Pending deletion requests
* Verification queue
* System alerts (failed jobs, backups)
* Top flagged keywords (last 24h)

Actions:

* Click into any queue, assign tasks, acknowledge alerts.

## 9.2 User management panel

Capabilities:

* Search user by email, username, or ID.
* View full user profile summary (posts, communities, status, verification).
* Create a user (support use).
* Edit user details (name, username, roles).
* Suspend or unsuspend user (with reason and time window).
* Restrict actions: block posting, messaging or community joining.
* Ban user permanently (requires reason & audit note).
* Soft-delete / restore user (handle deletion requests).
* Hard-delete user (requires two-person approval).
* Export user data for compliance requests and legal needs.
* Impersonate view-as (read-only) to debug issues (logged and audited).

## 9.3 Community admin panel

Capabilities:

* Search communities.
* View community summary (owner, members, posts).
* Edit community settings (name, handle, description).
* Change community visibility and join rules.
* Transfer ownership or add/remove admins/mods.
* Archive or delete community (soft-archive first with recall window).
* Export community content for legal requests.

## 9.4 Moderation console

Capabilities:

* View all reports and moderation cases.
* Triage: review context and history before action.
* Actions: warn user, remove content, soft-hide, ban from site or community, mark case resolved.
* Add internal notes and tags.
* Bulk actions: remove multiple posts by user or by keyword.
* Appeal processing: review and reinstate or uphold actions.
* Auto-moderation tuning: adjust keyword lists and thresholds (with test mode).

## 9.5 Verification console

Capabilities:

* View pending verification requests with uploaded documents.
* Approve or reject with notes.
* Assign verification badge and set expiry for professional badges.
* Revoke verification on evidence of fraud.
* Export verification records for audits.

## 9.6 Rewards & Badges console

Capabilities:

* Create and edit point-giving tasks (name, description, points, limits).
* Create and edit achievements (milestone rules and display text).
* Create and edit badges (icon, name, public/admin-only).
* Assign or revoke badges manually (admin-only badges require special role).
* View points ledger for each user and reverse transactions if needed.
* Set monthly/daily caps and special exceptions.

## 9.7 Policy & content editing

Capabilities:

* Edit Privacy Policy, Community Guidelines and other published docs.
* Version control: draft, review, approve and publish.
* Diff view for changes and rollback option.
* Schedule policy publish and choose notification channels (email/in-app banner).

## 9.8 Deletion & recovery console

Capabilities:

* See all user/community deletion requests.
* Place legal hold on an account or content.
* Approve or reject deletion request with note.
* Restore a soft-deleted account or community.
* Trigger hard-delete after approval (two-person sign-off if needed).
* Export a backup before hard-delete (recommended).

## 9.9 Settings & site metadata

Capabilities:

* Edit contact emails, social links, opening hours and TATs for support and moderation.
* Update global text seen on footers and support pages.
* Manage email templates and quick replies for support staff.
* Turn feature flags on or off (enable/disable features for all users).
* Manage site-wide banners and scheduled announcements.

## 9.10 Logs & audit panel

Capabilities:

* View admin action logs (who did what and when).
* View moderation case logs and user-facing action history.
* Export logs for legal or compliance needs.
* Impose retention rules and legal holds.

## 9.11 Safety & escalation panel

Capabilities:

* See list of urgent cases (self-harm, threats).
* Assign cases to Trust & Safety leads and track SLA.
* Trigger emergency takedown (hide content immediately and suspend user).
* Contact list for law enforcement or crisis partners, pre-filled templates for outreach.

## 9.12 Support & runbooks

Capabilities:

* Access to standard runbooks for common operations (suspend a user, restore account, handle legal request).
* Contact lists for infra, legal, senior ops.
* Training material for moderators.

---

# 10. Moderation, escalation & SLAs (backend + user flows)

Clear rules for how moderation works and expected timeframes.

## 10.1 Report flow (user)

* User reports content → Receives confirmation that report is received.
* System queues report based on severity and tags for moderator review.
* User gets update when action is taken (if allowed).

## 10.2 Moderator triage (backend)

Steps:

1. Automated triage: system tags severity and related history.
2. Moderator reviews context and decides action.
3. Actions logged and notification sent to user (unless safety prevents it).
4. If needed, escalate to Trust & Safety lead.

## 10.3 SLAs (default)

* Self-harm / suicide flags: initial triage within **1 hour**.
* High-severity harassment or credible threats: initial triage within **2 hours**, resolution aim **24 hours**.
* Medium severity: initial triage within **24 hours**.
* Low severity: within **72 hours**.
* Appeals: acknowledgement within **24 hours**, final decision within **7 days**.

SLAs should be visible on moderator dashboard and tracked.

## 10.4 Appeals

* User may appeal moderation actions. Appeal goes to a second reviewer. Outcome logged and notified.

## 10.5 Emergency takedown

* For urgent illegal or dangerous content, moderator can request emergency takedown. Trust & Safety lead executes and notifies legal/ops. Two-person follow up required to confirm permanent action.

---

# 11. Privacy, data handling & deletion (user flows + admin controls)

Clear, user-friendly process for data requests and deletion with admin safeguards.

## 11.1 User-facing data controls

* Export data: user requests full download of their data (posts, messages, badges). System notifies when ready.
* Delete account: user requests deletion → confirm identity → immediate public hiding (soft-delete) → permanent deletion after 30 days unless user restores.
* Temporary deactivation: user may deactivate account without permanent deletion.

## 11.2 Admin controls

* Approve or reject deletion requests, add legal holds if required.
* Export data for legal requests with audit trail.
* Hard-delete requires two-person approval and archived backup saved.

## 11.3 Retention & legal holds

* Soft-delete holds data for default 30 days.
* Legal holds override deletion and keep data until hold removed.
* All admin access to data is logged.

---

# 12. Safety, accessibility & localisation (user-facing)

How the product must behave to be inclusive and safe.

## 12.1 Safety features

* Clear reporting and blocking tools everywhere.
* Incognito Help has strong warnings and contact suggestions for hotlines.
* Moderators have triage queues and priority flags.
* System shows safety banners for sensitive topics.

## 12.2 Accessibility

* Keyboard navigation and focus states on all interactive elements.
* Screen reader-friendly labels and ARIA text.
* Colour contrast meets accessibility standards.
* Alternative text required for image uploads.

## 12.3 Localisation

* Default language: English (Indian).
* Support for Hindi and other major regional languages.
* Date & time shown in user’s locale.
* All public legal documents available in clear English; localised versions can be added.

---

# 13. Onboarding, help & education (user-facing)

All user education and help flows.

## 13.1 Onboarding flows

* Quick tour on first login.
* Suggested privacy defaults.
* Example posts and “how to reply” tips.
* Small task to make first post and reward points.

## 13.2 Help centre

* FAQ, how-to guides, safety resources.
* Short demo videos or GIFs for Composer, Feedback, Incognito flow.
* Contact support link and report form.

## 13.3 Moderator training

* Training hub inside admin: guidelines, dos and don’ts, sample cases, quizzes.
* Regular refreshers on policy changes.

---

# 14. Release checklist & handover notes

Final list for product handover — this is a product checklist only.

## 14.1 Must-have for launch (MVP)

* Public pages: Home, About, Contact, Privacy, Features, Community directory.
* Auth flows: Sign up, Login, Password reset.
* Composer with post types and Incognito Help.
* Feed with basic filters.
* Profile, Post manager, Messages, Notifications.
* Community create/join and basic moderation.
* Admin console with user search, suspend, deletion, verification queue.
* Points & badge system basic: points for posting, verification badge.
* Safety triage: report flow and moderator queue.
* Onboarding and help pages.
* Backups and runbook for emergency takedown.