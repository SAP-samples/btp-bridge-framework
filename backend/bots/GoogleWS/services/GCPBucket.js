const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: process.env.GCPProjectID,
  keyFilename: "./bots/GoogleWS/gcp-key.json",
});

// Define the file path and content
const bucketName = process.env.GCPBucketName;
const filePath = process.env.GCPConvRefPath;

// Get a reference to the file
const bucket = storage.bucket(bucketName);
const file = bucket.file(filePath);

class GCPBucket {
  async readConversationReference() {
    console.log("Reading conversation reference.");
    try {
      const [exists] = await file.exists();

      if (!exists) {
        throw new Error("Conversation reference file not found in GCP.");
      }

      return new Promise((resolve, reject) => {
        const archivo = file.createReadStream();
        let buf = "";
        archivo
          .on("data", function (d) {
            buf += d;
          })
          .on("end", function () {
            resolve(buf);
          });
      });
    } catch (error) {
      throw new Error("Conversation reference file not found in GCP.");
    }
  }

  async createConversationReference(ref) {
    console.log("Creating conversation reference.", ref);
    const userId = ref.user.email;
    const data = ref;
    const conversationRef = { [userId]: data };

    // Check if the file already exists
    try {
      const [exists] = await file.exists();

      if (exists) {
        console.log("File already exists. Reading...");
        const fileData = await this.readConversationReference();
        let fileDataJson = JSON.parse(fileData);
        fileDataJson[userId] = data;

        const stream = file.createWriteStream({
          contentType: "application/json",
        });
        stream.write(JSON.stringify(fileDataJson));
        stream.end(() => {
          console.log(
            `Conversation reference ${filePath} updated successfully.`
          );
        });
      } else {
        // Create a new file with the content
        console.log(`File ${filePath} does not exist. Creating...`);
        const stream = file.createWriteStream({
          contentType: "application/json",
        });
        stream.write(JSON.stringify(conversationRef));
        stream.end(() => {
          console.log(
            `Conversation reference ${filePath} created successfully.`
          );
        });
      }
    } catch (error) {
      throw new Error("Error while writing conversation reference file.");
    }
  }

  async updateConversationReference(ref) {
    console.log("Updating conversation reference.");
    try {
      const fileData = await this.readConversationReference();
      let fileDataJson = JSON.parse(fileData);

      // Delete the reference entry of the user who uninstalled the app
      delete fileDataJson[ref.user.email];

      // Write the object back
      const stream = file.createWriteStream({
        contentType: "application/json",
      });
      stream.write(JSON.stringify(fileDataJson));
      stream.end(() => {
        console.log(`Conversation reference ${filePath} updated successfully.`);
      });
    } catch (error) {
      throw new Error(
        "Error while updating conversation reference file.\n",
        error
      );
    }
  }
}
module.exports = new GCPBucket();
