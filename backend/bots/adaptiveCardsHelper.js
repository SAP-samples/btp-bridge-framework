const { CardFactory } = require("botbuilder");
const env = process.env;

class AdaptiveCardsHelper {
  showSignOutCard() {
    const card = CardFactory.adaptiveCard({
      version: "1.0.0",
      type: "AdaptiveCard",
      body: [
        {
          type: "TextBlock",
          text: "You have been signed out.",
        },
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Close",
          data: {
            key: "Close",
          },
        },
      ],
    });

    return {
      task: {
        type: "continue",
        value: {
          card: card,
          heigth: 200,
          width: 400,
          title: "Signout",
        },
      },
    };
  }

  showCardThenClose(title, text) {
    const card = CardFactory.adaptiveCard({
      version: "1.0.0",
      type: "AdaptiveCard",
      body: [
        {
          type: "TextBlock",
          text: text,
        },
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Close",
          data: {
            key: "Close",
          },
        },
      ],
    });

    return {
      task: {
        type: "continue",
        value: {
          card: card,
          heigth: 200,
          width: 400,
          title: title,
        },
      },
    };
  }

  showActionNotSupportedCard() {
    const card = CardFactory.adaptiveCard({
      version: "1.0.0",
      type: "AdaptiveCard",
      body: [
        {
          type: "TextBlock",
          text: "This action is not supported yet.",
        },
      ],
      actions: [
        {
          type: "Action.Submit",
          title: "Close",
          data: {
            key: "Close",
          },
        },
      ],
    });

    return {
      task: {
        type: "continue",
        value: {
          card: card,
          heigth: 200,
          width: 400,
          title: "Not Supported",
        },
      },
    };
  }

  createJustInTimeInstallCard = () => {
    return {
      contentType: "application/vnd.microsoft.card.adaptive",
      content: {
        type: "AdaptiveCard",
        version: "1.0",
        body: [
          {
            type: "TextBlock",
            text: "Please click **Continue** to install the app in this conversation",
            wrap: true,
          },
        ],
        actions: [
          {
            type: "Action.Submit",
            title: "Continue",
            data: { msteams: { justInTimeInstall: true } },
          },
        ],
      },
    };
  };

  createBusinessObjectCard = (url, botId, objData, title) => {
    const column1 = [];
    const column2 = [];
    let i = 1;
    for (const property in objData) {
      const textBlock = [
        {
          type: "TextBlock",
          text: property + ":",
          wrap: true,
          weight: "Bolder",
        },
        {
          type: "TextBlock",
          text: objData[property],
          wrap: true,
          spacing: "None",
        },
      ];
      if (i % 2 === 1) {
        column1.push(...textBlock);
      } else {
        column2.push(...textBlock);
      }
      i += 1;
    }

    const newUrl = new URL(url);
    const params = new URLSearchParams(newUrl.search);
    params.append("viewMoreDetails", true);
    newUrl.search = params.toString();

    const card = CardFactory.adaptiveCard({
      type: "AdaptiveCard",
      body: [
        {
          type: "ColumnSet",
          separator: true,
          columns: [
            {
              type: "Column",
              width: "auto",
              items: [
                {
                  type: "ImageSet",
                  images: [
                    {
                      type: "Image",
                      width: "Auto",
                      height: "16px",
                      url:
                        "https://bridgeimg.blob.core.windows.net/adaptive-card/logo_withText.png?" +
                        env.blobSAS,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "TextBlock",
          size: "Large",
          wrap: true,
          weight: "Bolder",
          text: title,
        },
        {
          type: "ColumnSet",
          columns: [
            {
              type: "Column",
              width: "stretch",
              items: column1,
            },
            {
              type: "Column",
              width: "stretch",
              items: column2,
            },
          ],
        },
      ],
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      version: "1.4",
      actions: [
        {
          type: "Action.Submit",
          title: "View More Details",
          data: {
            msteams: {
              type: "task/fetch",
            },
            goToUrl: newUrl,
          },
        },
      ],
    });
    return card;
  };

  async getTicketDetailCard(ticket) {
    const adaptive = CardFactory.adaptiveCard({
      $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
      type: "AdaptiveCard",
      version: "1.3",
      body: [
        {
          type: "TextBlock",
          text: ticket.Name,
          size: "large",
        },
        {
          type: "TextBlock",
          text: "ID: " + ticket.ID,
        },
        {
          type: "TextBlock",
          text: "Buyer Name: " + ticket.BuyerMainContactPartyName,
        },
      ],

      actions: [
        {
          type: "Action.OpenUrl",
          title: "Open Ticket",
          url: env.c4cTenantUrl,
        },
      ],
    });
    return adaptive;
  }
}

module.exports = new AdaptiveCardsHelper();
