# Bridge Framework for SAP S/4HANA and Microsoft Teams

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/btp-bridge-framework)](https://api.reuse.software/info/github.com/SAP-samples/btp-bridge-framework)

![Bridge Framework Image](./documentation/bridge-framework-main.png)

## Description
The Bridge Framework is an integration framework deployed on SAP BTP that allows developers to quickly customize and deploy apps that bring the powerful business logic of SAP products to the convenience of Microsoft Teams.

The Bridge Framework supports integrating with SAP systems through BTP services that developers may already be familiar with: SAP Integration Suite, SAP Graph, and destination service. Simple object mapping configurations within the framework provide developers with the ability to access business objects through any of the supported services. The framework does not enforce limits on which services to use for which use case, so developers are free to decide which API works best for them based on their business needs. Furthermore, the Bridge Framework provides an out-of-the-box UI that is intuitive and easy to configure, all while adhering to the design and styling of Microsoft Teams.

## Benefits of Bridge Framework
- **Leverage SAP BTP**: Ensure consistency across integrations and leverage the robout integration capabilities of SAP BTP services without a steep learning curve.
- **Ready to Deploy**: Comes packaged with business content and step-by-step guides to drive accelerated deployments.
- **Curated UI Components**: Take advantage of pre-built UI components that integrate seamlessly with Teams.
  Easily use Adaptive Cards, Task Modules, and Notifications.
- **Secure Connections**: Handles principal propagation where supported, encourages use of secure services, such as Destination service, to store credentials.
- **Simple Configurations**: Change content, layout, and functionality on the fly using simple configuration files hosted on SAP BTP.
- **Azure and SAP BTP Automation**: Automates error-prone configuration steps in Azure and SAP BTP using PowerShell and SAP BTP Setup Automator.

## Getting Started

Get your start with the Bridge Framework by checking out our step-by-step guides.

1. [Prerequisites for getting started](./documentation/manual-setup/prerequisites.md)
2. [Automated Setup Guide](./documentation/automation/Automation%20Overview.md)
3. [Bridge Application JSON Configuration](documentation/config/Bridge%20Application%20JSON%20Configuration.md): change the layout and content of your app on the fly.

Optional:

- [Transcript](documentation/manual-setup/transcript/Transcript%20Set%20Up.md): configure automatic transcript fetching and summarization for meetings.
- [Manual Setup Guide](./documentation/manual-setup/manual-setup.md)

## Key Features Added in V2

| Feature                    | Description                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Automated set-up           | Automates the configuration and deployment of apps and services on both SAP BTP and Azure                      |
| SuccessFactors support     | Added support for integrating with a SuccessFactors target system via Destination Service or Integration Suite |
| Objects with multiple keys | Business objects accessed by specifying multiple keys can now be displayed                                     |
| New object page components | Images, buttons, and forms can now be added to object pages                                                    |
| Property Grid enhancements | Property grids for business objects can now include dropdowns, text areas, images, and hidden fields           |
| Page context for actions   | Links and buttons can now be tied to user input or page context for more flexible use cases                    |
| Table styling improvements | Tables are now scrollable, can display images, and include more options for changing the styling of rows       |
| Transcript summarization   | Automatic transcript summarization for scheduled meetings can be enabled                                       |

## Known Issues
No known issues.

## How to obtain support
[Create an issue](https://github.com/SAP-samples/btp-bridge-framework/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing
If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the SAP Sample Code License Agreement v1.0 except as noted otherwise in the [LICENSE](LICENSE) file.
