# Automation Pipeline Setup and Use

## Table of Contents

1. [Overview](#overview)
2. [Pre-requisites](#pre-reqs)
3. [Docker](#docker)
4. [parameters.json](#parametersjson)
   1. [azurevars](#azurevars)
      1. [required](#required)
      2. [optional](#optional)
   1. [pythonvars](#pythonvars)
      1. [app_names](#appnames)
      2. [envCreation](#envcreation)
5. [default.json](#defaultjson)
   1. [services](#services)
   2. [assignrolecollections](#assignrolecollections)
6. [Deploying Bridge](#deploying-bridge)
7. [Running the Pipeline](#running-the-pipeline)
   1. [Remainder of Docker Configuration](#powershell-module-installation-and-configuration)
   2. [Azure Resource Deployment](#azure-resource-deployment)
   3. [CF login](#cf-login)
   4. [BTPSA](#btpsa)
   5. [Application Deployment](#application-deployment)
   6. [Key Credential Retrieval](#key-credential-retrieval)
   7. [Enviroment Creation and Event Mesh Configuration](#enviroment-creation-and-event-mesh-configuration)
   8. [Teams app package creation](#teams-app-package-creation)
8. [Report Errors](#reporting-errors)

## Overview

This repository is reponsible for creating the Docker container and providing the container with the tools needed for the automation pipeline to run.

There are more details on this in the `Docker` section below, but for a quickstart, create the Docker container by running `./run`. The resulting Docker container is where the automation pipeline will live.

Inside of this container, the script that glues the entire pipeline together is called `BTPSA`. To run this, and thereby also to run the automation pipeline, simply call `./btpsa` in the Docker container.

Note that configuration of the necessary files for Bridge is needed before running this script to get a working version of Bridge. Furthermore, there are some manual steps that are still required to be done in addition running this script in order to configure Bridge to your specifc use case.

Note that this script runs three types of executions. Execution before, during, and after BTPSA configures the BTP account. All of these are located in `/home/user/usescases/released/default.json` and are, respectively, under the following sections: `executeBeforeAccountSetup`, `services`, `executeAfterAccountSetup`. The first is responsible for completing the configuration of the Docker container and logging into Cloud Foundry. The second is responsible for configuring the BTP account. The last is for application deployment, application environment creation, and for saving the service key info of some instances tied to the account.

## Pre-reqs

Before we get to installing and running BTPSA, you will need to install [Docker engine](https://docs.docker.com/desktop/) first and have a BTP account (prod version).

Note that the configuration files should be completed before running the automation pipeline. In addition to the Bridge Framework's config and .env files, the automation pipeline will also require some configuration. This will include the variables at the top of `CreateDeployment.ps1` and `DeleteDeployment.ps1`, as well as the `parameters.json` and `default.json` file. Configuration details for the latter can be found below in their own respective sections. The powershell script configuration details can be found in `/home/user/btp-bridge-framework/documentation/automation/Automation Overview.md`. The same README file also has details for the two `JSON` files mentioned.

**Note:** you will need to copy over the `azure-configuration` folder in from the `Bridge` repo, as this folder is not currently in the sap-samples repository. To copy this into the docker container run the following command: `docker cp <source> <docker_container_id>:/home/user/btp-bridge-framework/azure-configuration`. The `<docker-container_id>` will be outputted from `./run` at the end of the script. It can also be found in Docker Desktop (once the container is running).

Also, the user will need to have the cloud foundry command line tools installed in order to install the docker container.

## Docker

### Using the Released Package

Choose the correct release for your computer from our releases page. Once you have determined the appropriate release, download the zipped Docker container - the name of the file should look like this: `bridge-automation-pipeline.tar.gz`.

While the file is being downloaded, start up the Docker engine - this can be done by opening up Docker Desktop. Once the file is downloaded locally, run the following commands to load the image and start the container:

```
docker load -i <path_to_zipped_file>/bridge-automation-pipeline.tar.gz
docker container run -e BTPSA_VERSION_GIT="\$(git describe --long --tags  --always)" --rm  -it -d --name bridge-automation-pipeline bridge-automation-pipeline
```

**Note:** the container will exit and these commands will fail if the Docker engine has not started before calling them.

### Fresh Build

You will need to download and unzip the source code from the releases page. Once you have the code up, the Docker container can be built by using one of the following:

- `./run` for macOS/Linux
- `.\run.bat` for windows
- `.\run.ps1` from powershell core (cross platform)

### Attaching to the Container

I would then recommend attaching a VSCode instance to the open Docker Container. This can be done by installing the dev containers extension (if it is not already installed) in VSCode. At this point, it would be good to copy in the `azure-configuration` folder, as mentioned in the previous section.

Then open command palette (Windows: `Ctrl+Shift+P`; Mac: `Cmd+Shift+P`) and select the `Remote Containers: Attach to Running Container...` command. Attach to the container by name, in this case it should be `bridge-automation-pipeline`. This option might only work after using Docker or installing and connecting to this Docker container.

Note that if this option is not present, then you may need to install the following VSCode extensions: `remote development` and `dev containers` (the latter may not be needed). From there you should be able to connect the container by clicking on the logo that looks like a monitor with a disconnected symbol on it (located on the left side panel). From there you should be presented with a drop down called `Other Containers` with should have `bridge-automation-pipeline` underneath it. To connect, click on the window icon with a plus on it (to the right of the `bridge-automation-pipeline`). Then press `Got It` in the following pop up. The container should now load up.

Once the contianer loads up, you may need to select the default directory. To do so, you can click on `Open Folder` and then press enter (this should default to `/home/user` for the home path of the docker container).

You should now be within the docker container.

If you wish to attach via a terminal instead, the following should also work: `docker exec -it bridge-automation-pipeline bash`.

## parameters.json

This file is responsible for determining which global account, subaccount, and space to use, along with some details associated with each. Additionally it can assign role collections if needed.

The following parameters will need to be configured in order to handle idenfication for BTP and CF CLIs in this file:

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

`region` should be set to the region for SAP BTP subaccount. This can be found within the subaccount. It should be contained in url (they follow this format: `https://api.cf.<region>.hana.ondemand.com`) of your default cf space. **Note** that if your region is something like `us10-001`, only use the prefix, which is just `us10` in this case. This can also be configured when creating a subaccount.

`globalAccountId` should be set to your SAP BTP global account. This can be found under the `Global Account Subdomain` field after pressing settings (gear icon located at the top right of the screen) at the global account level.

`subaccountId` should be set to the subaccount id of SAP BTP subaccount. This can be found under the `General` section of a subaccount.

`subaccountName` should be set to the name of the subaccount.

`organizationId` should be set to the value of `Org ID`. This can be found in the `Clound Foundry Environment` under a subaccount.

`organization` should be set to `Org Name`. This can also be be found in the `Clound Foundry Environment` under a subaccount.

`hostRegion` should be set to the full value of region from the aforementioned url: `https://api.cf.<region>.hana.ondemand.com`.

`cfcliapicfSpaceName` should be set to the `cf space` you wish to configure.

`email` should be set to your user email tied to BTP cockpit.

Additionally, two other sections of `parameters.json` must be completed: `azurevars` and `pythonvars`.

### azurevars

`azurevars` section looks like this:

```
"azurevars": {
      "required": {
        "location": azureLocation,
        "messagingEndpoint": messagingEndpoint,
        "providerScopeBaseUrl": providerScopeBaseUrl,
        "sapPlatformObjId": sapPlatformObjId,
        "msteamsWebClientId": msteamsWebClientId,
        "msteamsSPId": msteamsSPId,
        "replyUrlsPrefixes": replyUrlsPrefixArray,
        "identifierUrisPrefixes": identifierUrisPrefixArray,
        "tokenExchangeUrlPrefix": tokenExchangeUrlPrefix,
        "blobStorageSkuName": blobStorageSkuName,
        "blobStoragePermission": blobStoragePermission
      },
      "optional": {
        "resourceGroupName": resourceGroupName,
        "registrationName": registrationName,
        "blobStorageContainerName": blobStorageContainerName,
        "blobStorageAccountName": blobStorageAccountName,
        "botName": botName,
        "signInAudience": signInAudience,
        "appType": appType,
        "sku": sku,
        "connectionNamePrefix": connectionNamePrefix,
        "serviceName": serviceName
      }
    },
```

Note that both the `required` section and `optional` section are needed to run the pipeline. The parameters in `optional` are placed there because they often do not require any user interaction. The parameters in `required`, on the other hand, often require some degree of configuration.

#### required

`location` should be set to a valid azure resource location. The following are valid options:

```
eastus, eastus2, southcentralus, westus2, westus3, australiaeast, southeastasia, northeurope, swedencentral, uksouth, westeurope, centralus, southafricanorth, centralindia, eastasia, japaneast, koreacentral, canadacentral, francecentral, germanywestcentral, norwayeast, switzerlandnorth, uaenorth, brazilsouth, eastus2euap, qatarcentral, asia, asiapacific, australia, brazil, canada, europe, france, germany, global, india, japan, korea, norway, southafrica, switzerland, unitedstates, northcentralus, westus, centraluseuap, westcentralus, southafricawest, australiacentral, australiacentral2, australiasoutheast, japanwest, koreasouth, southindia, westindia, canadaeast, francesouth, germanynorth, norwaywest, switzerlandwest, ukwest, uaecentral, brazilsoutheast
```

It is suggested to choose a location closest to where you are developing.

`messagingEndpoint` is the url that is used to communicate with the bot. It follows this pattern: `https://<backend-app-name>.cfapps.<subaccount-region>.hana.ondemand.com/api/messages`.

The `providerScopeBaseUrl` is used to create the permission scopes for the Oatuh Connection tied to the Azure Bot resoruce. It follows this pattern: `api://<frontend-app-name>.cfapps.<subaccount-region>.hana.ondemand.com`.

`sapPlatformObjId` is the **object id** (not the application id!) of the enterprise application that establishes a trsut between SAP BTP and Microsoft Azure. This is created during the manual step that establishes principal propagation.

`msteamsWebClientId` is the application id of the ms teams web client service principal - this an existing enterprise application. It's value should be set to `5e3ce6c0-2b1f-4285-8d4b-75ee78787346`.

`msteamsSPId` is the application id of the ms teams service principal - also an existing enterprise application. It's value should be set to `1fec8e78-bce4-4aaf-ab1b-5451cc387264`.

`replyUrlsPrefixes` provide the base url for reply urls (aka redirect urls). The syntax for this parameter follows this pattern: `https://<frontend-app-name>.cfapps.<subaccount-region>.hana.ondemand.com`. For each unique reply url needed for your use case, provide the associated base reply url here. This parameter should be an array. Also note, the first value entered in the array should be `https://token.botframework.com/.auth/web/redirect`. This value is for testing the Oauth configuration of the Azure Bot service. Thus, the smallest length of this array for a working version of Bridge should be two.

`identifierUrisPrefixes` provide the base url for identifier uris. The syntax for this parameter follows this pattern: `api://<frontend-app-name>.cfapps.<subaccount-region>.hana.ondemand.com`. An application can have more than one identifier uri. In this instance, please specify each unique application identifer uri prefix. This parameter is also an array type.

`tokenExchangeUrlPrefix` provides the base url for the token exchange url. This parameter follows this pattern: `api://<frontend-app-name>.cfapps.<subaccount-region>.hana.ondemand.com`.

`blobStorageSkuName` provides the sku value for the blob storage account. The following are acceptable values for this field:

```
Standard_LRS. Locally-redundant storage.
Standard_ZRS. Zone-redundant storage.
Standard_GRS. Geo-redundant storage.
Standard_RAGRS. Read access geo-redundant storage.
Premium_LRS. Premium locally-redundant storage.
Premium_ZRS. Premium zone-redundant storage.
Standard_GZRS - Geo-redundant zone-redundant storage.
Standard_RAGZRS - Read access geo-redundant zone-redundant storage.
```

`Standard_GRS` is the recommended option.

`blobStoragePermission` provides the permissions for the blob storage container. The following are acceptable values for this field:

```
Container. Provides full read access to a container and its blobs. Clients can enumerate blobs in the container through anonymous request, but cannot enumerate containers in the storage account.

Blob. Provides read access to blob data throughout a container through anonymous request, but does not provide access to container data. Clients cannot enumerate blobs in the container by using anonymous request.

Off. Which restricts access to only the storage account owner.
```

`Off` is the default and recommended option.

#### optional

`resourceGroupName` is the name for the resource group to be created.

`registrationName` is the name for the application registration to be created.

`blobStorageContainerName` is the name for the azure storage container.

`blobStorageAccountName` is the name for the azure storage account. This must unqiue on the first run.

`botName` is the name for the azure bot.

`signInAudience` specifies who can use the application. The value for this field should be set to `AzureADMultipleOrgs`.

`appType` specifies the type of the application created. The value for this field should be set to `MultiTenant`.

`sku` is the Sku of the bot. The accepted values are `F0` and `S1`. The recommended value is `F0`.

`connectionNamePrefix` is the name specified for the Oauth Connection for the bot.

`serviceName` specifies the name of the service provider. The value of this field should be set to `Aadv2`. However, should an alternative value be desired the list of all service providers can be obtained via the following command: `az bot authsetting list-providers`.

### pythonvars

`pythonvars` section looks like this:

```
"pythonvars": {
    "app_names": {
        "backend": backendName,
        "config": configName,
        "frontend": frontendName
    },
    "envCreation": {
        "subscription_name": subscription_name,
        "endpoint": endpoint,
        "queue_name": queue_name,
        "sap_graph_instance_name": sap_graph_instance_name,
        "skip_pre_flight": skip_pre_flight,
        "saml_alias": saml_alias
    }
},
```

There are two sections that need to be configured here: `app_names` and `envCreation`.

#### app_names

`backend` is the name of the backend application. This should be the same as that specified in the manifest.yaml file used for cloud foundry.

`config` is the name of the config application. This should be the same as that specified in the manifest.yaml file used for cloud foundry.

`frontend` is the name of the frontend application. This should be the same as that specified in the manifest.yaml file used for cloud foundry.

#### envCreation

`subscription_name` specifes the subscription name for the webhook attached to the queue.

`endpoint` is the endpoint for the event mesh queue. It should have the following syntax pattern: `https://<backend-app-name>.cfapps.<subaccount-region>.hana.ondemand.com/notify/notifyUser"`

`queue_name` specifies the name of the queue. The queue name should following this syntax pattern: `<yourorgname>/<yourmessageclientname>/<uniqueID>/<queue_name>`. **Note:** the ``<yourorgname>/<yourmessageclientname>/<uniqueID>` must match the value specified in the `namespace` parameter of the `enterprise-messaging` instance specifed under `services` in `default.json`.

`sap_graph_instance_name` the name of the graph instance used in BTP. **Note:** if you do not need to configure a graph instance, this field should be removed from the `pythonvars` section.

`skip_pre_flight` should be set to `true`.

`saml_alias` comes from the reply url after creating the trust application. Under the single-sign on section of the service princiapl of the enterpise application created for the trust, the first section `Basic SAML Configuration` contains a parameter called `Reply URL (Assertion Consumer Service URL)`. This url follows this syntax: `https://<subdomain>.authentication.<subaccount-region>.hana.ondemand.com/oauth/token/alias/<alias_value>`. The `saml_alias` is the `alias_value` in this url.

## default.json

This file is responsible for defining the service instances in the BTP subaccount and space. Furthermore, it can also configure role collections. Lastly, the `executeAfterAccountSetup` and `executeBeforeAccountSetup` sections allows us to piece together all of the automation portions of the Bridge Framework together.

Here are the main sections that can be configured within `default.json`:

- services
- assignrolecollections

### services

`services` is where the BTP instances are specified. By default, the full Bridge configuration (that can be automated) is provided. Services that are not used may be removed by the customer before triggering the automation pipeline.

The `it-rt` (aka integration flow or Isuite) service may need cause problems during installation if there is not enough space to provision this instance at the global account level. The solution would be to increase provisioning space, remove an existing instance, or to remove the instance configuration from `default.json`. Furthermore, this object should only exist within `default.json` if your Bridge instance will require integration suite. Otherwise, please remove it.

Also note that the `namespace` choosen for the `enterprise-messaging` service must be consistent with the `queue_name` specified in `parameters.json` under the `pythonvars["envCreation"]` section. Note that this `namespace` is responsible for causing every message client within a subaccount to be unique.

### assignrolecollections

`assignrolecollections` does not require any configuration. The values there are sample values and are used to configure users of the system specified in `parameters.json` under `myusergroups`. However, the user that configured the subaccount is realistically the one that has access to everything, and thus does not need to configure these two sections if no other user needs any permissions to this application.

The rest of this file does not need additional configuration. Names and instance names can be changed if desired. `executeBeforeAccountSetup` and `executeAfterAccountSetup` should not be tampered with. The scripts being called in these sections are what handle the installation process - editing them will cause problems, especially if the user is not familiar with the entirety of the pipeline.

The user can add extra services to ship with Bridge if they so choose to. Observe that BTPSA does come with auto-intelligence and the user can use this to configure instances not supported by the `default.json` usecase. However, there is no further support for this feature currently.

## Deploying Bridge

Application deployment requires no configuration, but it is possible to change the name of instances if desired. These values can be found in `manifest.yaml` in the root directory (of both the docker container and this repo). **Note:** if the names of the applications are changed in `manifest.yaml`, they will also need to be changed within `parameters.json`, specifically under the `pythonvars["app_names"]` section. **The application names must match in these two files!**

## Running the Pipeline

Once everything has been configured and the `azure-configuration` folder is copied over, the pipeline can be run via the following command: `./btpsa`. The script will require several user interactions will it runs.

There are several sections in the automation pipeline that trigger in this order:

1.  Remainder of Docker Configuration
    - Powershell installation
    - Azure powershell installation
    - Azure CLI installation
2.  Azure Resource Deployment
    - Configures Azure Bot Service and related resources
3.  CF login
4.  BTPSA
    - The instances listed under `services` are provisioned
5.  Application Deployment
    - Push each app to the BTP space
6.  Key Credential Retrieval
    - Grabs auth tokens for API Business Hub calls
    - These tokens are used for futher BTP configuration
7.  Enviroment Creation and Event Mesh Configuration
    - The user-provided variables section is generated for each app that needs environment variables
    - Event mesh queue and subscription are created
8.  Teams app package creation

Actions 1-3 correspond to the commands in `executeBeforeAccountSetup`. Action 4 is BTPSA provisioning the instances listed in `services` inside of `default.json`. Actions 5-8 correspond to the commands in `executeAfterAccountSetup`.

### Pipeline Step-By-Step

#### Authenticaion

The first piece of user interaction occurs before any of these actions are running. It. is for connecting to the BTP CLI server. The prompt will look something like this:

```
[2022-12-03 01:01:35] RUN COMMAND: btp login --url 'https://cpcli.cf.eu10.hana.ondemand.com' --subdomain 'icsvcustomerengagement' --sso
Connecting to CLI server at https://cpcli.cf.eu10.hana.ondemand.com...

Opening browser for authentication at: https://cpcli.cf.eu10.hana.ondemand.com/login/v2.24.0/browser/19e20ad7-fcb3-4fe6-ae26-1fe7abf2c279

Failed to open browser. Please authenticate manually.
Waiting for user authentication to complete (use Ctrl+C to abort)...
```

To contine, open the link after the statement `Opening browser for authentication at:` - to open the link from the VSCode terminal, click on it while holding down command (control for Windows). This will redirect to a page that will have a button in the middle of the screen saying `Proceed and log in`. Click on that to complete authentication.

BTPSA will now handle some formatting commands and then proceed to trigger the azure resource deployment section of the pipeline.

#### Powershell Module Installation and Configuration

This section correlates to action 1, which is the following section of `executeBeforeAccountSetup`:

```
{
    "description": "Installing pwsh, az pwsh, and az cli",
    "command": "cd /home/user/docker-configuration && python -c \"import run; run.system_setup()\""
},
```

If this section of the script errors, the program should automatically rollback. However, the overall pipeline will continue. If the pipeline continues onward from this section after a rollback, you will need to exit the pipeline and restart the script. To observe a rollback, simply check the last few prompts in the terminal before this section ends. Furthermore, to see what is going as the script is running, you may check the `docker-configuration.log` file - it may be easier to see if failure or rollback occured by reading this file. If this section continues to fail, try restarting the docker container. This can be down be rebuilding the docker container with appropriate `./run` command specified above.

A succesful run for this section should end with the following prompts in the terminal:

```
Checking pwsh module status - see logs for more details

Successfully ran the following command: 'pwsh -v'


Checking status of az modules - see logs for more details

Successfully ran the following command: 'az version'


Checking if expect is installed - see logs for more details

Successfully ran the following command: 'expect -v'
```

To re-trigger this action and only this action use the following command: `cd /home/user/docker-configuration && python -c 'import run; run.system_setup()'`

#### Azure Resource Deployment

This section correlates to action 2, which is the following section of `executeBeforeAccountSetup`:

```
{
    "description": "Creating azure bot service and corresponding resources",
    "command": "pwsh /home/user/btp-bridge-framework/azure-configuration/CreateDeployment.ps1"
},
```

This section will need user interaction for logging into each appropriate powershell module. The first login prompt will look like this in the terminal:

```
Running create deployment script


Logging in

WARNING: To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code <device_code> to authenticate.
```

Click on the link and enter the code provided. Then on the page you are re-directed to, select the user account in which the resources will be created - you may need to login to that account here. After doing so, press `Continue` on the next page you are re-directed to.

Now, the second sign in interaction will occur - it should look like this prompt in the terminal:

```
ERROR: Please run 'az login' to setup account.
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code <device_code> to authenticate.
```

Follow the same process as last time. At this point the script should be running. If you see errors such as the following:

```
Storage account duplication check

Get-AzStorageAccount: /home/user/btp-bridge-framework/azure-configuration/CreateDeployment.ps1:99:31
Line |
  99 |  … geAccount = Get-AzStorageAccount -ResourceGroupName $resourceGroupNam …
     |                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | The Resource 'Microsoft.Storage/storageAccounts/autoaccount' under resource group
     | 'AutomationTestingResourceGroup' was not found. For more details please go to
     | https://aka.ms/ARMResourceNotFoundFix


Resource group check
```

or

```
Get-AzResourceGroup: 10:37:42 AM - Provided resource group does not exist.
```

Ignore them. These are issued by the cmdlets that retrieve resources when the resource does not exist. They have no impact on how the script runs, these commands simply check to see if a resource with the information supplied already exists. If it does, the script then removes the resources and builds it from scratch. The fresh install is to avoid any duplication or modification errors.

However, something has gone wrong if an error like the following occurs in the terminal:

```
[2022-12-03 01:18:45] ERROR      : Something went wrong, but the script can not fetch the error message. Please check the log messages before.
```

If an error occurs during this section that requres a re-run of Azure resource deployment, then the script should be re-triggered. **Note**, the re-run can be sped up if you remove action 1 (assuming it ran successfully - i.e. powershell installed successfully) from the `executeBeforeAccountSetup` section, but this is optional.

If an error such as the following is seen:

```
cli.azure.cli.core.azclierror: An error occurred. UnknownError: An unexpected error occurred. Exception: 'Newtonsoft.Json.JsonSerializationException: Error converting value "FallbackDeploymentEnvironment" to type 'Microsoft.Bot.Internal.Schema.ApsDeploymentEnvironment'. Path 'properties.deploymentEnvironment'. ---> System.ArgumentException: Requested value 'FallbackDeploymentEnvironment' was not found.
```

Then there are larger problems. An `UnknownError` in this format likely indicates an issue with the Azure/Powershell cmdlet itself. This would mean a Microsoft bug or update has occured and our pipeline will need a patch to fix this type of problem.

If you should ever need to trigger a fresh install for the Azure Resources, simply run this command in the terminal: `pwsh /home/user/btp-bridge-framework/azure-configuration/CreateDeployment.ps1`.

#### CF Login

This section correlates to action 3, which is the following section of `executeBeforeAccountSetup`:

```
{
    "description": "Logging into cf cli",
    "command": "cf login"
}
```

This would be a good time to check that the previos two actions ran fine. A good check is if there are no errors/red log statements in the console.

At this point you should see this:

```
Values you may want to save (they are in the log):
MicrosoftAppId=<app_id>
MicrosoftAppPassword=<secret_value>
connectionName=<connection_name>

Script has finished creating azure resources - check azure for deployments

####################################################################################################
# COMMAND EXECUTION: Logging into cf cli
####################################################################################################
[2022-12-08 19:42:17] INFO       : Executing the following commands:
cf login

[2022-12-08 19:42:17] RUN COMMAND: cf login
API endpoint:
```

At this point, enter the API endpoint of your CF environment. It should look something like this: `https://api.cf.<subaccount_region>.hana.ondemand.com/`.

Then you will be prompted to enter your email, followed by your password to CF; please do so.

Then select the org which holds your space - you may need to enter your targeted space next.

#### BTPSA

At this point we hit action 4. This is BTPSA configuring whatever was listed in the `services` array in `default.json`. You will see a lot of commands being printed in the terminal during this part of the automation pipeline. For example:

```
####################################################################################################
# Initiate creation of service instances
####################################################################################################
[2022-12-08 19:48:14] INFO       : Create instance >ms-teams-us10-app-logger< for service >application-logs< and plan >lite<
[2022-12-08 19:48:14] RUN COMMAND: cf create-service 'application-logs' 'lite' 'ms-teams-us10-app-logger'
[2022-12-08 19:48:15] INFO       : Create instance >ms-teams-us10-xsuaa< for service >xsuaa< and plan >application<
```

Sometimes error will occuring in here. They are usually related to aforementioned details inside of either `parameters.json` or `default.json`.

One of the more common errors is lack of provisioning space. Here is the error for integration flow, as a result of this lack of space:

```
[2022-12-08 19:48:46] ERROR      : Job (42f05861-e9b8-4bdb-9968-279495f0c144) failed: provision could not be completed: Service broker error: Service broker it-broker-rt failed with: You have not provisioned a tenant for Process Integration service or activated the Cloud Integration capability of Integration Suite service. Please subscribe to the relevant service and provision/activate the tenant before creating the service instance.
```

This error can be fixed by removing this item from the `services` array:

```
{
    "category": "SERVICE",
    "name": "it-rt",
    "plan": "integration-flow",
    "amount": 1,
    "instancename": "ms-teams-us10-integration-flow",
    "createServiceKeys": ["integrationFlowServiceKey"]
},
```

These kinds of errors will unfortunately require a restart via `./btpsa`. The good news is that if the previous actions were successful, you can remove actions 1 and 2 inside of `executeBeforeAccountSetup` to save time on future re-runs from BTPSA errors.

An error like this that does not cause the pipeline to stop can usually be ignored:

```
[2022-12-08 19:57:07] ERROR      : you didn't define a usergroup >john.admin@test.com< in your parameters file >parameters.json<. Therefore no members where found.
```

#### Application Deployment

This section correlates to action 5, which is the following section of `executeAfterAccountSetup`:

```
{
    "description": "Pushing applications to BTP acocunt",
    "command": "python -c 'import cfCommands; cfCommands.main()'"
},
```

This indicates that application deployment has started:

```
####################################################################################################
# COMMAND EXECUTION: Pushing applications to BTP acocunt
####################################################################################################
[2022-12-08 19:57:23] INFO       : Executing the following commands:
python -c 'import cfCommands; cfCommands.main()'

[2022-12-08 19:57:23] RUN COMMAND: python -c 'import cfCommands; cfCommands.main()'

Pushing ms-teams-us10-backend-automation-test - see logs for more details
```

This section will take some time to finish as the deployment of the frontend application usually requires a rollback - this rollback occurs automatically.

Any errors here are due to misconfigurations in either `parameters.json`, the `manifest.yaml`, or both.

#### Key Credential Retrieval

This section correlates to action 6, which is the following section of `executeAfterAccountSetup`:

```
{
    "description": "Getting key credentials",
    "command": "python -c 'import cfCommands; cfCommands.post_execution_cf_cmds()'"
},
```

This action will be entered when this is displayed in the terminal:

```
####################################################################################################
# COMMAND EXECUTION: Getting key credentials
####################################################################################################
[2022-12-08 20:02:22] INFO       : Executing the following commands:
python -c 'import cfCommands; cfCommands.post_execution_cf_cmds()'

[2022-12-08 20:02:22] RUN COMMAND: python -c 'import cfCommands; cfCommands.post_execution_cf_cmds()'

Retrieving key - see logs for more details
```

This section does not currently aid much in the pipeline. Any errors here should be ignored for now.

#### Enviroment Creation and Event Mesh Configuration

This section correlates to action 7, which is the following section of `executeAfterAccountSetup`:

```
{
    "description": "Creating env in BTP",
    "command": "python -c 'import main; main.main()'"
}
```

The pipeline is in this section when you see the following:

```
####################################################################################################
# COMMAND EXECUTION: Creating env in BTP
####################################################################################################
[2022-12-08 20:02:24] INFO       : Executing the following commands:
python -c 'import main; main.main()'

[2022-12-08 20:02:24] RUN COMMAND: python -c 'import main; main.main()'
Logging into cf cli
API endpoint: https://api.cf.<subaccount_region>.hana.ondemand.com

Email:
```

You will once again need to log into the CF Cli.

Later in this action, you will be asked to log into the BTP Cli (**this section only applies if `sap_graph_instance_name` is left as a field in `parameters.json`**):

```
SAP BTP command line interface (client v2.24.0)

CLI server URL [https://cpcli.cf.eu10.hana.ondemand.com]>
```

Press `enter` here. Then the following prompt should occur:

```
Connecting to CLI server at https://cpcli.cf.eu10.hana.ondemand.com...

Opening browser for authentication at: https://cpcli.cf.eu10.hana.ondemand.com/login/v2.24.0/browser/174d9478-2b88-4372-a4f5-e9a2b92ac138

Failed to open browser. Please authenticate manually.
Waiting for user authentication to complete (use Ctrl+C to abort)...
```

Click on the link that follows the `Opening browser for authentication at:` text. Then press on `Proceed and log in`.

Shortly after, you might be prompted to enter in information about an SAP Graph instance:

```
Enter the service binding id of the sap graph instance you wish to use:
```

If you do not have an SAP Graph instance, simply press enter. There will be a command that fails, but it will not impact the rest of the script.

If you do have an SAP Graph instance, then to get the binding id of it, run the following command in a separate terminal (the reason for this is because you had multiple instances of graph available and the pipeline could not determine which to use): `btp list services/bindings --subaccount <subaccount_id>`.

The command will return something like the following:

|               Name               |     id     | ready |  service_instance_id  | service_instance_name |
| :------------------------------: | :--------: | :---: | :-------------------: | :-------------------: |
| ms-teams-us10-graph-credentials  | <id_value> | true  | <service_instance_id> |  ms-teams-us10-graph  |
| ms-teams-us10-graph-credentials2 | <id_value> | true  | <service_instance_id> | ms-teams-us10-graph2  |

You will want to enter the `service_instance_id` of the correct instance above.

#### Teams App Package Creation

This section correlates to action 8, which is the following section of `executeAfterAccountSetup`.

```
{
    "description": "Zipping teams app package",
    "command": "python -c 'import main; main.zipper()'"
}
```

This creates the zip file for the user to upload to MS Teams. The file can be found here (after this command is completed): `/home/user/btp-bridge-framework/teams-app-package/teams-app.zip`. It also automatically updates the manifest.json file that is responsible for generating the zip file. **Note:** manifest.json under `/home/user/btp-bridge-framework/teams-app-package/` may need some initial configuration.

#### Success

On success you will see this prompt in the terminal:

```
####################################################################################################
# SUCCESSFULLY EXECUTED THE USE CASE
####################################################################################################
[2022-12-08 20:08:17] INFO       : checkout your SAP BTP account and how it was setup for the use case
[2022-12-08 20:08:17] CHECK      : link to your SAP BTP sub account: https://cockpit.<subaccount_region>.hana.ondemand.com/cockpit/#/globalaccount/icsvCustomerEngagement/subaccount/<subaccount_account_id>/service-instances
####################################################################################################
# SUCCESSFULLY FINISHED USE CASE EXECUTION
####################################################################################################
```

## Reporting Errors

Errors will be logged in `/home/user/log/` directory. Errors for `BTPSA`, application deployment, and Azure resource configuration can be found in `script.log`, `cf.log`, and `pwsh.log` respectively. There also exists a far more in-depth version of the cloud foundry log, which can be found in `detailed-cf-log.log`. If something went wrong with the configuration of the Docker container, details can be found in `docker-configuration.log`. Lastly, there is a `btp-instance-configuration.log` file, which is responsible for storing the logging associated with the creation of user-provided variables.

`script.log` will contain logging throughout the entire script and can be useful for determining where in the pipeline an error occured (as each command has its own section in this script).

Errors can then be reported from there, or the program can be debugged from there if credentials/configurations are not entered correctly.
