const Router = require("express");

const path = require("path");
const AuthManager = require("../services/authManager");
const ConfigInterface = require("../helpers/configInterface");

// MS Teams dependencies
const { MsGraphClient } = require("../services/MsGraphClient");
const { MessageFactory, CardFactory } = require("botbuilder");
const adaptivecard = require("../bots/MS365/adaptiveCardsHelper.js");
const botActivityHandler = require("../bots/MS365/botActivityHandler");
const botAdapter = require("../bots/MS365/botAdapter");

// Google Chat dependencies
const Destination = require("../sap/destination");
const GCSBucket = require("../bots/GoogleWS/services/GCPBucket");
const GoogleChatApi = require("../bots/GoogleWS/services/GoogleChatApi");
const googleCardHelper = require("../bots/GoogleWS/GoogleCardHelper.js");
const { google } = require("googleapis");

const notificationRouter = Router();

// TODO: Secure notification endpoints

// MS Teams Push notification endpoint
notificationRouter.post("/notifyTeamsUser", async (req, res) => {
  console.log("\nData received for notification:\n", req.body);

  let eventData = { ...req.body };

  // If the Receiver emails are sent as a comma-separated string
  if (typeof eventData["USER_EMAIL"] === "string") {
    eventData["USER_EMAIL"] = eventData["USER_EMAIL"]
      .split(",")
      .map((substring) => substring.trim());
  }

  try {
    // Obtaining notification config from the config server
    const notificationConfig = await ConfigInterface.getInterfaceMappingConfig(
      "/notification/notificationConfig.json",
      req.logger
    );

    // Obtaining ObjectScreenConfig/detail screen config

    const frontendPageConfig = await ConfigInterface.getInterfaceMappingConfig(
      notificationConfig.DetailScreenConfig,
      req.logger
    );

    try {
      // Obtaining app level token to fetch user details
      const token = await AuthManager.getAccessTokenForApplication();
      const client = new MsGraphClient(token);

      // Delivering notification to all recepients in the notification config

      for (email of eventData[notificationConfig.fields.ReceiverEmailList]) {
        const receiver = await client.getUserProfile(email);

        if (!receiver) {
          console.error(`Email ${email} not found in Azure AD!`);
          continue;
        }

        // Get conversation reference for the user
        const conversationReference =
          await botActivityHandler.getConversationReference(receiver.teamsId);

        console.log("Conversation ref", conversationReference);
        if (conversationReference) {
          let cardData = { Others: {} };
          cardData["BusinessObjectName"] = notificationConfig.BusinessObject;

          for (let key in notificationConfig.fields) {
            if (key === "Others") {
              for (let oth in notificationConfig.fields["Others"]) {
                if (
                  req.body.hasOwnProperty(
                    notificationConfig.fields["Others"][oth]
                  )
                ) {
                  cardData.Others[oth] =
                    req.body[notificationConfig.fields["Others"][oth]];
                }
              }
            } else {
              cardData[key] = req.body[notificationConfig.fields[key]];
            }
          }

          cardData["Forward"] = req.body.FORWARD;
          cardData["origSysManagementAppURL"] =
            notificationConfig.origSysManagementAppURL;

          const detailPageUrl =
            process.env.frontendUrl +
            `/${frontendPageConfig.system}/${frontendPageConfig.interface}/${frontendPageConfig.businessObject}Object?${frontendPageConfig.businessObject}=${cardData.ObjectId}`;

          await botAdapter.continueConversation(
            conversationReference,
            async (turnContext) => {
              const notificationCard = CardFactory.adaptiveCard(
                adaptivecard.NotificationCard(cardData, detailPageUrl, "0000")
              );
              try {
                await turnContext.sendActivity(
                  MessageFactory.attachment(notificationCard)
                );
              } catch (error) {
                console.log("\nTurn context error: ", error);
              }
            }
          );
        } else {
          console.log(
            "\nNo ConversationReference found for user " + receiver.fullName
          );
          continue;
        }
      }
      res.status(200).send("Notification sent!");
    } catch (e) {
      console.log("Error while sending notification\n", e);
      res
        .status(500)
        .send(
          "Internal server error: Error while sending notification to the user(s)."
        );
    }
  } catch (e) {
    console.log("Error while retrieving Bridge Config files\n", e);
    res
      .status(500)
      .send("Internal server error: Could not retrieve Bridge Config files");
  }
});

// Google Chat push notificatino endpoint
notificationRouter.post("/notifyGoogleChatUser", async (req, res) => {
  console.log("Event received for notification for google", req.body);
  if (req.body && Object.keys(req.body).length != 0) {
    const backendConfig = await ConfigInterface.getInterfaceMappingConfig(
      "/backend/objectMappingConfig.json",
      req.logger
    );

    // Obtaining notification config from the config server
    const notificationConfig = await ConfigInterface.getInterfaceMappingConfig(
      "/notification/notificationConfig.json",
      req.logger
    );

    try {
      // Get reference file
      const fileData = await GCSBucket.readConversationReference();
      const conversationRef = JSON.parse(fileData);
      const destinationSpace =
        conversationRef[req.body[notificationConfig.fields.ReceiverEmailList]]
          ?.space.name;

      // If user not found in the reference file, throw error
      if (destinationSpace === undefined) {
        res
          .status(500)
          .send(
            `User ${
              req.body[notificationConfig.fields.ReceiverEmailList]
            } has not installed the chat app.`
          );
        return;
      }
      const chatApi = await GoogleChatApi.getChatApi();

      const poCard = googleCardHelper.buildApprovalCard({
        wfDetails: req.body,
        status: null,
      });

      const message = {
        cards: [poCard],
      };

      let request = {
        parent: destinationSpace,
        requestBody: message,
      };

      try {
        console.log("Sending message...");
        await chatApi.spaces.messages.create(request);
      } catch (err) {
        console.error("Error while sending message! ", err);
        res.status(500).send("Error while sending notification.");
      }

      // Return success message
      res.status(200).send("Notification sent");
    } catch (err) {
      console.error("Error while sending notification.\n", err);
      res.status(500).send("Error while sending notification.");
    }
  }
});

module.exports = notificationRouter;
