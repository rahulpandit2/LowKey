# SERVER-ADMIN
The nav bar does not highlight the current page.
Not all of the nav items have proper icons.

## Dashboard
No usable data is being shown

## Users
Everything is working as expected
We can optimize the search, right now it fetches the user as I input, which is okay as our user database is small but will become a problem as we grow. Add a simple search button instead of typing to search to minimize the number of requests.

## Sub-Admin Management
The page looks normal but any requests are returning Forbidden error message. Also, we only have an option to promote/demote sub-admins, we should have an option to create sub-admins as well.

## Communities
No data is being shown, but I am not sure if this is because we do not have any communities yet or it is some error. When we push the demo data, it should also push some communities for us to test all functionalities.

## Moderation
No data is being shown, but I am not sure if this is because we do not have any reports yet or it is some error. When we push the demo data, it should also push some reports for us to test all functionalities.

## Contact-requests
This page is not working, the contact requests sumbited by the user using the contact page from frontend should be visible along with useful action such as, emailed to reply, send a direct message, or mark as spam and more.

## Deletion & Recovery
A soft deleted data is being shown, but I am not sure if this is hard coded into the page or a real time data. When we push the demo data, it should also push some communities for us to test all functionalities.

## Achievements
No data is being shown, but I am not sure if this is because we do not have any achievements/badges/point tasks yet or it is some error. Add some default achievements/badges/point tasks for users and make a more comprehensive system for the server admin to create new tasks, to achive these things. The current option to create such tasks feel very limited.

## Policy
This pages shows no data. It should fetch the existing policies and the version for the server admin to edit. Also allow the admin to role back to different version of policy.

## Legal
No data is being shown, but I am not sure if this is because we do not have any gdpr requests yet or it is some error. When we push the demo data, it should also push some reports for us to test all functionalities.
Also, we lack a method/function to actually acomplich these request and mark them done or pending.

## Send notification
Does not work. Shows Forbidden error message. Allow roleback.

## Send message
Does not work. Shows Forbidden error message. Allow roleback.

## Security
Does not work. Make it modular to be useful with just UI.

## Logs
Works but not everything is recorded. It does not show everything hapening. Also, make it paginated to reduse load on server.

## Backups
Does not work. Make it modular to be useful with just UI.

## Automation
Does not work. Make the creating new rule more comprehensive. Allow server admin to automate additional things like send notifications at any scheduled time, send a message to each new user if they have not completed a certain task/or are inactive. Schedule creation of new tasks.

## Help
Non functional

# Public
Optimize pages with lazy loading behaviour and make the existing elements animate on load but not in a cheap and genaric manner. Remove all unnecessary console.logs. Fix the link to github. It is https://github.com/rahulpandit2/LowKey and the x.com is not real link so remove that. Allow the server admin site settings page to enabel/disable different social media links and add the real link from the server. If the admin does not add a link, it should not be shown.

## /
Works as intended and shows my profie name instead of login/singup if I'm already logged in. The founder's image is good at the philosophy section but on the top of the page, use a more suitable/eye catching image that matches the theme of the website. Fetch real communites to show.

## About
Pass

## Features
Pass

## How it works
Okay, I'll let it slide but you could do it better.

## Communities
Pass but fetch real data.

## Guidelines
Pass the visuals but make sure to fetach actual data from server.

## Help
Pass

## Privacy-policy
Pass the visuals but make sure to fetach actual data from server.

## Community Policy
Takes us to the correct page but not directly to the correct section of the guidelines page. Fix that.

## Contact
Automatically fetch the users information if they are already logged in also add an option input to add username if the user is not logged in. Also add a captcha to prevent spam. Make it more interactive and engaging.

# Private
Must not be visible over the internet. Use strict robot.txt policy to block crawlers. Nothing should leak without an auth token. Use middleware to check for auth token and redirect to login page if not found. Add a password protection feature. The pages match the design language but make it subtaly animated, fluid, and more interesting without making it look like a twitch/discord/twitter/reddit copy. The trending sidebar is visible irrespective of the page that I am on, and no data is being fetched. If no real data is present to show trending, show recent/new posts user may be instead in.

## Feed
Works as intended. But deleted or posts from removed users are also shown.

### React
The react options are correct to the intention but feels boaring.
### Feedback
The feedback section should be comprehensive just like in the context. It feels like a generic comment right now.
### Save
Works as intended. Makybe it can use some visual tweeks but it is okay.
### Share
Does not work

## Search
Felt like there is some bug. The search results are relavent but needs to swtich to a different section then it shows up under all. It should show up under the section it belongs to as well as all. Also, the search should be more comprehensive. It should show actions/suggestions if no results are found.

## Notifications
No data is being shown. I am not sure if this is because we do not have any notifications yet or it is some error. When we push the demo data, it should also push some notifications to all users for us to test all functionalities. Also, send a welcome notifcation to all users upon creation. It should be customizable from server admin panel.

## Messages
No data is being shown. I am not sure if this is because we do not have any messages yet or it is some error. When we push the demo data, it should also push some messages to all users for us to test all functionalities. Also, send a welcome message to all users upon creation. It should be customizable from server admin panel.

## My communities
Allow me to discover communities, see communities that I have joined, create new communities, but when I try to manage it show 404 error. e.g. communities/ui-test-community/admin = 404 error
There is no option to create a post inside a community directly.

## Bookmarks
Does not work.

## Post manager
Works as intended. We are using console.alert for user confirmation. Instead design custom toasts, and confirmation popus for user interctions.

## Post composer
When we try to draft, it publishes.

## Profile
Works as intended. Test if real time data is being fetched. Give more options. Make it more interactive, fluid and animated.

## Settings
Not all of the options describe in the original context are present. Add them. Also, make it more interactive, fluid and animated.