# Bridge Framework Cloud Foundry Deployment

Once your environment set-up has been completed in both SAP BTP and Azure, you're ready to start building and deploying your application. This guide will cover the following steps:

1. [Deploy the Configuration Server](#step-1-deploy-the-configuration-server)
2. [Deploy the Frontend Application](#step-2-deploy-the-frontend-application)
3. [Deploy the Backend Application](#step-3-deploy-the-backend-application)

Note, for configuration for each of these steps, please refer to [this guide](../../config/simple-config-example.md). Additionally, before moving on to these steps, **please login to Cloud Foundry via the command line** using the following command: `cf login -a <api_url>`. Make sure to replace the `<api_url>` with your Cloud Foundry API Endpoint - this field can be found in the `Cloud Foundry Environment` section in your subaccount.

## Step 1: Deploy the Configuration Server

To deploy the configuration server, navigate to the config directory: `cd config` *(from root)*. Before deploy the configuration server, ensure that the `manifest.yaml` file in this directory is up to date.

On download, the manifest file will look like this:

```
---
applications:
  - name: <CONFIG_URL>
    memory: 64M
    disk_quota: 64M
    path: .
    buildpacks:
      - staticfile_buildpack
```

If you have no not done so already, replace `<CONFIG_URL>` with the desired name for the config server, something like `bridge-framework-config` is recommended.

Now to deploy the config server simply run the following command: `cf push`. On success, you should be able to navigate to your config server - which will look like `https://<config-server-name>.cfapps.<cf-api-region>.hana.ondemand.com` - and see your changes. They should also be reflected in the application.

## Step 2: Deploy the Frontend Application

Deploying the frontend application will have a similar approach. Navigate to your frontend folder: `cd frontend` *(from root)*. Check the `manifest.yaml` file in this directory is up to date.

The default manifest file will look very similar to the config's default manifest: 

```
---
applications:
- name: <FRONTEND_URL>
  memory: 64M
  disk_quota: 64M
  path: build
  buildpacks: 
  - staticfile_buildpack
```

Once again, if you haven't already, replace `<FRONTEND_URL>` with the desired name for the frontend application, something like `bridge-framework-frontend` is recommended.

Deployment is slightly different for the frontend application. To deploy the frontend application you will need to trigger the build-and-push script, via the following command: `./build-and-push.sh`. This will trigger an `npm run build` command for the frontend and then push the application to your BTP Cloud Foundry space. Note, if the script does not run because of a permissions issue, you may need to execute the following command: `chmod u+x ./build-and-push.sh`.

On success, you should be able to navigate to your frontend - which will look like `https://<frontend-application-name>.cfapps.<cf-api-region>.hana.ondemand.com`. This url will just display a loading circle. In a fully running Bridge setup, your changes should now be reflected in the application.

## Step 3: Deploy the Backend Application

Deploying the backend application is very similar to the process done for the frontend. Navigate to your backend folder: `cd backend` *(from root)*. Check the `manifest.yaml` file in this directory is up to date.

The default manifest file for the backend will look like this:

```
---
applications:
- name: <BACKEND_URL>
  memory: 256M
  disk_quota: 256M
  buildpack: nodejs_buildpack
  command: npm start
  services:
  - <DESTINATION_SERVICE_NAME>
  - <CONNECTIVITY_SERVICE_NAME>
  - <XSUAA_SERVICE_NAME>
  - <APP_LOGGER_SERVICE_NAME>
```

Yet again, if you haven't already, replace `<BACKEND_URL>` with the desired name for the frontend application, something like `bridge-framework-backend` is recommended.

The services listed in the manifest file are the names of BTP services that should have been configured during setup (these are handled for you in [automated setup](../../automation/Automation%20Overview.md) - reference to [manual setup guide](../../manual-setup/manual-setup.md)). Simply replace the names of the services here with the name of the corresponding BTP instances.

Example of updated services field:

```
services:
   - bridge-framework-destination
   - bridge-framework-connectivity
   - bridge-framework-xsuaa
   - bridge-framework-app-logger
```

To deploy the backend you will first need to make sure that you have installed all of the necessary packages via `npm install`. Then simply run `cf push`.

On success, you should be able to navigate to your backend - which will look like `https://<backend-application-name>.cfapps.<cf-api-region>.hana.ondemand.com`. This url will display the following message: `Bridge Framework Backend API for MS Teams port: {port_number}`. In a fully running Bridge setup, your changes should now be reflected in the application.
