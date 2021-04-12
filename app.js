// Require the Bolt package (github.com/slackapi/bolt)
const { App, WorkflowStep } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});


      // Create a new WorkflowStep instance
    const ws = new WorkflowStep('ticketData', {
    
      edit: async ({ ack, step, configure }) => {
        await ack();
        const blocks = [
          {
            type: 'input',
            block_id: 'task_name_input',
            element: {
              type: 'plain_text_input',
              action_id: 'name',
              placeholder: {
                type: 'plain_text',
                text: 'Add a task name',
              },
            },
            label: {
              type: 'plain_text',
              text: 'Task name',
            },
          },
          {
            type: 'input',
            block_id: 'task_description_input',
            element: {
              type: 'plain_text_input',
              action_id: 'description',
              placeholder: {
                type: 'plain_text',
                text: 'Add a task description',
              },
            },
            label: {
              type: 'plain_text',
              text: 'Task description',
            },
          },
        ];

    await configure({ blocks });
      },

  save: async ({ ack, step, view, update }) => {
        await ack();
        const { values } = view.state;
        const taskName = values.task_name_input.name;
        const taskDescription = values.task_description_input.description;

        const inputs = {
          taskName: { value: taskName.value },
          taskDescription: { value: taskDescription.value }
        };

        const outputs = [
          {
            type: 'text',
            name: 'taskName',
            label: 'Task name',
          },
          {
            type: 'text',
            name: 'taskDescription',
            label: 'Task description',
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








  console.log('before app . event')


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
