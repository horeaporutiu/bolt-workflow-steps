// Require the Bolt package (github.com/slackapi/bolt)
const { App, WorkflowStep } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});




  console.log('before app . event')


// All the room in the world for your code
app.event('workflow_step_execute', async ({ event, client, context }) => {
  

  console.log('workflow step has been executed')
  try {
    
      // Create a new WorkflowStep instance
    const ws = new WorkflowStep('ticketData', {
    edit: async ({ ack, step, configure }) => {},
    save: async ({ ack, step, update }) => {},
    execute: async ({ step, complete, fail }) => {
       const { inputs } = step;
    
      console.log('inputs)
      console.log()
    const outputs = {
      taskName: inputs.taskName.value,
      taskDescription: inputs.taskDescription.value,
    };

    // if everything was successful
    await complete({ outputs });

    },
  });

  app.step(ws);
    
    console.log('logging the event: ')
    console.log(event)
    
  }
  catch (error) {
    console.error(error);
  }
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running! HSFHDS');
})();
