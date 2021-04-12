SupportDesk Slack app
=================

[Bolt](https://slack.dev/bolt) is our framework that lets you build JavaScript-based Slack apps in a flash.

This project is an implementation of workflow steps from apps, using the tutorial 
outlined on the [slack API website](https://api.slack.com/workflows/steps). 

The Project
------------

- `app.js` contains the primary Bolt app. It imports the Bolt package (`@slack/bolt`) and starts the Bolt app's server. This 
is where we will handle the `workflow_step_execute` event. 
- `.env` is where you'll put your Slack app's authorization token and signing secret.

\ ゜o゜)ノ
