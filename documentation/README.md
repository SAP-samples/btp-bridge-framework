# What is Bridge Framework
Bridge Framework is an integration framework deployed on SAP BTP that allows developers to quickly customize and deploy apps that bring the powerful business logic of SAP products to the convenience of Microsoft Teams.

# Architecture
![Architecture](solution-architecture.png)

# How to set up
- Create an XSUAA service instance
  - Edit [./xs-security.json](../xs-security.json) with <BACKEND_URL>
  - Login to your BTP subaccount with <CF_ENDPOINT>
    - <CF_ENDPOINT> is on SAP BTP Cockpit > your subaccount > Overview > Cloud Foundry Environment > API Endpoint
  - Create the XSUAA service instance with <XSUAA_SERVICE_NAME>
```shell
cf login -a <CF_ENDPOINT>
cf create-service xsuaa application <XSUAA_SERVICE_NAME> -c ./xs-security.json
```
- Create an XSUAA role
  - Go to SAP BTP Cockpit
  - Go to your subaccount
  - Go to Security > Roles
  - Find "service" > "Viewer" > then click "Create Role"
    - Role template "Viewer" was defined by xs-security.json above
  - Enter a new role name "ViewerAAD"
  - Configure attributes like below
    - country: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country
    - emailaddress: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
    - givenname: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname
    - name: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
    - surname: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname
  - Finish the role creation
  - Go to Security > Role Collections
  - Click "New Role Collection"
  - Enter a new role collection name "Application User"
  - Click "Save" button
  - Select "Application User" then click "Edit"
  - Add the role "ViewerAAD" then click "Save"
- See the XSUAA credentials
  - Go to Services > Instances and Subscriptions
  - Click <XSUAA_SERVICE_NAME>
  - Click "View Credentials"
  - Save the properties
    - "clientid" as <XSUAA_CLIENT_ID>
    - "clientsecret" as <XSUAA_CLIENT_SECRET>
    - "url" as <SAML_RESOURCE_URL>
- Configure Azure Active Directory(AD)
  - Go to Azure Portal
  - Go to Azure Active Directory
  - Go to App registrations
  - Click "New registraion"
    - Name as "BridgeBot"
    - Click "Register"
  - Go to Overview
    - Copy the value of Application (client) ID as <MICROSOFT_APP_ID>
  - Go to Manage > Authentication
    - Check "Implicit grant > Access tokens"
    - Click "Save"
  - Go to Manage > Certificates & secrets
    - Click "+ New client secret"
    - Enter Description and Expires as you want
    - Click "Add"
    - Copy the value as <MICROSOFT_APP_PASSWORD>
  - Go to Manage > Expose an API
    - Click "+ Add scope"
      - Scope name as "scp.access"
      - Who can consent? as "Admin and users"
      - Enter Admin consent deplay name and Admin consent description and others as you want
      - Click "Add scope"
  - Go to Azure Active Directory
  - Go to Enterprise applications
  - Click "+ New application"
    - Search "SAP Cloud Platform"
      - SAP Cloud Platform is the old name of SCP Business Technology Platform
    - Name as "SAP Cloud Platform Bridge"
    - Click "Create"
  - Go to Manage > Single sign-on
    - Click Getting Started > 2. Set up single sign on
    - Click SAML as a single sign-on method
    - Click "Upload metadata file"
      - Go to SAP BTP Cockpit > your subaccount
      - Go to Security > Trust Configuration
      - Click "SAML Metadata" and download the metadata
      - Upload the metadata to Azure
    - Modify some fields
      - Sign on URL as <SAML_RESOURCE_URL>
      - Replace "saml/SSO" with "oauth/token" in Reply URL
    - Click "Save"
    - Click the pencil icon(modify) on 2. User Attributes & Claims
      - Change the Unique User Identifier (Name ID) as "user.mail"
      - Click "+ Add new claim"
        - Namespace as "http://schemas.xmlsoap.org/ws/2005/05/identity/claims"
        - Source attribute as "user.country"
        - Click "Save"
    - Go back to Setup Single Sign-On with SAML
      - Go to 3. SAML Signing Certificate > Federation Metadata XML
      - Click "Download" and save as "SAP Cloud Platform Bridge.xml"
        - If there is no "Download", refresh the page
  - Go to Azure Active Directory
  - Go to App registrations
  - Change the tab to "All applications"
  - Click "SAP Cloud Platform Bridge"
    - Go to Manage > Expose an API
    - Click "+ Add a client application"
      - Enter <MICROSOFT_APP_ID>
      - Check for the Authorized scopes
- Configure trust relationship to Azure AD in BTP
  - Go to SAP BTP Cockpit > your subaccount
  - Go to Security > Trust Configuration
  - Click "New Trust Configuration"
    - Upload "SAP Cloud Platform Bridge.xml" that is downloaded from Azure
    - Click "Parse"
    - Enter the nams as "Azure AD IDP"
    - Uncheck "Available for User Logon"
    - Click "Save"
  - Go to Security > Role Collections
    - Search "Application User" and click it
    - Go to the "Users" tab
    - Click "Edit"
    - Enter the user
      - ID and E-Mail as your Azure AD account
      - Identity Provider as "Azure AD IDP"
      - Click "+" to add
      - Click "Save"
- SAP S/4HANA Principal propagation setup
  - [Principal propagation setup with SAP S/4HANA on-premise system and SAP Business Technology Platform](https://blogs.sap.com/2020/12/23/principal-propagation-setup-with-sap-s-4hana-on-premise-system-and-sap-cloud-platform/)
- Update the config environment files and deploy to BTP
  - Update "manifest.yaml"
  - [Optional] Run index-and-push.sh to generate the index file automatically
- Update the frontend environment files and deploy to BTP
  - Update ".env" and "manifest.yaml"
  - Run build-and-push.sh for the Production environment
- Update the backend environment files, create services, and deploy to BTP
  - Update ".env" and "manifest.yml"
```shell
npm install
npm start
cf create-service destination lite <DESTINATION_SERVICE_NAME>
cf create-service connectivity lite <CONNECTIVITY_SERVICE_NAME>
cf create-service application-logs lite <APP_LOGGER_SERVICE_NAME>
cf push
```
- Use Destination, SAP Integration Suite, or SAP Graph
  - Use SAP S/4HANA Cloud or S/4HANA On-premise
    - [Setting up Communication Management in SAP S/4HANA Cloud](https://blogs.sap.com/2017/11/09/setting-up-communication-management-in-sap-s4hana-cloud/)
  - [Optional] Configure Destination
    - [Setting up Principal Propagation](https://blogs.sap.com/2021/09/06/setting-up-principal-propagation/)
  - [Optional] Configure SAP Integration Suite
    - [Principal Propagation in SAP Integration Suite](https://blogs.sap.com/2022/04/20/principal-propagation-in-sap-integration-suite/)
  - [Optional] Configure SAP Graph
    - [SAP Graph](https://navigator.graph.sap/)
    - Install SAP Graph Toolkit https://www.npmjs.com/package/@sap/graph-toolkit
```shell
graphctl login -f sap-graph-creds.json
graphctl list config
graphctl generate config -f sap-graph-config.json (generate from Destinations)
graphctl activate config -f sap-graph-config.json
graphctl list config # Keep refreshing until status changed from OFFLINE to AVAILABLE
graphctl get config v1
graphctl get access-token
# graphctl delete config
graphctl logout
```
- Update the Teams app package and test the app
  - Update "manifest.json"
  - Run compress-app.sh
  - Upload teams-app.zip

# References
- Principal propagation in a multi-cloud solution between Microsoft Azure and SAP Business Technology Platform (BTP) by Martin Raepple
  - [Part I: Building the foundation](https://blogs.sap.com/2020/07/17/principal-propagation-in-a-multi-cloud-solution-between-microsoft-azure-and-sap-cloud-platform-scp/)
  - [Part II: Connecting the system on-premise](https://blogs.sap.com/2020/10/01/principal-propagation-in-a-multi-cloud-solution-between-microsoft-azure-and-sap-cloud-platform-scp-part-ii/)
- [Create Supplier Collaboration by Extending SAP S/4HANA into Microsoft Azure Ecosystem](https://github.com/SAP-samples/btp-msteams-s4-suppliercollab)
  - [Tutorial](https://github.com/SAP-samples/btp-msteams-s4-suppliercollab/tree/main/tutorial)
- [Extend your SAP S/4HANA Business Scenarios into Microsoft Azure Ecosystem](https://github.com/SAP-samples/btp-msteams-extend-workflow)
  - [Tutorial](https://github.com/SAP-samples/btp-msteams-extend-workflow/tree/main/tutorial)