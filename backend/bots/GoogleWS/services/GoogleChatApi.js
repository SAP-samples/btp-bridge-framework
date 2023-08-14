const { google } = require("googleapis");

class GoogleChatApi {
  async getChatApi() {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./bots/GoogleWS/gcp-key.json",
      scopes: "https://www.googleapis.com/auth/chat.bot",
    });

    const client = await auth.getClient();

    const chatApi = google.chat({
      version: "v1",
      auth: client,
    });

    return chatApi;
  }
}

module.exports = new GoogleChatApi();
