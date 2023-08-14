class GoogleCardHelper {
  buildApprovalCard(po) {
    const widgets = [];
    const approve = {
      textParagraph: {
        text: '<b><font color="#357a38">Purchase Order has been approved.</font></b>',
      },
    };
    const reject = {
      textParagraph: {
        text: '<b><font color="#ab003c">Purchase Order has been rejected.</font></b>',
      },
    };
    const buttons = [
      {
        textButton: {
          text: "Approve Request",
          onClick: {
            action: {
              actionMethodName: "APPROVE",
              parameters: [
                {
                  key: "wfDetails",
                  value: JSON.stringify(po.wfDetails),
                },
              ],
            },
          },
        },
      },
      {
        textButton: {
          text: "Reject Request",
          onClick: {
            action: {
              actionMethodName: "REJECT",
              parameters: [
                {
                  key: "wfDetails",
                  value: JSON.stringify(po.wfDetails),
                },
              ],
            },
          },
        },
      },
    ];

    return {
      header: this.header(
        po.wfDetails.PO_ID,
        po.wfDetails.DESCRIPTION,
        po.status
      ),
      sections: [
        {
          widgets: [
            {
              keyValue: {
                topLabel: "Workflow ID",
                content: po.wfDetails.TASK_ID,
                bottomLabel: "",
                contentMultiline: true,
              },
            },
            {
              keyValue: {
                topLabel: "Purchase Order ID",
                content: po.wfDetails.PO_ID,
                bottomLabel: "",
              },
            },
            {
              keyValue: {
                topLabel: "Created By",
                content: po.wfDetails.CREATED_BY,
                bottomLabel: "",
              },
            },
            {
              keyValue: {
                topLabel: "Created On",
                content: po.wfDetails.CREATED_ON,
                bottomLabel: "",
              },
            },
            {
              keyValue: {
                topLabel: "Priority",
                content: po.wfDetails.PRIORITY,
                bottomLabel: "",
              },
            },

            po.status === "approve"
              ? approve
              : po.status === "reject"
              ? reject
              : { buttons },
          ],
        },
      ],
    };
  }

  header(prId, description, status) {
    return {
      title:
        status === "approve" || status === "reject"
          ? "Purchase Order"
          : description,
      subtitle: prId,
      imageUrl:
        "https://bridge-framework-config-googlews.cfapps.us10.hana.ondemand.com/frontend/images/sap-logo.png",
    };
  }

  // Bridge Framework launch card
  buildBridgeLaunchCard(space) {
    const header = {
      title: "Bridge Framework",
      subtitle: "",
      imageUrl:
        "https://bridge-framework-config-googlews.cfapps.us10.hana.ondemand.com/frontend/images/sap-logo.png",
      imageAltText: "SAP Logo",
    };
    const params = {
      targetSpace: space,
    };
    const queryString = new URLSearchParams(params).toString();
    const sections = [
      {
        widgets: [
          {
            textParagraph: {
              text: "Hey there! Supercharge your Google Chat with <b>SAP</b> business objects by simply tapping the <b>Bridge Framework</b> button below.",
            },
          },
          {
            buttons: [
              {
                textButton: {
                  text: "Bridge Framework",
                  onClick: {
                    openLink: {
                      url: `${process.env.frontendUrl}/?${queryString}`,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    ];

    let card = {
      header: { ...header },
      sections: [...sections],
    };

    return card;
  }

  buildBusinessObjectCard(object) {
    console.log("Inside build BO card", object);

    // TODO: Make object name generic
    const objId = object["Purchase Order ID"];
    const header = {
      title: `Purchase Order #${objId}`,
      subtitle: "Bridge Framework",
      imageUrl:
        "https://bridge-framework-config-googlews.cfapps.us10.hana.ondemand.com/frontend/images/sap-logo.png",
      imageAltText: "SAP Logo",
    };

    const s4UrlTemplate = process.env.businessObjectUrl;
    const s4Url = s4UrlTemplate.replace("{PO_ID}", objId);

    const keyValues = Object.entries(object)
      .map(([key, value]) => {
        if (key === "targetSpace" || key === "pageUrl" || value === "") {
          return null; // Skip the "targetSpace" key
        }

        return {
          keyValue: {
            topLabel: key,
            content: value,
            bottomLabel: "",
            contentMultiline: true,
          },
        };
      })
      .filter(Boolean);

    const sections = [
      {
        widgets: [
          ...keyValues,
          {
            buttons: [
              {
                textButton: {
                  text: "Go to S/4HANA",
                  onClick: {
                    openLink: {
                      url: s4Url,
                    },
                  },
                },
              },
              {
                textButton: {
                  text: "View more details",
                  onClick: {
                    openLink: {
                      url: object.pageUrl,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    ];

    let card = {
      header: { ...header },
      sections: [...sections],
    };

    console.log("card built", JSON.stringify(card));
    return card;
  }
}

module.exports = new GoogleCardHelper();
