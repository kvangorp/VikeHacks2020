# VikeHacks 2020 Game in React


## Setup
1) Sign up for a free PubNub account to get your Pub/Sub API keys.
 <a href="https://dashboard.pubnub.com/signup?devrel_gh=react-tictactoe">
    <img alt="PubNub Signup" src="https://i.imgur.com/og5DDjf.png" width=260 height=97/>
  </a>

2) You need to enable presence to detect the number of players in the channel. This prevents having more than two players in a given channel. Go to your [PubNub Admin Dashboard](https://admin.pubnub.com), click on the Demo Project App, or create a new app for this project, and click on Keyset. Scroll down to Application add-ons and toggle the Presence switch to on. Keep the default values the same.

<p align="center">
  <img src="./media/enable-presence.png" alt="Enable Presence add-on" width="450" height="300" />
</p>

3) Clone the repo.

4) Open the project in your favorite text editor.

5) Go to App.js and replace 'ENTER_YOUR_PUBLISH_KEY_HERE' and 'ENTER_YOUR_SUBSCRIBE_KEY_HERE' with the keys you got from Step 1.

6) Install the dependencies by running the script that's in the root directory. 