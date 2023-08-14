# **Pre-requisites for getting started with Bridge Framework for Google Workspace**

- [Node.js and Npm](#install-nodejs-and-npm)
- [SAP BTP account](#sap-btp-account)
- [Access to a supported SAP system](#access-to-sap-system)
- [Custom event enablement](#custom-event-enablement)
- [Google Workspace Enterprise License](#google-workspace-enterprise-license)
- [Google cloud project](#google-cloud-project)
- [A code editor](#install-a-code-editor)

&nbsp;

## Continue to Google Cloud setup

[Go to Google Cloud setup](./gcp-setup.md)

&nbsp;

## Install Node.js and NPM

Download and install [Node.js](https://nodejs.org/en/download/) based on your operating system.

- You can check the Node.js installation using `node -v` command in your terminal.
- You can check the [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) version using `npm -v` command in your terminal.

&nbsp;

## SAP BTP Account

Follow this [tutorial](https://developers.sap.com/tutorials/hcp-create-trial-account.html) for setting up a BTP trial account. After successfully setting up your account, you should have a subaccount called `trial` with a Cloud Foundry space called `dev`.

&nbsp;

## Access to SAP system

Before you start, please ensure that you have access to an SAP S/4HANA on-premise instance.

&nbsp;

## Custom event enablement

A custom ABAP job to push workflow events from SAP S/4HANA to SAP Event mesh on BTP. For instructions on how to create this ABAP job, check this [document](https://github.com/SAP-samples/s4hana-microsoft-team-app-integration/tree/mission/Schedule%20SAP%20S4HANA%20ABAP%20Job).

&nbsp;

## Google Workspace Enterprise License

A [Google Workspace](https://workspace.google.com/features/) account with access to [Google Chat](https://workspace.google.com/products/chat/) is required to create an integration app using Bridge Framework.

&nbsp;

## Google Cloud project

Create a [Google Cloud project](https://developers.google.com/workspace/guides/create-project) or use an existing project from [GCP console](https://console.cloud.google.com).

&nbsp;

## Install a code editor

Download and install [Visual Studio Code](https://code.visualstudio.com/download) (recommended) depending upon your operating system.
