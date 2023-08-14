# Automated Setup

Users are encouraged to use the automated setup, as it saves times and greatly reduces complexity. That being said, this tool will not be able to setup the entirety of Bridge Framework due to some limitations with the systems Bridge connects to.

Please note that our automated setup tool comes in two flavours: the default image and a btp free tier image. Both images can be found on the release page. For differences between the two versions of Bridge, please refer to [this document](./different-images.md). 

Automated setup will configure your BTP space and subaccount, as well as your resources in Azure. To see what steps you still need to setup by hand, for your use case, please refer to step 3 of [this guide](../manual-setup/manual-setup.md).

## Prereqs

Before jumping into the automated setup, users will need to have a few things already installed on their computer.

Here's a list of what you'll need:
 - Docker Image for Automated Setup (find that on our repo)
 - [Docker Engine](./prereqs/docker-install.md)
 - [VSCode](./prereqs/vscode-install.md) (not required, but strongly recommended)

Additionally, please see [this list](./prereqs/role-collections.md) for role collections needed in your BTP account.

## Booting Up the Container

After downloading the gzipped docker image from our repository, you can load the image into Docker with the following command:

```
docker load -i ./bridge-automation-pipeline.tar.gz
```

To then build and run the container, use the following command:

```
docker container run -e BTPSA_VERSION_GIT="\$(git describe --long --tags  --always)" --rm  -it -d --name bridge-automation-pipeline bridge-automation-pipeline
```

If the above command errors, specifically about the `--rm` flag, manually delete the existing Bridge container (if one has already been built) and then re-run the command without the `--rm` flag:

```
docker container run -e BTPSA_VERSION_GIT="\$(git describe --long --tags  --always)" --rm  -it -d --name bridge-automation-pipeline bridge-automation-pipeline
```

*For those unfamiliar with terminals, you will need to open a terminal at the download location of the packaged docker container. After opening the terminal application on your computer, enter the following command: `cd Downloads/` and then run the commands above.

### Connect with VSCode

You can then connect to the container via VSCode and the Dev Containers extension. To do so, open the command palette (Windows: Ctrl+Shift+P; Mac: Cmd+Shift+P) and select the `Remote Containers: Attach to Running Container...` command. Attach to the container by name, in this case it should be `bridge-automation-pipeline`. This option might only work after using Docker or installing and connecting to this Docker container.

Note that if this option is not present, you should be able to connect to the container by using the UI version of the Dev Containers extension. Click on the logo that looks like a monitor with a disconnected symbol on it (located on the left side panel) - if you hover over the logo, it should say `Remote Explorer`. From there you should be presented with a drop down called Other Containers with should have `bridge-automation-pipeline` underneath it. To connect, click on the window icon with a plus on it (to the right of the bridge-automation-pipeline). Then press `Got It` in the following pop up. The container should now load up.

Once the container loads up, you may need to select the default directory. To do so, you can click on `Open Folder` button and then press enter (this should default to `/home/user` for the home path of the docker container).

### Connect with Terminal

To remote into the Docker container using the command line, run the following command:

```
docker exec -it bridge-automation-pipeline ash
```

`bridge-automation-pipeline` is the name of the running container and `ash` is the type of terminal that will be running inside of the container.

## Configuration

### parameters.json

This configuration file points the automated tool to your BTP global account, subaccount, and Cloud Foundry space. **You will have to update this file with your credentials before running the automated setup tool!!!**

You will need to configure the following fields:

```
"region": region,
"globalaccount": globalAccountId,
"subaccountid": subaccountId,
"subaccountname": subaccountName,
"orgid": organizationId,
"org": organization,
"cfcliapihostregion": hostRegion,
"cfspacename": cfSpaceName,
"myemail": email,
```

`region` should be set to the region for SAP BTP subaccount. This can be found within the subaccount. It should be contained in url (they follow this format: `https://api.cf.<region>.hana.ondemand.com`) of your default cf space. **Note:** if your region is something like `us10-001`, only use the prefix, which is just `us10` in this case. This can also be configured when creating a subaccount.

`globalAccountId` should be set to your SAP BTP global account. This can be found under the `Global Account Subdomain` field after pressing settings (gear icon located at the top right of the screen) at the global account level.

`subaccountId` should be set to the subaccount id of SAP BTP subaccount. This can be found under the `General` section of a subaccount.

`subaccountName` should be set to the name of the subaccount.

`organizationId` should be set to the value of `Org ID`. This can be found in the `Cloud Foundry Environment` section under the subaccount.

`organization` should be set to `Org Name`. This can also be be found in the `Cloud Foundry Environment` section under the subaccount.

`hostRegion` should be set to the full value of region from the aforementioned url: `https://api.cf.<region>.hana.ondemand.com`.

`cfcliapicfSpaceName` should be set to the cf space name that needs to be configured.

`email` should be set to your user email tied to BTP cockpit.

Additionally, you can configure and set roles to users in your BTP account now. To allocate who gets the roles, simply add another user group object in the array of the `myusergroups` field. This object looks like this:

```
{
    "name": "auditors",
    "members": ["captain@america.com"]
},
```

Where the `name` field is the label for your user group and the `members` field is an array of emails to add to that user group. The definition of the user group occurs in the `default.json` file - [see that section](#defaultjson) for more details.

Also, take note of the `"deployToTeams"` field under the `"additionalAutomationConfiguration"` object. This is set to `true` by default (`false` for the free-tier BTP Docker image), which means that the MS Teams App will be sideloaded into Teams as an organizational app during the lifetime of the automated setup. However, this can take a significant amount of time to register in Teams, sometimes up to a day.

You can verify that the deployment to your organization is in progress by running the following script inside of the docker container:

```
Connect-MicrosoftTeams -UseDeviceAuthentication

$appName = "Bridge Framework"
$teamsApp = Get-TeamsApp -DisplayName $appName -DistributionMethod organization

Write-Host $teamsApp.DisplayName  // this should print out 'Bridge Framework'
```

If speed is of importance, disable this feature by setting `"deployToTeams"` to `false`. Then, download the generated `teams-app.zip`, which will be placed under the `/btp-bridge-framework/teams-app-package/` directory in the Docker container, at the end of the automated setup tool. View [this guide](https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/apps-upload) to see how to upload the zip file into teams and activate Bridge. **Note:** this option will be much quicker, but anyone who wishes to use the app will have to follow this process as well!

Also, please update the following field in `parameters.json`:

```
"enterpriseApp": {
  "emails": [],
  "notificationEmail: ""
}
```

Replace the empty array with the emails of the users who will need access to Bridge. Alternatively, replace the array with the string `All` to include everyone in the Azure organization. 

**The app will not work if the empty array value is left unchanged!**

Make sure to update the `notifcationEmail` field to an email you monitor, as this email will receive a notification when the active certificate is near the expiration date.

Lastly, please be sure to update the region of your Resource Group. This is important for Azure resouce provisioning. You can find the this in the `parameters.json` file under `"azureResources"`:

```
"resourceGroup": {
  "location": region,
  "resourceGroupName": "AutomationTestingResourceGroup"
},
```

Replace `region` with one of the following valid options:

```
eastus, eastus2, southcentralus, westus2, westus3, australiaeast, southeastasia, northeurope, swedencentral, uksouth, westeurope, centralus, southafricanorth, centralindia, eastasia, japaneast, koreacentral, canadacentral, francecentral, germanywestcentral, norwayeast, switzerlandnorth, uaenorth, brazilsouth, eastus2euap, qatarcentral, asia, asiapacific, australia, brazil, canada, europe, france, germany, global, india, japan, korea, norway, southafrica, switzerland, unitedstates, northcentralus, westus, centraluseuap, westcentralus, southafricawest, australiacentral, australiacentral2, australiasoutheast, japanwest, koreasouth, southindia, westindia, canadaeast, francesouth, germanynorth, norwaywest, switzerlandwest, ukwest, uaecentral, brazilsoutheast
```

### parameters.json extended

**Note, users will likely need to change the value of their application names!** Application names are used to define the url route of the applications, and routes must be unique. So, it is recommended to make app names unique, otherwise duplication and conflict errors will occur.

Refer to the following to see what fields must be updated to avoid any issues:

```
"additionalAutomationConfiguration": {
  "appNames": {
    "backend": "bridge-framework-backend",
    "config": "bridge-framework-config",
    "frontend": "bridge-framework-frontend"
  },
  ...
}
```

It is recommended to add a prefix or suffix to each of the `backend`, `config`, and `frontend` app names. **These changes must be propagated to the main manifest (and sub-manifest files) - see below!**

### manifest.yaml

This is the main manifest file for your Cloud Foundry apps. Notice, that each application (frontend, backend, and config) has its own manifest within the Bridge folder (labeled as `btp-bridge-framework/` within the docker container). The individual manifests allow you to re-deploy, and, therefore, update each application individually. They are not pre-configured. The main manifest is and looks like so:

```
---
applications:
  - name: bridge-framework-backend
    memory: 512M
    disk_quota: 512M
    path: /home/user/btp-bridge-framework/backend
    buildpacks: 
      - nodejs_buildpack
    command: npm start
    services:
      - bridge-framework-destination
      - bridge-framework-connectivity
      - bridge-framework-xsuaa
      - bridge-framework-app-logger
  - name: bridge-framework-config
    memory: 64M
    disk_quota: 64M
    path: /home/user/btp-bridge-framework/config
    buildpacks:
      - staticfile_buildpack
  - name: bridge-framework-frontend
    memory: 64M
    disk_quota: 64M
    path: /home/user/btp-bridge-framework/frontend/build
    buildpacks: 
      - staticfile_buildpack
```

Should you configure the manifests tied to each application, the name in those files should match the name of the application from this file.

### default.json

This configuration file defines all of the BTP services that Bridge will use and how automated tool will run. The only configuration that may need to be edited here is the following field (located at the bottom of the file): `"assignrolecollections":`.

If you need to add a role collection beyond what already exists (rare occurrence), you will have to define a role collection object within this array. A role collection object looks like this:

```
{
    "name": "Enterprise Messaging Administrator",
    "type": "account",
    "level": "sub account",
    "assignedUserGroupsFromParameterFile": ["admins"]
},
```

The first three fields match the same fields for a role in the BTP cockpit. The last field, `assignedUserGroupsFromParameterFile`, is a pointer to the user groups defined in the `parameters.json` file, and is how we added users to this role collection. **Note:** any role collections specified here will be added to the user who is running the pipeline by default!

Additionally, this feature is still being used experimentally, so we recommend double checking the BTP cockpit that any additionally roles you define are correctly allocated.

## Run the Container

Before running the container, it is suggested that all configuration should be completed. This includes the configuration of what use case you plan on employing for Bridge as well. It is advised that you double check your configurations at this point.

To run the container, simply trigger `./btpsa` from the command line. During the execution of the container you will be prompted with authentication links to verify that it is your using your BTP and Azure accounts.

There are three types of links that you will encounter throughout the duration of the pipeline. Details on how to handle each type of link will be provided below.

### BTP Login Authentication

The first type of link is a BTP login link. It will look something like this in the terminal:

```
[2022-12-03 01:01:35] RUN COMMAND: btp login --url 'https://cpcli.cf.eu10.hana.ondemand.com' --subdomain <subdomain-name> --sso
Connecting to CLI server at https://cpcli.cf.eu10.hana.ondemand.com...

Opening browser for authentication at: https://cpcli.cf.eu10.hana.ondemand.com/login/v2.24.0/browser/<uuid>

Failed to open browser. Please authenticate manually.
Waiting for user authentication to complete (use Ctrl+C to abort)...
```

To continue, open the link inside the statement `Opening browser for authentication at: https://cpcli.cf.eu10.hana.ondemand.com/login/v2.24.0/browser/<uuid>`. To open the link from the VSCode terminal, click on it while holding down command (control for Windows). This will redirect to a page that will have a button in the middle of the screen with the title `Proceed and log in` or `Yes, log in to SAP BTP`. Click on that to complete authentication.

### Terraform

Note that in the release pages you may also find a PowerShell automation tool. This may be used if the Terraform tool is causing issues. The difference between the Terraform and PowerShell automation tool is that there are more Azure CLI device code logins to complete (similar to the Az Login section below) and no confirmations for deployment, like Terraform has.

#### Az Login

Terraform needs permission from Azure to provision resources, as a result you will have to login and allow access. 

The following prompt from the terminal will handle permissions:

```
ERROR: Please run 'az login' to setup account.
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code <device_code> to authenticate.
```

All you have to do is copy the `<device_code>` and enter that on the device login page, specified by the link provided (which is https://microsoft.com/devicelogin). You may get re-directed to a user selection page, when navigating to the device login url. Simply select the user account that you are using to setup Bridge. It may ask for your password to confirm you are that user, go ahead and enter it. After all of this, press `Continue` to allow your terraform access to the API tools that the automated setup will use.

#### Confirmation Deployment

```
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: 
```

Type in `yes` and press enter to confirm the resource deployment.

#### Remove Deployment

Occasionally, terraform will provision all Azure resources without error, but some issues will still occur in Azure. The Azure Bot Service will seldom have issues with its chat channels, even on success. When this happens, simply remove the resources provisioned by terraform and re-run the pipeline.

To remove resources in Azure, run the removal script `bash /home/user/iac-azure-modular/remove_azure_resources.sh`. Enter `yes` when prompted about resource removal.

To re-run the pipeline, call `./btpsa` again.

**Note:** Azure occasionally has issues with ghost deletes (confirming deletion of resources, but resources still exist). If this is the case please see [this issue](https://github.com/SAP-samples/btp-bridge-framework/issues/21), which details how to fix this problem.

### Deploy To Teams

If you have `deployToTeams` set to `true` in your `parameters.json` file, then you will be prompted with a Azure login device code again. Follow the same steps that were taken to login to Azure for terraform authorization.

If this is set to `false`, please see [this guide](../manual-setup/app-deployment/ms-app-deployment.md) for deploying your app to MS Teams.

**Note:** some versions of Firefox do not support the web client version of MS Teams.

### Cloud Foundry Authentication

The last type of authentication link you will see if from Cloud Foundry. It will look like this:

```
Temporary Authentication Code ( Get one at https://login.cf.us10.hana.ondemand.com/passcode ):
```

Open the link in your browser, it should redirect you to a button with your account on it, click on it. This should then reveal a code, copy the code, paste it into the terminal, and press enter!

## Error During Execution

Should an error occur during the execution of the automated setup, please check the `log/` folder for more details. We recommended checking `script.log` in this folder first. We also recommend double checking your configuration files for the pipeline, as most errors result from incorrect values here. If a specific error was not found, you can always try to re-run the automated setup tool. However, if the error persists, please reach out to alex.bishka@sap.com or submit an issue. Make sure to describe the error, detail which part of the pipeline it occurred, and submit all of the logs from the `log/` directory.

