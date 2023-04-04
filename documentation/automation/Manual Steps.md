# Manual Steps in Automation Pipeline

## Overview

This guide will cover the steps that still require manual configuration within the automation pipeline for configuring the Bridge Framework. These steps will be broken down into each of the three components covered by the pipeline:
 1. BTP
 2. Azure
 3. Application Deployment 

Furthermore, the pre-requisites needed to run the pipeline will covered as well. This will include help on items that need to be installed beforehand.

Please refer to the Automation Overview README for more details on how the automation tools work.

For other pieces that require manual setup, we will point towards previously established documentation.

## Pre-reqs

For setup users will need to have docker installed in order to run the automation tools, as they run within a docker container. To install docker container, see these [instructions](https://docs.docker.com/engine/install/). 

Configuration settings for BTP are by default utilizing services availabile only in an enterprise account. Free trial users have limited access to BTP resources and will need to use an alternative JSON configuration file to automate the creation of services in their BTP subaccount and Cloud Foundry space.

Users are also assumed to have an Azure account with access to basic Azure services, such as the Azure Bot Service.

## BTP

The setup of the trust for principal propagation on BTP, must be done manually. 

### Minimal Variation

1. Navigate to the BTP subaccount level
2. On the left hand panel, under `Security`, select `Trust Configuration`
3. Press the `SAML metadata` button to download the SAML metadata file

Read the Minimal Version section in the Azure section to continue and then complete the steps below.

1. Navigate back to the `Trust Configuration` screen from earlier
2. Select `New Trust Configuration`
3. Upload the `Federation Metadata XML` file downloaded from Azure
4. Provide a name for the trust configuration and disable `Available for User Logon`
5. Click `Save`

This process is now completed!

### Complex Variation

This will require manual setup of a XSUAA service. It is recommended to follow the minimal variation, but the follow steps are adapted from this [blog](https://blogs.sap.com/2020/07/17/principal-propagation-in-a-multi-cloud-solution-between-microsoft-azure-and-sap-cloud-platform-scp/). Steps 8-15 and 37-41 in the blog are relevant here.

Configuring Authorizations in BTP
 1. Head to your subaccount and select `Roles` underneath `Security`
 2. Search for the `Viewer` role template, select it and click `Create Role`
 3. Enter `ViewerAAD` as the new role name and click `Next`
 4. Continue with the configuration of the role attributes
 5. Enter the following source attribute mappings:
    - **country:** http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country
    - **emailaddress:** http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
    - **givenname:** http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname
    - **name:** http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
    - **surname:** http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname
 6. Click `Next`
 7. Skip past entering a `Role Collection` for now - click `Next`, then press `Finish`
 8. Now select `Role Collections` under `Security` and click on `New Role Collection`
 9. Enter any name for the `Role Collection` and press `Save`
 10. Select the new `Role Collection`
 11. Click on `Edit` and select the newly created Role `ViewerAAD` from the `service` application list and make sure to confirm the changes made
 12. Click `Save`  

Configuring Trust Setup in BTP
 1. Navigate back to the subaccount level
 2. Click on `Trust Configuration` underneath `Security` on the left hand panel
 3. Select `SAML Metadata` to export your service provider's SAML data for the account - this will be uploaded to Azure durring the `Setting up SSO` steps
 
You may want to look up the XSUAA instance tied to the application at this time, as settings tied to the service will be needed later to configure OAuth. To do so, navigate to the space level. Under `Services - Instances` select the XSUAA service, it is labeled `ms-teams-us10-xsuaa` by default configuration.

This last section must be done after configuring the trust in Azure and downloading the SAML certificate from the enterprise application.

Finishing Trust Setup Configuration
 1. Navigate to the subaccount level and select `Trust Configuration` underneath `Security`
 2. Click `New Trust Configuration` 
 3. Upload the metadata file that was downloaded from the configuration of SSO in the enterprise application in Azure 
 4. Enter a name for the new trust and make sure to uncheck `Available for User Logon`
 5. Click `Save`
 6. Go back to `Role Collections` and then search for and click on the role collection labeled `Application User`
 7. Select the `Users(0)` tab and click `Edit`
 8. Enter the e-mail address of the user in the Azure AD tenant under the `ID` and `E-Mail` entry fields
 9. Now, select the recently created Identity Provider (that is connected to the Azure AD tenant) from the IdP dropdown
 10. Add the user by pressing the `+` button and then click `Save`

The trust configuration for principal propagation in BTP has now been completed.

## Azure

### Minimal Variation

This is identical to the steps below, except you can skip step 12 from `Setting up SSO`.  

### Complex Variation

The setup of the trust for principal propagation on Azure, must be done manually. The steps for doing this will be covered below, but they are adapted from this [blog](https://blogs.sap.com/2020/07/17/principal-propagation-in-a-multi-cloud-solution-between-microsoft-azure-and-sap-cloud-platform-scp/). Steps 24-33 in the blog refer to Azure Registrations and Configurations, which are relevant to the setup explained below.

Creating an Enterpise Application in Azure:
 1. Navigate to Azure Active Directory
 2. Select `Enterprise Applications` under `Manage` from the left hand panel
 3. Click on `New Application`
 4. Enter `SAP Cloud Platform` into the search box and select it from the list of apps that appear
 5. Enter a name for the application and press `Create` 

Setting up SSO:
 1. From the created enterprise application's overview page, select `Single sign-on` under `Manage` from the panel on the left hand side
 2. Select `SAML` from the single sign-on methods
 3. Click on `Upload metadata file`
 4. Select the metadata file downloaded from the BTP section
 5. For the sign on url, enter the value from the url field of the XSUAA service instance (named `ms-teams-us10-xsuaa` by default) binding created in the automation process
 6. Click `Save`
 7. Now change the Reply URL by replacing `saml/SSO` to `oauth/token`
 8. Next click on the pencil symbol under `Attributes & Claims`
 9. Select the Unique User Identifier (Name ID) and edit the `Source` field to `user.mail`
 10. Click `Save`
 11. Then click `Add new claim` and enter country in the `Name` field
 12. Set the `Namespace` field to `http://schemas.xmlsoap.org/ws/2005/05/identity/claims`
 13. Click `Save`
 14. Scroll down to the 3rd box labeled `SAML Certificates` and click `Download` link for the `Federation Metadata XML`
 15. Use this saved file for setup of the trust relationship in BTP

Configuring Azure Deployment Script:
 1. Copy the `objectId` the enterprise application that was just created
 2. Paste this value as the value for the variable called `$sapPlatformObjId`

The trust configuration for principal propagation in Azure has now been completed.

## Application Deployment

There are no manual steps required for deploying your application into BTP. This process is entirely handled within the Docker container, specifically during the configuration of the container and by running the `./BTPSA` script. 

## Destinations

This section will go over the minimal setup for a destination in relation to principal propagation with an S/4 on-prem system.

### Minimal Variation

1. Navigate to the BTP subaccount level
2. Under `Connectivity` on the left hand panel, select `Cloud Connector`
3. Make sure that the Cloud Connector instance is the same from the one created from the principal propagation with an S/4 on-prem system section
4. Go back to `Connectivity` on the left hand panel and select `Destinations` instead
5. Press on `New Destination`
6. Enter the following information for your new destiation:
```
Name = <string>; of your choice
Type = HTTP
URL = http://<virtual-host>:<virtual -port>; this was created in the principal propagation with an S/4 on-prem system section
Proxy Type = OnPremise
Authentication = PrincipalPropagation

Additional Properties
sap-client = 100
sap-platform = ABAP
sap-sysid = S4H
```
7. Click `Save`
8. Ensure that the connection to the destination worked by selecting `Check Connection` or the icon to the left of the trash can (it looks like a little graph)

## Integration Suite

Here are some potentially useful integration suite resource:
 - [Quick On-Boarding Guide](https://blogs.sap.com/2016/04/18/quick-on-boarding-guide-for-sap-hana-cloud-integration/)
 - [Troubleshooting Guide](https://blogs.sap.com/2019/06/05/sap-cloud-platform-integration-troubleshooting-guide-available/)
 - [Knowledge Based Articles](https://blogs.sap.com/2017/04/24/cloud-integration-knowledge-base-articles-and-how-to-guides/)

## Event Mesh

This [guide](https://developers.sap.com/tutorials/cp-enterprisemessaging-instance-create.html) is a great start for configuring event mesh.