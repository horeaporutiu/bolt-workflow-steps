// Require the Bolt package (github.com/slackapi/bolt)
const { App, WorkflowStep } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.action({ callback_id: "ticketData", type: "workflow_step_edit" }, async ({ ack, body, client }) => {
  await ack();

  const configView = {
    "type": "workflow_step", // NOT "modal"
    "callback_id": "step-config-view",
    "blocks": [
      {
        "type": "input",
        "block_id": "title",
        "element": {
          "type": "plain_text_input",
          "action_id": "input"
        },
        "label": {
          "type": "plain_text",
          "text": "Title"
        },
        "optional": false
      },
      {
        "type": "input",
        "block_id": "description",
        "element": {
          "type": "plain_text_input",
          "action_id": "input"
        },
        "label": {
          "type": "plain_text",
          "text": "Description"
        },
        "optional": false
      },
      {
        "type": "input",
        "block_id": "category",
        "element": {
          "type": "plain_text_input",
          "action_id": "input"
        },
        "label": {
          "type": "plain_text",
          "text": "Category"
        },
        "optional": true
      }
    ]
  };
  await client.views.open({
    trigger_id: body.trigger_id,
    view: configView,
  })
});

// this listener is invoked when the workflow creator saves the step
app.view("step-config-view", async ({ client, body, ack }) => {
  await ack();

  const stateValues = body.view.state.values;
  await client.workflows.updateStep({
    workflow_step_edit_id: body.workflow_step.workflow_step_edit_id,
    // https://api.slack.com/reference/workflows/workflow_step#input
    inputs: {
      "title": {
        "value": stateValues.title.input.value,
        "skip_variable_replacement": false
      },
      "description": {
        "value": stateValues.description.input.value,
        "skip_variable_replacement": false
      },
      "category": {
        "value": stateValues.category.input.value,
        "skip_variable_replacement": false
      }
    },
    // https://api.slack.com/reference/workflows/workflow_step#output
    outputs: [
      {
        "name": "ticket_url",
        "type": "text",
        "label": "Created Ticket URL"
      },
      {
        "name": "title",
        "type": "text",
        "label": "Title"
      },
      {
        "name": "category",
        "type": "text",
        "label": "Category"
      }
    ]
  });
});

// this lisnter is invoked when an end-user runs the workflow
app.event("workflow_step_execute", async ({ logger, payload, client }) => {
  try {
    await client.workflows.stepCompleted({
      workflow_step_execute_id: payload.workflow_step.workflow_step_execute_id,
      outputs: {
        "ticket_url": "https://www.examle.com/tickets/123",
        "title": payload.workflow_step.inputs.title.value,
        "category": payload.workflow_step.inputs.category.value,
      }
    });
  } catch (e) {
    logger.warn(`Failed to call workflows.stepCompleted API method: ${JSON.stringify(e)}`);
    await client.workflows.stepFailed({
      workflow_step_execute_id: payload.workflow_step.workflow_step_execute_id,
      error: {
        message: `Something went wrong! (${e})`
      }
    });
  }
});







//   console.log('before app . event')


// // All the room in the world for your code
// app.event('workflow_step_execute', async ({ event, client, context }) => {
  
  
//   console.log('workflow step has been executed')
//   try {
    
//       // Create a new WorkflowStep instance
//     const ws = new WorkflowStep('ticketData', {
    
//       edit: async ({ ack, step, configure }) => {
//         await ack();
//         const blocks = [
//           {
//             type: 'input',
//             block_id: 'task_name_input',
//             element: {
//               type: 'plain_text_input',
//               action_id: 'name',
//               placeholder: {
//                 type: 'plain_text',
//                 text: 'Add a task name',
//               },
//             },
//             label: {
//               type: 'plain_text',
//               text: 'Task name',
//             },
//           },
//           {
//             type: 'input',
//             block_id: 'task_description_input',
//             element: {
//               type: 'plain_text_input',
//               action_id: 'description',
//               placeholder: {
//                 type: 'plain_text',
//                 text: 'Add a task description',
//               },
//             },
//             label: {
//               type: 'plain_text',
//               text: 'Task description',
//             },
//           },
//         ];

//     await configure({ blocks });
//       },

//   save: async ({ ack, step, view, update }) => {
//         await ack();
//         const { values } = view.state;
//         const taskName = values.task_name_input.name;
//         const taskDescription = values.task_description_input.description;

//         const inputs = {
//           taskName: { value: taskName.value },
//           taskDescription: { value: taskDescription.value }
//         };

//         const outputs = [
//           {
//             type: 'text',
//             name: 'taskName',
//             label: 'Task name',
//           },
//           {
//             type: 'text',
//             name: 'taskDescription',
//             label: 'Task description',
//           }
//         ];

//         await update({ inputs, outputs });
//       },

//       //when a user executes the step
//       execute: async ({ step, complete, fail }) => {
//          const { inputs } = step;

//         console.log('inputs')
//         console.log(inputs)
//       const outputs = {
//         taskName: inputs.taskName.value,
//         taskDescription: inputs.taskDescription.value,
//       };

//       // if everything was successful
//       await complete({ outputs });

//       },
//     });

//     app.step(ws);

//       console.log('logging the event: ')
//       console.log(event)

//   } catch (error) {
//     console.error(error);
//   }
// });


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running! HSFHDS');
})();
