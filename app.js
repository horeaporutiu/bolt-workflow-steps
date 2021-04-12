// Require the Bolt package (github.com/slackapi/bolt)
const { App, WorkflowStep } = require("@slack/bolt");
const uuid = require("uuid")

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});


      // Create a new WorkflowStep instance
    const ws = new WorkflowStep("ticketData", {
    
      edit: async ({ ack, step, configure }) => {
        await ack();
        console.log('before we edit')
        const blocks = [
          {
            type: 'input',
            // block_id: 'task_name_input',
            block_id: 'ticket_submitter',
            element: {
              type: 'plain_text_input',
              action_id: 'name',
              placeholder: {
                type: 'plain_text',
                text: 'Add the person who submitted the ticket',
              },
            },
            label: {
              type: 'plain_text',
              text: 'User submitting ticket',
            },
          },
          {
            type: 'input',
            // block_id: 'task_description_input',
            block_id: 'ticket_description',
            element: {
              type: 'plain_text_input',
              action_id: 'description',
              placeholder: {
                type: 'plain_text',
                text: 'Add an issue description',
              },
            },
            label: {
              type: 'plain_text',
              text: 'Ticket description',
            },
          },
        ];

    await configure({ blocks });
      },

  save: async ({ ack, step, view, update }) => {
        await ack();
        console.log('before we save')
        const { values } = view.state;
        const ticketSubmitter = values.ticket_submitter.name;
        const ticketDescription = values.ticket_description.description;

        const inputs = {
          ticketSubmitter: { value: ticketSubmitter.value },
          ticketDescription: { value: ticketDescription.value }
        };

        const outputs = [
          {
            type: 'text',
            name: 'ticketSubmitter',
            label: 'Person who submitted ticket',
          },
          {
            type: 'text',
            name: 'ticketDescription',
            label: 'Description of the problem',
          }
        ];

        await update({ inputs, outputs });
      },

      //when a user executes the step
      execute: async ({ step, complete, fail }) => {
         const { inputs } = step;

        console.log('inputs')
        console.log(inputs)
      const outputs = {
        ticketSubmitter: inputs.ticketSubmitter.value,
        ticketDescription: inputs.ticketDescription.value,
        randomID: uuid()
      };

      // if everything was successful
      await complete({ outputs });

      },
    });

    app.step(ws);



// All the room in the world for your code
app.event('workflow_step_execute', async ({ event, client, context }) => {
  
  
  console.log('workflow step has been executed')
  try {
    

  } catch (error) {
    console.error(error);
  }
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running! HSFHDS');
})();
