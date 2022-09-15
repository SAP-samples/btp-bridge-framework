const {
  TeamsActivityHandler,
  TeamsInfo,
  UserState,
  MemoryStorage,
} = require("botbuilder");

require("dotenv").config();
const env = process.env;
const adaptivecard = require("./adaptiveCardsHelper");
const helper = require("./botActivityHelper");

class BotActivityHandler extends TeamsActivityHandler {
  /**
   *
   * @param {UserState} User state to persist configuration settings
   */
  constructor(userState) {
    super();
    this.userConfigurationProperty = userState.createProperty("userConfigurationProperty");
    this.connectionName = env.connectionName;
    this.userState = userState;

    this.onMessage(async (context, next) => {
      console.log("on message triggered");
      await next();
    });
  }

  async run(context) {
    await super.run(context);

    // Save state changes
    await this.userState.saveChanges(context);
  }

  // Overloaded function. Receives invoke activities with the name 'composeExtension/fetchTask'
  async handleTeamsMessagingExtensionFetchTask(context, action) {
    // Check if the bot is a part of the current conversation
    try {
      const member = await TeamsInfo.getMember(
        context,
        context.activity.from.id
      );
    } catch (error) {
      console.log("Bot is not a part of the current conversation!");
      if (
        error.code === "ServiceError" ||
        error.code === "BotNotInConversationRoster"
      ) {
        return {
          task: {
            type: "continue",
            value: {
              title: "App Installation",
              card: adaptivecard.createJustInTimeInstallCard(),
            },
          },
        };
      }
      throw error;
    }

    if (!context.activity.from.aadObjectId) throw new Error("unknown user");
    if (!action.commandId) throw new Error("unknown command");

    const tokenResponse = await helper.checkToken(
      context,
      action,
      this.connectionName
    );

    if (!tokenResponse || !tokenResponse.token) {
      console.log("No token. Asking to login");
      return helper.sendSigninLink(context, this.connectionName);
    }

    if (action.commandId === "showDialog") {
      console.log("show dialog executed");
      return {
        task: {
          type: "continue",
          value: {
            width: "medium",
            height: "medium",
            title: "Bridge Framework",
            url: env.frontendUrl,
            fallbackUrl: env.frontendFallbackUrl,
          },
        },
      };
    }

    return null;
  }

  async handleTeamsMessagingExtensionSubmitAction(context, action) {
    const data = action.data;
    console.log("Current action: ", action);

    if (data.hasOwnProperty("objData")) {
      const botId = process.env.MicrosoftAppId;
      const businessObjectCard = adaptivecard.createBusinessObjectCard(
        data.url,
        botId,
        data.objData,
        data.title
      );

      const attachment = {
        contentType: businessObjectCard.contentType,
        content: businessObjectCard.content,
        preview: businessObjectCard,
      };

      const responseActivity = {
        type: "message",
        attachments: [attachment],
        channelData: {
          onBehalfOf: [
            {
              itemId: 0,
              mentionType: "person",
              mri: context.activity.from.id,
              displayname: context.activity.from.name,
            },
          ],
        },
      };
      await context.sendActivity(responseActivity);
    }

    if (action.data.msteams && action.data.msteams.justInTimeInstall === true) {
      return this.handleTeamsMessagingExtensionFetchTask(context, action);
    }

    const tokenResponse = await helper.checkToken(
      context,
      action,
      this.connectionName
    );

    if (
      (!tokenResponse || !tokenResponse.token) &&
      action.commandId !== "SignOutCommand" &&
      data.key !== "Close"
    ) {
      console.error("Login was not successful please try again.", action.commandId);
      await context.sendActivity("Login was not successful please try logging in again.");
      return {};
    }

    if (data.hasOwnProperty("signOut") && data.signOut) {
      const adapter = context.adapter;
      await adapter.signOutUser(context, this.connectionName);
      return adaptivecard.showSignOutCard();
    }

    return {};
  }

  async handleTeamsTaskModuleFetch(context, action) {
    const url = action.data.goToUrl;
    return {
      task: {
        type: "continue",
        value: {
          width: "medium",
          height: "medium",
          title: "Bridge Framework",
          url: url,
          fallbackUrl: url,
        },
      },
    };
  }

  async handleTeamsTaskModuleSubmit(context, action) {
    const data = action.data;
    console.log("Current action: ", action);

    if (data.hasOwnProperty("objData")) {
      const botId = process.env.MicrosoftAppId;
      const businessObjectCard = adaptivecard.createBusinessObjectCard(
        data.url,
        botId,
        data.objData,
        data.title
      );

      const attachment = {
        contentType: businessObjectCard.contentType,
        content: businessObjectCard.content,
        preview: businessObjectCard,
      };

      const responseActivity = {
        type: "message",
        attachments: [attachment],
        channelData: {
          onBehalfOf: [
            {
              itemId: 0,
              mentionType: "person",
              mri: context.activity.from.id,
              displayname: context.activity.from.name,
            },
          ],
        },
      };
      await context.sendActivity(responseActivity);
    }
  }

  handleTeamsMessagingExtensionCardButtonClicked(context, cardData) {
    console.log("card button clicked", cardData);
    return {};
  }

  async onInvokeActivity(context) {
    console.log("onInvoke, " + context.activity.name);
    return await super.onInvokeActivity(context);
  }
}

const memoryStorage = new MemoryStorage();
const userState = new UserState(memoryStorage);
module.exports = new BotActivityHandler(userState);