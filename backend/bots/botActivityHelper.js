class BotActivityHelper {
  async checkToken(context, action, connection) {
    const magicCode =
      action.state && Number.isInteger(Number(action.state))
        ? action.state
        : "";

    const tokenResponse = await context.adapter.getUserToken(
      context,
      connection,
      magicCode
    );
    return tokenResponse;
  }

  async sendSigninLink(context, connection) {
    // There is no token, so the user has not signed in yet.
    // Retrieve the OAuth Sign in Link to use in the MessagingExtensionResult Suggested Actions
    const signInLink = await context.adapter.getSignInLink(context, connection);

    return {
      composeExtension: {
        type: "silentAuth",

        suggestedActions: {
          actions: [
            {
              type: "openUrl",
              value: signInLink,
              title: "Bot Service OAuth",
            },
          ],
        },
      },
    };
  }
}

module.exports = new BotActivityHelper();
