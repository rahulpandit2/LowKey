# LowKey - Testing Guide

## 🔧 Issues Fixed

### 1. Signup Username Availability Check

**Problem**: All usernames showed as "unavailable" during signup because the check endpoint required authentication.

**Solution**:

- Created new public endpoint: `/api/users/check-username?username=xxx`
- Updated `SignupForm.tsx` to use the new endpoint
- No authentication required for checking username availability

### 2. Server Admin Access

**Problem**: Server admin pages redirected to login, with no way to create the first admin account.

**Solution**:

- Created first-time setup flow at `/server-admin/setup`
- Created setup API endpoint: `/api/admin/setup`
- Updated server-admin layout to allow setup page access without authentication
- After first admin is created, setup page is automatically disabled
- Main `/server-admin` route now redirects to setup if no admin exists

### 3. Privacy Policy Link

**Problem**: Privacy link in signup form pointed to `/privacy` instead of `/privacy-policy`

**Solution**: Updated link in `SignupForm.tsx` to point to `/privacy-policy`

---

## 🧪 Testing Instructions

### Test 1: Create a New User Account

1. **Navigate to signup page**: http://localhost:4028/signup

2. **Test username availability**:
   - Type a username (e.g., "testuser123")
   - Should see green checkmark if available
   - Try existing usernames (rahul_pandit, sarah_writer, alex_maker, priya_dev, john_parent)
   - Should see red X if taken

3. **Complete signup form**:

   ```
   Email: test@example.com
   Username: testuser123
   Password: password123
   Confirm Password: password123
   ✓ Agree to terms
   ```

4. **Submit form**:
   - Should create account successfully
   - Should redirect to `/feed`
   - Should see posts from seeded data

### Test 2: Create Server Admin Account

1. **Navigate to server admin**: http://localhost:4028/server-admin

2. **Should redirect to setup page**: `/server-admin/setup`

3. **Fill in admin details**:

   ```
   Full Name: Admin User
   Username: serveradmin
   Email: admin@lowkey.com
   Password: AdminPass123!
   Confirm Password: AdminPass123!
   ```

4. **Submit form**:
   - Should create admin account
   - Should redirect to `/server-admin/overview`
   - Should see admin dashboard

5. **Verify setup is disabled**:
   - Try accessing `/server-admin/setup` again
   - Should get error: "Admin account already exists"

### Test 3: Login with Existing Users

**Seeded User Credentials** (all have password: `password123`):

- rahul_pandit
- sarah_writer
- alex_maker
- priya_dev
- john_parent

1. **Navigate to login**: http://localhost:4028/login

2. **Login with any seeded user**:

   ```
   Username: rahul_pandit
   Password: password123
   ```

3. **Should redirect to feed**:
   - Should see 8 sample posts
   - Should see different post types (thought, problem, achievement, dilemma, help)
   - Should see incognito posts marked as "Incognito"

### Test 4: Admin Access Control

1. **Login as regular user** (e.g., testuser123)

2. **Try to access admin panel**: http://localhost:4028/server-admin

3. **Should redirect to `/feed`** (access denied)

4. **Logout and login as admin**:

   ```
   Username: serveradmin
   Password: AdminPass123!
   ```

5. **Access admin panel**: http://localhost:4028/server-admin

6. **Should see admin dashboard** with full access

---

## 📋 Available Test Data

### Users (Password: password123)

| Username     | Display Name | Bio                                                                |
| ------------ | ------------ | ------------------------------------------------------------------ |
| rahul_pandit | Rahul Pandit | Founder of LowKey. Building a better internet.                     |
| sarah_writer | Sarah Chen   | Writer and thinker. Sharing reflections on life and creativity.    |
| alex_maker   | Alex Kumar   | Indie maker building in public. Always learning.                   |
| priya_dev    | Priya Sharma | Software developer. Passionate about clean code and mental health. |
| john_parent  | John Miller  | Parent of two. Navigating the beautiful chaos of family life.      |

### Communities

| Handle             | Name               | Description                                                      |
| ------------------ | ------------------ | ---------------------------------------------------------------- |
| reflective-writers | Reflective Writers | Share essays, get thoughtful feedback on structure and clarity   |
| indie-makers       | Indie Makers       | Build in public, receive constructive critiques on products      |
| mindful-parents    | Mindful Parents    | Navigate parenting challenges with empathy, no judgment          |
| learning-public    | Learning in Public | Share progress, celebrate growth, get feedback on learning paths |

### Sample Posts

- 8 posts of various types (thought, problem, achievement, dilemma, help)
- Mix of public and incognito posts
- Posts in different communities
- Various reaction and feedback counts

---

## 🔍 What to Verify

### Signup Flow

- ✅ Username availability check works without login
- ✅ Green checkmark for available usernames
- ✅ Red X for taken usernames
- ✅ Form validation works (password match, length, etc.)
- ✅ Account creation successful
- ✅ Automatic login after signup
- ✅ Redirect to feed after signup

### Server Admin Setup

- ✅ First-time setup page accessible without login
- ✅ Admin account creation works
- ✅ Automatic login after admin creation
- ✅ Redirect to admin dashboard
- ✅ Setup page disabled after first admin
- ✅ Regular users cannot access admin panel
- ✅ Admin users can access all admin pages

### Feed Display

- ✅ Posts display correctly
- ✅ Post types show correct badges
- ✅ Incognito posts show as "Incognito"
- ✅ Reaction and feedback counts visible
- ✅ Time ago format works
- ✅ Filter tabs present (All, Following, Communities, Help, Popular)

---

## 🐛 Known Limitations

### Not Yet Implemented

1. **Post interactions**: Reactions, feedback, bookmarks (UI exists but not functional)
2. **Search functionality**: Page exists but search doesn't work
3. **Settings pages**: Multiple settings types need implementation
4. **Notifications**: Real-time notifications not working
5. **Messages**: Messaging system not fully functional
6. **Community management**: Admin features incomplete
7. **Achievements/Rewards**: System not connected to user actions
8. **Moderation**: Report handling and moderation queue not functional

### Design Improvements Needed

1. **Feed page**: Needs to align better with homepage aesthetic
2. **Authenticated pages**: UI enhancement needed
3. **Guidelines page**: Visual improvements and dynamic data loading

---

## 🚀 Next Steps After Testing

### Immediate (if tests pass)

1. Test post creation flow
2. Test community browsing
3. Verify navigation links work correctly
4. Test logout functionality

### Short-term

1. Implement post interactions (reactions, feedback)
2. Make search functional
3. Create settings pages
4. Enhance feed design

### Medium-term

1. Build out admin dashboard functionality
2. Implement notification system
3. Create messaging system
4. Add achievement/reward tracking

---

## 📝 Test Results Template

Use this template to document your test results:

```
## Test Session: [Date/Time]

### Signup Test
- [ ] Username check works
- [ ] Account creation successful
- [ ] Redirect to feed works
- Issues found:

### Admin Setup Test
- [ ] Setup page accessible
- [ ] Admin account created
- [ ] Dashboard accessible
- [ ] Setup disabled after creation
- Issues found:

### Login Test
- [ ] Login with seeded users works
- [ ] Feed displays posts
- [ ] Post types show correctly
- Issues found:

### Access Control Test
- [ ] Regular users blocked from admin
- [ ] Admin users can access admin panel
- Issues found:

### Overall Assessment
- Critical issues:
- Minor issues:
- Recommendations:
```

---

## 🔑 Quick Reference

**Development Server**: http://localhost:4028

**Key URLs**:

- Homepage: `/`
- Signup: `/signup`
- Login: `/login`
- Feed: `/feed`
- Server Admin: `/server-admin`
- Admin Setup: `/server-admin/setup`

**API Endpoints**:

- Check username: `GET /api/users/check-username?username=xxx`
- Signup: `POST /api/auth/signup`
- Login: `POST /api/auth/login`
- Admin setup: `POST /api/admin/setup`
- Check setup status: `GET /api/admin/setup`

**Database Seed Script**: `node scripts/seed-sample-data.js`

---

**Last Updated**: February 14, 2026
**Status**: Ready for testing
