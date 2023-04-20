# Enabling Transcript Summary Functionality

NOTES:

- Transcript Summary functionality currently uses a beta API that is subject to change.
- It is possible to use a different Hugging Face model that has the inference API enabled by modifying the endpoint in the backend `.env` file. Using any other model will require minor code changes.
- The Bridge Framework App must be added to the chat of a meeting in order for transcript summary functionality to work. If a meeting is recurrent and has the same chat, it is enough to only add the bot once. Currently, transcripts are only enabled for scheduled meetings, so naturally this functionality will only work for scheduled meetings.

## Add Bot Permissions in Azure Portal

1. Open the App Registration associated with your Bot Resource and navigate to **API Permissions** in the left menu.
2. Click **Add a permission** and select **Microsoft Graph** in the menu that opens.
3. Click **Application permissions** and add the following permissions: `OnlineMeetings.Read.All` and `OnlineMeetingTranscript.Read.All`.
4. Click **Add permissions** to save the changes.
5. Click **Grant admin consent for \<Your Tenant\>** to enable the newly added permissions on your tenant.

## Gather information from Azure Portal

1. Navigate back to the **Overview** page of the App Registration associated with your Bot Resource. Note down the **Application (client) ID**.
2. Navigate to your Azure Portal **Home** and open **Azure Active Directory**.
3. In the left menu, select **Users** and click on a user that has admin privileges.
4. On the user's **Overview** page, note down the **Object ID** of the user.

## Configure an Access Policy for Fetching Transcripts

1. [Install PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.3) or open it if you already have it installed.
2. [Install the Microsoft Teams PowerShell Module](https://learn.microsoft.com/en-us/microsoftteams/teams-powershell-install).
3. Enter the following command in PowerShell and sign in:

   ```
   Connect-MicrosoftTeams
   ```

4. Replace the **Application (client) ID** you obtained earlier in the following command, and run it.
   ```
   New-CsApplicationAccessPolicy -Identity Transcript-Policy -AppIds "<Your Application (client) ID" -Description "Enable App to Fetch Meeting Transcripts on Behalf of User"
   ```
5. Replace the user's **Object ID** you obtained earlier in the following command, and run it.
   ```
   Grant-CsApplicationAccessPolicy -PolicyName Transcript-Policy -Identity "<Your Object ID>"
   ```
6. Optionally, grant the policy to the entire tenant so that it also applies to users you have not assigned this policy to. Be careful as this may take the place of any existing global policy.
   ```
   Grant-CsApplicationAccessPolicy -PolicyName Transcript-Policy -Global
   ```
7. You can check whether the policies have been successfully granted by running the following command to view all access policies in the tenant.
   ```
   Get-CsApplicationAccessPolicy
   ```

## Update Your Backend .env File With the Necessary Information

The following environment variables are needed for the transcript summary functionality:

```
# If true, generates a transcript summary after every meeting in which transcription is enabled
TranscriptSummaryEnabled=true

# User Id used to grant permissions for transcript access
UserId=<USER_ID_FOUND_IN_AZURE_PORTAL>

# Graph API endpoint
GraphApiEndpoint=https://graph.microsoft.com/beta

# Transcript Summary Model Endpoint, Can Replace with Model of Your Preference
TranscriptSummaryModelEndpoint=https://api-inference.huggingface.co/models/knkarthick/MEETING_SUMMARY

# Transcript Summary Model Token
TranscriptSummaryModelAPIKey=<API_KEY_FOR_QUERYING_YOUR_SUMMARY_MODEL>
```

- If `TranscriptSummaryEnabled` is true, the bot will attempt to generate a summary at the end of each meeting. If no transcript was generated during the meeting, the bot will send an adaptive card stating that no transcript was found. Else, if a transcript was generated, the bot will send an adaptive card containing a summary of the transcript.
- The `UserId` is the same as the user's **Object ID** that you used to configure the access policy earlier.
- The `GraphApiEndpoint` is a beta endpoint, which means that the APIs it exposes may be subject to change without warning.
- The `TranscriptSummaryModelEndpoint` is currently configured to use a meeting summary model from Hugging Face by leveraging their inference API. If you want to use a different model from Hugging Face or from another provider, some modifications may be needed to the file `backend/helpers/transcriptSummary.js`.
- The `TranscriptSummaryModelAPIKey` can be obtained from Hugging Face by creating an account and navigating to **Settings** > **Access Tokens** > **New token**. For other providers, some modifications to the file `backend/helpers/transcriptSummary.js` may be necessary.
