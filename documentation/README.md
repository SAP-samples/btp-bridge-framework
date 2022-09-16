# What is Bridge Framework
Bridge Framework is an integration framework deployed on SAP BTP that allows developers to quickly customize and deploy apps that bring the powerful business logic of SAP products to the convenience of Microsoft Teams.

# Architecture
![Architecture](solution-architecture.png)

# How to set up
- Create an XSUAA service instance
  - Edit [./xs-security.json](../xs-security.json) with <BACKEND_URL>
  - Login to your BTP subaccount with <CF_ENDPOINT>
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
- Configure trust relationship to Azure AD in BTP
- Configure SAP Cloud Connector
- Configure trust and user mapping in SAP Gateway
- Configure SAP Gateway OData Service deployment
- Update the config environment files and deploy to BTP
  - [Optional] Run index-and-push.sh to generate the index file automatically
- Update the frontend environment files and deploy to BTP
  - Run build-and-push.sh for the Production environment
- Update the backend environment files and deploy to BTP
```
npm install
npm start
cf create-service destination lite <DESTINATION_SERVICE_NAME>
cf create-service connectivity lite <CONNECTIVITY_SERVICE_NAME>
cf push
```
- Configure Destination
- [Optional] Configure SAP Integration Suite and create integration flows
- [Optional] Configure SAP Graph
  - Install SAP Graph Toolkit https://www.npmjs.com/package/@sap/graph-toolkit
  * graphctl login -f sap-graph-creds.json
  * graphctl list config
  * graphctl generate config -f sap-graph-config.json (generate from Destinations)
  * graphctl activate config -f sap-graph-config.json
  * graphctl list config (status: OFFLINE to AVAILABLE)
  * graphctl get config v1
  * graphctl get access-token
  * graphctl delete config
  * graphctl logout
- Update the Teams app package and test the app