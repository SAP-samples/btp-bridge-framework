const Router = require("express");
// const { spawn } = require("child_process");
const open = require("opn");

const GCSBucket = require("./services/GCPBucket");
const googleCardHelper = require("./GoogleCardHelper.js");
const GoogleChatApi = require("./services/GoogleChatApi");

const ConfigInterface = require("../../helpers/configInterface");
const Destination = require("../../sap/destination");

const GoogleChatBotHandler = Router();

GoogleChatBotHandler.post("/activityHandler", async (req, res) => {
  console.log("Event received in backend:\n", req.body);

  const event = req.body;
  let response = {};

  // Handle google chat events
  switch (event.type) {
    case "MESSAGE":
      response = await handleMessage(req, event);
      break;

    case "CARD_CLICKED":
      response = await handleCardClick(req, event);
      break;

    case "ADDED_TO_SPACE":
      response = await handleInstallUninstall(req, event, "ADDED_TO_SPACE");
      break;

    case "REMOVED_FROM_SPACE":
      response = await handleInstallUninstall(req, event, "REMOVED_FROM_SPACE");
      break;

    default:
      break;
  }

  res.status(200).send(response);
});

GoogleChatBotHandler.post("/exportObject", async (req, res) => {
  console.log("Exporting object to google chat ", req.body);

  if (req.body?.targetSpace) {
    console.log(`Sending card to ${req.body.targetSpace} space.`);
    await sendBusinessObjectCard(req.body, req.body.targetSpace);
  }
  res.status(200).send();
});

// Function to handle installation & uninstallation
async function handleInstallUninstall(req, event, type) {
  if (type === "ADDED_TO_SPACE") {
    if (
      event.space.hasOwnProperty("singleUserBotDm") &&
      event.space.singleUserBotDm === true
    ) {
      // Create conversation reference for Bot Space
      try {
        await GCSBucket.createConversationReference(event);
      } catch (error) {
        console.error("Error while handling installation", error);
        return {};
      }
      return {};
    } else {
      console.log(
        "Space is not 'singleUserBotDm'. Hence not storing conversation reference."
      );
    }
  } else {
    // Handle uninstallation
    if (
      event.space.hasOwnProperty("singleUserBotDm") &&
      event.space.singleUserBotDm === true
    ) {
      try {
        await GCSBucket.updateConversationReference(event);
      } catch (error) {
        console.error("Error while handling uninstall event. \n", error);
        return {};
      }

      return {};
    } else {
      console.log(
        "Space is not 'singleUserBotDm'. Hence not deleting conversation reference."
      );
    }
  }
}
// Function to handle message event in google chat
async function handleMessage(req, event) {
  const message = event.message;
  let response = {};

  // console.log("Message is", message);
  // Check if the message is a slash command
  if (message.slashCommand) {
    // Handle supported commands
    switch (message.slashCommand.commandId) {
      case "1":
        // Open dialog
        break;

      case "2":
        // Send card with link to open bridge framework
        await sendBridgeLaunchCard(message.space.name);
        break;

      default:
        break;
    }

    return response;
  }
}

// Function to handle click action in google chat cards
async function handleCardClick(req, event, action) {
  let response = {};
  if (event.action) {
    switch (event.action.actionMethodName) {
      case "APPROVE":
        response = await handleWorkflow(req, event, "approve");
        break;

      case "REJECT":
        response = await handleWorkflow(req, event, "reject");
        break;

      default:
        break;
    }

    return response;
  }
}

// Function to handle approval workflows
async function handleWorkflow(req, event, action) {
  console.log("Inside handle actions", event);
  // Obtaining notification config from the config server
  const notificationConfig = await ConfigInterface.getInterfaceMappingConfig(
    "/notification/notificationConfig.json",
    req.logger
  );

  const backendConfig = await ConfigInterface.getInterfaceMappingConfig(
    "/backend/objectMappingConfig.json",
    req.logger
  );

  const system = notificationConfig.System;
  const interface = notificationConfig.Interface;
  const interfaceMapping = backendConfig["S4HanaOnPrem"]["Destination"];

  const wfDetails = JSON.parse(event.common.parameters.wfDetails);
  const wfId = wfDetails.TASK_ID;
  const objId = wfDetails.PO_ID;

  const decision = action === "approve" ? "0001" : "0002";

  const body = {
    workFlowId: wfId,
    decisionKey: decision,
  };
  // false => access token is disabled
  const data = await Destination.submitData(
    notificationConfig.BusinessObject,
    "",
    interfaceMapping,
    body,
    false,
    true
  );

  const chatApi = await GoogleChatApi.getChatApi();
  const poCard = googleCardHelper.buildApprovalCard({
    wfDetails: wfDetails,
    status: action,
  });

  const message = {
    cards: [poCard],
  };

  try {
    const res = await chatApi.spaces.messages.update({
      // Resource name in the form `spaces/x/messages/x`. Example: `spaces/AAAAAAAAAAA/messages/BBBBBBBBBBB.BBBBBBBBBBB`
      name: event.message.name,
      // Required. The field paths to update. Separate multiple values with commas. Currently supported field paths: - text - cards (Requires [service account authentication](/chat/api/guides/auth/service-accounts).)
      updateMask: "cards",

      // Request body metadata
      requestBody: message,
    });
    console.log(res.data);
  } catch (err) {
    console.log("Error while updating card", err);
  }
}

async function sendBridgeLaunchCard(space) {
  console.log("Send launch card", space);
  const chatApi = await GoogleChatApi.getChatApi();
  const launchCard = await googleCardHelper.buildBridgeLaunchCard(space);

  const message = {
    cards: [launchCard],
  };

  let request = {
    parent: space,
    requestBody: message,
  };

  try {
    console.log("sending message...");
    await chatApi.spaces.messages.create(request);
  } catch (err) {
    console.log("Error while sending message! ", err);
  }
}

async function sendBusinessObjectCard(object, space) {
  console.log("space received in functrion", space);
  const chatApi = await GoogleChatApi.getChatApi();
  const boCard = await googleCardHelper.buildBusinessObjectCard(object);

  const message = {
    cards: [boCard],
  };

  let request = {
    parent: space,
    requestBody: message,
  };

  try {
    console.log("sending message...");
    await chatApi.spaces.messages.create(request);
  } catch (err) {
    console.log("Error while sending message! ", err);
  }
}

module.exports = GoogleChatBotHandler;
