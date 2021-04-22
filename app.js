// Require the Bolt package (github.com/slackapi/bolt)
const { App, WorkflowStep } = require("@slack/bolt");
// use uuid to create ticketID 
const { v4: uuidv4 } = require('uuid');
var request = require("request");


//Create bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Create a new WorkflowStep instance
const ws = new WorkflowStep("ticketData", {

  //the edit call back function runs when a user edits this step in workflow builder
  edit: async ({ ack, step, configure }) => {
    await ack();
    //blocks are the UI elements which the user will fill in for this step
    const blocks = [
      {
        type: 'input',
        //this is the person who submitted the ticket
        block_id: 'ticket_submitter',
        element: {
          type: 'plain_text_input',
          action_id: 'name',
        },
        label: {
          type: 'plain_text',
          text: 'User submitting ticket',
        },
      },
      {
        type: 'input',
        //this is the ticket description
        block_id: 'ticket_description',
        element: {
          type: 'plain_text_input',
          action_id: 'description',
        },
        label: {
          type: 'plain_text',
          text: 'Ticket description',
        },
      },
      {
        type: 'input',
        //this is the ticket description
        block_id: 'issue_type',
        element: {
          type: 'plain_text_input',
          action_id: 'issueType',
        },
        label: {
          type: 'plain_text',
          text: 'Issue Type',
        },
      },
    ];
    await configure({ blocks });
  },

  // this callback function fires once the user clicks on "save" to update the step in workflow builder
  save: async ({ ack, step, view, update }) => {
    await ack();
    const { values } = view.state;
    //here we grab the user-entered values
    const ticketSubmitter = values.ticket_submitter.name;
    const ticketDescription = values.ticket_description.description;
    const issueType = values.issue_type.issueType;

    const inputs = {
      ticketSubmitter: { value: ticketSubmitter.value },
      ticketDescription: { value: ticketDescription.value },
      issueType: { value: issueType.value },

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
      },
      {
        type: 'text',
        name: 'issueType',
        label: 'Type of issue',
      }
    ];
    await update({ inputs, outputs });
  },

  //when a user executes the step
  execute: async ({ step, complete, fail }) => {

    const { inputs } = step;

    const outputs = {
      ticketSubmitter: inputs.ticketSubmitter.value,
      ticketDescription: inputs.ticketDescription.value,
      issueType: inputs.issueType.value,
      randomID: uuidv4()
    };

    // Demo request to Jira Service Desk API, to create an issue with the user entered values from the Workflow
    var options = {
      method: 'POST',
      url: 'https://supportdesk423.atlassian.net/rest/api/2/issue/',
      headers:
      {
        authorization: process.env.JIRA_API_TOKEN,
        'content-type': 'application/json'
      },
      body:
      {
        fields:
        {
          project:
            { 
              key: 'SLACK' 
            },
          summary: 'SupportDesk and Slack Integration Demo',
          description: inputs.ticketDescription.value,
          issuetype: { name: inputs.issueType.value }
        }
      },
      json: true
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });

    console.log('JSON response to be sent to SupportDesk API, for further integration: ')
    console.log(outputs)

    await complete({ outputs });

  },
});

app.step(ws);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
