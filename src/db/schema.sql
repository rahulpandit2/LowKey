-- ============================================================================
-- LowKey — The Good Internet Project
-- Full PostgreSQL Database Schema
-- Generated: 2026-02-11
-- ============================================================================

BEGIN;

-- ──────────────────────────────────────────────────────────────────────────────
-- 0. EXTENSIONS & UTILITY
-- ──────────────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. ENUM TYPES
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned', 'deactivated', 'soft_deleted');
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin', 'super_admin');

CREATE TYPE post_type AS ENUM ('thought', 'problem', 'achievement', 'dilemma', 'help');
CREATE TYPE post_visibility AS ENUM ('public', 'followers', 'community_only', 'private', 'incognito');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'scheduled', 'hidden', 'removed', 'soft_deleted');

CREATE TYPE reaction_type AS ENUM (
  'me_too', 'interesting', 'unique', 'loved_it', 'challenged_me',
  'made_me_question', 'relatable_struggle', 'motivated_me'
);

CREATE TYPE feedback_type AS ENUM ('empathic', 'constructive', 'integrate_source');
CREATE TYPE feedback_vote_type AS ENUM ('agree', 'disagree');

CREATE TYPE mark_type AS ENUM ('read_carefully', 'saved_in_mind', 'inspired_to_reflect');

CREATE TYPE community_visibility AS ENUM ('public', 'members_only', 'invite_only');
CREATE TYPE community_join_type AS ENUM ('open', 'approval', 'invite_only');
CREATE TYPE community_status AS ENUM ('active', 'archived', 'soft_deleted');
CREATE TYPE community_member_role AS ENUM ('owner', 'admin', 'moderator', 'mentor', 'member');

CREATE TYPE message_request_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE thread_status AS ENUM ('active', 'archived', 'blocked');

CREATE TYPE notification_kind AS ENUM (
  'reaction', 'feedback', 'feedback_helpful', 'mention', 'message',
  'community_invite', 'join_request', 'moderation', 'system',
  'verification', 'points', 'badge', 'achievement',
  'reveal_request', 'dm_request', 'follow', 'appeal_result'
);
CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'push');

CREATE TYPE report_reason AS ENUM (
  'harassment', 'hate_speech', 'threats', 'self_harm', 'illegal',
  'copyright', 'misinformation', 'spam', 'impersonation',
  'explicit_content', 'other'
);
CREATE TYPE report_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE report_target_type AS ENUM ('post', 'comment', 'feedback', 'profile', 'message', 'community');
CREATE TYPE report_status AS ENUM ('open', 'in_review', 'resolved', 'dismissed', 'escalated');

CREATE TYPE moderation_action_type AS ENUM (
  'warn', 'remove_content', 'soft_hide', 'suspend_user', 'ban_user',
  'ban_from_community', 'mute', 'restrict_posting', 'restrict_messaging',
  'restrict_community', 'escalate', 'emergency_takedown', 'reinstate',
  'dismiss'
);

CREATE TYPE case_status AS ENUM ('open', 'assigned', 'in_progress', 'resolved', 'appealed', 'closed');

CREATE TYPE badge_type AS ENUM ('public', 'admin_only', 'verification');
CREATE TYPE badge_level AS ENUM ('bronze', 'silver', 'gold', 'platinum');

CREATE TYPE verification_type AS ENUM ('identity', 'therapist', 'doctor', 'lawyer', 'educator', 'ngo');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'expired', 'revoked');

CREATE TYPE deletion_target_type AS ENUM ('user', 'community');
CREATE TYPE deletion_status AS ENUM ('pending', 'approved', 'rejected', 'soft_deleted', 'hard_deleted', 'restored', 'on_hold');

CREATE TYPE export_status AS ENUM ('queued', 'processing', 'completed', 'failed');
CREATE TYPE export_type AS ENUM ('user_data', 'community_data', 'audit_logs', 'legal');

CREATE TYPE contact_reason AS ENUM ('query', 'support', 'feedback', 'report');

CREATE TYPE admin_role AS ENUM (
  'super_admin', 'ops_admin', 'trust_safety_lead', 'moderator',
  'legal', 'product_admin', 'support_agent'
);

CREATE TYPE suspension_type AS ENUM ('temporary', 'permanent');

CREATE TYPE policy_doc_type AS ENUM (
  'privacy_policy', 'community_guidelines', 'terms_of_use', 'content_policy', 'other'
);
CREATE TYPE policy_status AS ENUM ('draft', 'in_review', 'approved', 'published', 'archived');

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. USERS & AUTH
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username        VARCHAR(50) UNIQUE NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  phone           VARCHAR(30) UNIQUE,
  password_hash   TEXT NOT NULL,
  status          user_status NOT NULL DEFAULT 'active',
  role            user_role NOT NULL DEFAULT 'user',
  email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  phone_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret      TEXT,
  date_of_birth   DATE,
  last_login_at   TIMESTAMPTZ,
  last_login_ip   INET,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  suspension_reason    TEXT,
  suspension_type      suspension_type,
  suspension_until     TIMESTAMPTZ,
  locked_flags         JSONB DEFAULT '{}',
  manual_flags         JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name    VARCHAR(100),
  bio             TEXT,
  avatar_url      TEXT,
  location        VARCHAR(255),
  website         VARCHAR(512),
  visibility      post_visibility NOT NULL DEFAULT 'public',
  default_post_visibility  post_visibility NOT NULL DEFAULT 'public',
  allow_dms_from  VARCHAR(30) NOT NULL DEFAULT 'followers',  -- 'everyone', 'followers', 'nobody'
  show_points     BOOLEAN NOT NULL DEFAULT TRUE,
  show_badges     BOOLEAN NOT NULL DEFAULT TRUE,
  show_achievements BOOLEAN NOT NULL DEFAULT TRUE,
  locale          VARCHAR(10) DEFAULT 'en-IN',
  timezone        VARCHAR(50) DEFAULT 'Asia/Kolkata',
  points_balance  INTEGER NOT NULL DEFAULT 0,
  points_earned_this_month INTEGER NOT NULL DEFAULT 0,
  points_month_reset_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash      TEXT NOT NULL UNIQUE,
  ip_address      INET,
  user_agent      TEXT,
  device_info     JSONB,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_blocks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (blocker_id, blocked_id)
);

CREATE TABLE follows (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_close_contact BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, following_id)
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. POSTS & CONTENT
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  community_id    UUID,  -- FK added after communities table
  title           VARCHAR(300),
  body            TEXT NOT NULL,
  post_type       post_type NOT NULL DEFAULT 'thought',
  visibility      post_visibility NOT NULL DEFAULT 'public',
  status          post_status NOT NULL DEFAULT 'published',
  is_incognito    BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned       BOOLEAN NOT NULL DEFAULT FALSE,
  content_warning BOOLEAN NOT NULL DEFAULT FALSE,
  content_warning_text VARCHAR(255),
  location        VARCHAR(255),
  scheduled_at    TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  view_count      INTEGER NOT NULL DEFAULT 0,
  reaction_count  INTEGER NOT NULL DEFAULT 0,
  feedback_count  INTEGER NOT NULL DEFAULT 0,
  share_count     INTEGER NOT NULL DEFAULT 0,
  current_version INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE post_versions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  version_number  INTEGER NOT NULL,
  title           VARCHAR(300),
  body            TEXT NOT NULL,
  edited_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, version_number)
);

CREATE TABLE tags (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(100) UNIQUE NOT NULL,
  slug            VARCHAR(100) UNIQUE NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE post_tags (
  post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id          UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE post_attachments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  file_url        TEXT NOT NULL,
  file_type       VARCHAR(50),
  file_size_bytes BIGINT,
  alt_text        TEXT,
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. INTERACTIONS
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE reactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reaction        reaction_type NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, user_id, reaction)
);

CREATE TABLE feedbacks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feedback_type   feedback_type NOT NULL,
  body            TEXT,
  -- constructive fields
  whats_not_working TEXT,
  whats_working     TEXT,
  what_can_be_done  TEXT,
  -- integrate-source fields
  source_url      TEXT,
  source_note     TEXT,
  is_anonymous    BOOLEAN NOT NULL DEFAULT FALSE,
  is_helpful      BOOLEAN NOT NULL DEFAULT FALSE,  -- marked by post owner
  agree_count     INTEGER NOT NULL DEFAULT 0,
  disagree_count  INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE feedback_votes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id     UUID NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote            feedback_vote_type NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (feedback_id, user_id)
);

CREATE TABLE marks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mark            mark_type NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, user_id, mark)
);

CREATE TABLE bookmarks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note            TEXT,
  tags            TEXT[],
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, user_id)
);

CREATE TABLE shares (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_community_id UUID,  -- FK added later
  share_context   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reveal_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  requester_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_type    VARCHAR(20) NOT NULL CHECK (request_type IN ('profile', 'dm')),
  status          message_request_status NOT NULL DEFAULT 'pending',
  responded_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, requester_id, request_type)
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. COMMUNITIES
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE communities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  handle          VARCHAR(100) UNIQUE NOT NULL,
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  icon_url        TEXT,
  banner_url      TEXT,
  owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  visibility      community_visibility NOT NULL DEFAULT 'public',
  join_type       community_join_type NOT NULL DEFAULT 'open',
  status          community_status NOT NULL DEFAULT 'active',
  default_post_visibility post_visibility NOT NULL DEFAULT 'public',
  post_approval_required  BOOLEAN NOT NULL DEFAULT FALSE,
  category        VARCHAR(100),
  location        VARCHAR(255),
  member_count    INTEGER NOT NULL DEFAULT 0,
  post_count      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

-- Add deferred FKs for posts and shares
ALTER TABLE posts ADD CONSTRAINT fk_posts_community FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL;
ALTER TABLE shares ADD CONSTRAINT fk_shares_target_community FOREIGN KEY (target_community_id) REFERENCES communities(id) ON DELETE SET NULL;

CREATE TABLE community_members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            community_member_role NOT NULL DEFAULT 'member',
  is_trusted      BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (community_id, user_id)
);

CREATE TABLE community_join_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          message_request_status NOT NULL DEFAULT 'pending',
  reviewed_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (community_id, user_id)
);

CREATE TABLE community_invites (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  inviter_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitee_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  invite_token    VARCHAR(128) UNIQUE,
  status          message_request_status NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ
);

CREATE TABLE community_rules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  rule_text       TEXT NOT NULL,
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE community_blocked_keywords (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id    UUID REFERENCES communities(id) ON DELETE CASCADE, -- NULL = global
  keyword         VARCHAR(255) NOT NULL,
  is_global       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE community_tags (
  community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  tag_id          UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (community_id, tag_id)
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. MESSAGING
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE message_threads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status          thread_status NOT NULL DEFAULT 'active',
  is_incognito    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE message_thread_participants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id       UUID NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_pinned       BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived     BOOLEAN NOT NULL DEFAULT FALSE,
  last_read_at    TIMESTAMPTZ,
  profile_revealed BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (thread_id, user_id)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id       UUID NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body            TEXT NOT NULL,
  attachment_url  TEXT,
  attachment_type VARCHAR(50),
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE message_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_preview TEXT,
  status          message_request_status NOT NULL DEFAULT 'pending',
  thread_id       UUID REFERENCES message_threads(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at    TIMESTAMPTZ,
  UNIQUE (sender_id, recipient_id)
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 7. NOTIFICATIONS
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind            notification_kind NOT NULL,
  title           VARCHAR(255),
  body            TEXT,
  data            JSONB DEFAULT '{}',  -- target_type, target_id, actor_id, etc.
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  is_important    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notification_preferences (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind            notification_kind NOT NULL,
  channel         notification_channel NOT NULL,
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (user_id, kind, channel)
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 8. REWARDS, BADGES & ACHIEVEMENTS
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE point_tasks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  points          INTEGER NOT NULL,
  category        VARCHAR(100),
  monthly_limit   INTEGER,
  daily_limit     INTEGER,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  conditions      JSONB DEFAULT '{}',
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE point_transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id         UUID REFERENCES point_tasks(id) ON DELETE SET NULL,
  points          INTEGER NOT NULL,  -- positive = credit, negative = debit/revoke
  reason          TEXT,
  related_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  related_feedback_id UUID REFERENCES feedbacks(id) ON DELETE SET NULL,
  is_revoked      BOOLEAN NOT NULL DEFAULT FALSE,
  revoked_reason  TEXT,
  revoked_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE achievements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  icon_url        TEXT,
  milestone_value INTEGER NOT NULL,
  linked_task_type VARCHAR(100),
  category        VARCHAR(100),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id  UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

CREATE TABLE badges (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  badge_type      badge_type NOT NULL DEFAULT 'public',
  level           badge_level,
  icon_url        TEXT,
  is_public       BOOLEAN NOT NULL DEFAULT TRUE,
  is_assignable   BOOLEAN NOT NULL DEFAULT TRUE,
  requires_manual_review BOOLEAN NOT NULL DEFAULT FALSE,
  disclaimer_text TEXT,
  eligibility     JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_badges (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id        UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  assigned_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  is_visible      BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at      TIMESTAMPTZ,
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at      TIMESTAMPTZ,
  UNIQUE (user_id, badge_id)
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 9. VERIFICATION
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE verification_requests (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verification_type verification_type NOT NULL,
  document_urls     TEXT[] NOT NULL,
  licence_number    VARCHAR(255),
  licence_expiry    DATE,
  status            verification_status NOT NULL DEFAULT 'pending',
  reviewer_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewer_notes    TEXT,
  badge_id          UUID REFERENCES badges(id) ON DELETE SET NULL,
  submitted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 10. MODERATION & REPORTS
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE reports (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  target_type     report_target_type NOT NULL,
  target_id       UUID NOT NULL,
  reason          report_reason NOT NULL,
  severity        report_severity NOT NULL DEFAULT 'medium',
  description     TEXT,
  evidence_urls   TEXT[],
  status          report_status NOT NULL DEFAULT 'open',
  case_id         UUID,  -- FK added after moderation_cases
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE moderation_cases (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  severity        report_severity NOT NULL DEFAULT 'medium',
  status          case_status NOT NULL DEFAULT 'open',
  assigned_admin  UUID REFERENCES users(id) ON DELETE SET NULL,
  priority_score  INTEGER NOT NULL DEFAULT 0,
  case_notes      TEXT,
  tags            TEXT[],
  sla_due_at      TIMESTAMPTZ,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE reports ADD CONSTRAINT fk_reports_case FOREIGN KEY (case_id) REFERENCES moderation_cases(id) ON DELETE SET NULL;

CREATE TABLE moderation_actions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id         UUID NOT NULL REFERENCES moderation_cases(id) ON DELETE CASCADE,
  admin_id        UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  action_type     moderation_action_type NOT NULL,
  target_type     report_target_type NOT NULL,
  target_id       UUID NOT NULL,
  reason          TEXT NOT NULL,
  details         JSONB DEFAULT '{}',
  is_undone       BOOLEAN NOT NULL DEFAULT FALSE,
  undo_ttl        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE appeals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id         UUID NOT NULL REFERENCES moderation_cases(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason          TEXT NOT NULL,
  status          case_status NOT NULL DEFAULT 'open',
  reviewer_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  outcome         VARCHAR(50),  -- 'upheld', 'overturned', 'partially_overturned'
  reviewer_notes  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ
);

CREATE TABLE auto_moderation_rules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  rule_type       VARCHAR(50) NOT NULL,  -- 'keyword', 'link', 'behavior', 'threshold'
  conditions      JSONB NOT NULL DEFAULT '{}',
  actions         JSONB NOT NULL DEFAULT '{}',
  community_id    UUID REFERENCES communities(id) ON DELETE CASCADE,  -- NULL = global
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  false_positive_count INTEGER NOT NULL DEFAULT 0,
  hit_count       INTEGER NOT NULL DEFAULT 0,
  created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 11. ADMIN
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE admin_users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  admin_role      admin_role NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  mfa_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_actions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id        UUID NOT NULL REFERENCES admin_users(id) ON DELETE SET NULL,
  action_type     VARCHAR(100) NOT NULL,
  target_type     VARCHAR(100),
  target_id       UUID,
  before_state    JSONB,
  after_state     JSONB,
  reason          TEXT,
  ip_address      INET,
  user_agent      TEXT,
  request_id      VARCHAR(255),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 12. DELETION & RECOVERY
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE deletion_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_type     deletion_target_type NOT NULL,
  target_id       UUID NOT NULL,
  requested_by    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          deletion_status NOT NULL DEFAULT 'pending',
  reason          TEXT,
  approved_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at     TIMESTAMPTZ,
  soft_deleted_at TIMESTAMPTZ,
  hard_delete_scheduled_at TIMESTAMPTZ,
  hard_deleted_at TIMESTAMPTZ,
  restored_at     TIMESTAMPTZ,
  restored_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE legal_holds (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_type     deletion_target_type NOT NULL,
  target_id       UUID NOT NULL,
  reason          TEXT NOT NULL,
  case_reference  VARCHAR(255),
  placed_by       UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  removed_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  placed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  removed_at      TIMESTAMPTZ
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 13. SYSTEM & CONFIG
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  action          VARCHAR(255) NOT NULL,
  target_type     VARCHAR(100),
  target_id       UUID,
  ip_address      INET,
  user_agent      TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE site_settings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key             VARCHAR(255) UNIQUE NOT NULL,
  value           JSONB NOT NULL,
  description     TEXT,
  updated_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE policy_versions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doc_type        policy_doc_type NOT NULL,
  version         INTEGER NOT NULL,
  title           VARCHAR(255) NOT NULL,
  content         TEXT NOT NULL,
  changelog_note  TEXT,
  status          policy_status NOT NULL DEFAULT 'draft',
  author_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  published_at    TIMESTAMPTZ,
  scheduled_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (doc_type, version)
);

CREATE TABLE feature_flags (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) UNIQUE NOT NULL,
  description     TEXT,
  is_enabled      BOOLEAN NOT NULL DEFAULT FALSE,
  rollout_percentage SMALLINT DEFAULT 100,
  conditions      JSONB DEFAULT '{}',
  updated_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE contact_submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100),
  email           VARCHAR(255) NOT NULL,
  reason          contact_reason NOT NULL,
  message         TEXT NOT NULL,
  consent_emails  BOOLEAN NOT NULL DEFAULT FALSE,
  ip_address      INET,
  responded       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE export_jobs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  export_type     export_type NOT NULL,
  target_id       UUID,
  status          export_status NOT NULL DEFAULT 'queued',
  file_url        TEXT,
  file_size_bytes BIGINT,
  requested_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  error_message   TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE backup_jobs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  backup_type     VARCHAR(50) NOT NULL DEFAULT 'full',  -- 'full', 'incremental'
  status          export_status NOT NULL DEFAULT 'queued',
  file_location   TEXT,
  file_size_bytes BIGINT,
  error_message   TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE email_templates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            VARCHAR(100) UNIQUE NOT NULL,
  name            VARCHAR(255) NOT NULL,
  subject         VARCHAR(500) NOT NULL,
  body_html       TEXT NOT NULL,
  body_text       TEXT,
  variables       JSONB DEFAULT '{}',
  version         INTEGER NOT NULL DEFAULT 1,
  updated_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE scheduled_jobs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type        VARCHAR(100) NOT NULL,
  target_type     VARCHAR(100),
  target_id       UUID,
  payload         JSONB DEFAULT '{}',
  scheduled_for   TIMESTAMPTZ NOT NULL,
  executed_at     TIMESTAMPTZ,
  status          export_status NOT NULL DEFAULT 'queued',
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 14. INDEXES
-- ──────────────────────────────────────────────────────────────────────────────

-- Users & Auth
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- Posts
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_community ON posts(community_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_visibility ON posts(visibility);
CREATE INDEX idx_posts_type ON posts(post_type);
CREATE INDEX idx_posts_published ON posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_posts_incognito ON posts(is_incognito) WHERE is_incognito = TRUE;
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_posts_deleted ON posts(deleted_at) WHERE deleted_at IS NOT NULL;

-- Interactions
CREATE INDEX idx_reactions_post ON reactions(post_id);
CREATE INDEX idx_reactions_user ON reactions(user_id);
CREATE INDEX idx_feedbacks_post ON feedbacks(post_id);
CREATE INDEX idx_feedbacks_author ON feedbacks(author_id);
CREATE INDEX idx_marks_user ON marks(user_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_shares_post ON shares(post_id);

-- Communities
CREATE INDEX idx_communities_owner ON communities(owner_id);
CREATE INDEX idx_communities_status ON communities(status);
CREATE INDEX idx_community_members_user ON community_members(user_id);
CREATE INDEX idx_community_members_community ON community_members(community_id);

-- Messaging
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_thread_participants_user ON message_thread_participants(user_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Rewards
CREATE INDEX idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_created ON point_transactions(created_at DESC);

-- Reports & Moderation
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_severity ON reports(severity);
CREATE INDEX idx_moderation_cases_status ON moderation_cases(status);
CREATE INDEX idx_moderation_cases_assigned ON moderation_cases(assigned_admin);
CREATE INDEX idx_moderation_actions_case ON moderation_actions(case_id);

-- Admin & Audit
CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_type, target_id);
CREATE INDEX idx_admin_actions_created ON admin_actions(created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- Deletion & Legal
CREATE INDEX idx_deletion_requests_target ON deletion_requests(target_type, target_id);
CREATE INDEX idx_deletion_requests_status ON deletion_requests(status);
CREATE INDEX idx_legal_holds_target ON legal_holds(target_type, target_id);
CREATE INDEX idx_legal_holds_active ON legal_holds(is_active) WHERE is_active = TRUE;

-- Verification
CREATE INDEX idx_verification_user ON verification_requests(user_id);
CREATE INDEX idx_verification_status ON verification_requests(status);

-- ──────────────────────────────────────────────────────────────────────────────
-- 15. AUTO-UPDATE TRIGGERS
-- ──────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'users', 'profiles', 'posts', 'feedbacks', 'bookmarks',
      'communities', 'community_members', 'message_threads',
      'reports', 'moderation_cases', 'admin_users',
      'deletion_requests', 'site_settings', 'policy_versions',
      'feature_flags', 'email_templates', 'point_tasks',
      'achievements', 'badges', 'verification_requests',
      'auto_moderation_rules'
    ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION update_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;

COMMIT;
