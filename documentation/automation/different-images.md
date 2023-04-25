# Differences Between Default and Free Tier

There are a few differences between using BTP free tier account and a regular BTP account when it comes to deploying Bridge. Overall, the functionality of Bridge stays more or less the same, but please see the sections below for details on what is different.

**Note:** some free tier accounts do not have restrictions on service creation. This means that you would be able to run the full version of the automated setup tool with a BTP free tier account. However, this is not always the case, which is why the BTP free tier docker image exists for automated setup.

## Services Provisioned Differences

BTP free tier accounts may prevent the provisioning of certain resources. Therefore, to ensure that the docker image works for free tier, we have removed the creation and configuration of event mesh.

When running the automated tool with the call to `./btpsa`, very early on there will be a section that confirms what services will be created.

For free tier, the services being created will display in this list:

```
####################################################################################################
# Checking if all configured services & app subscriptions are available on your global account
####################################################################################################
[2023-04-24 18:01:56] INFO       : Get list of available services and app subsciptions for defined region >us10<
[2023-04-24 18:01:56] RUN COMMAND: btp --format json list accounts/entitlement --global-account <global_account>
[2023-04-24 18:01:58] SUCCESS    : service  >application-logs< with plan >lite< in region >us10< IS AVAILABLE
[2023-04-24 18:01:58] SUCCESS    : service  >xsuaa< with plan >application< in region >us10< IS AVAILABLE
[2023-04-24 18:01:58] SUCCESS    : service  >xsuaa< with plan >apiaccess< in region >us10< IS AVAILABLE
[2023-04-24 18:01:58] SUCCESS    : service  >destination< with plan >lite< in region >us10< IS AVAILABLE
[2023-04-24 18:01:58] SUCCESS    : service  >connectivity< with plan >lite< in region >us10< IS AVAILABLE
[2023-04-24 18:01:58] SUCCESS    : Use case supported in your global account!
```

For a regular BTP account, the list of services will look like this:

```
####################################################################################################
# Checking if all configured services & app subscriptions are available on your global account
####################################################################################################
[2023-04-24 18:01:56] INFO       : Get list of available services and app subsciptions for defined region >us10<
[2023-04-24 18:01:56] RUN COMMAND: btp --format json list accounts/entitlement --global-account <global_account>
[2023-04-24 18:01:58] SUCCESS    : service  >application-logs< with plan >lite< in region >us10< IS AVAILABLE
[2023-04-24 18:01:58] SUCCESS    : service  >xsuaa< with plan >application< in region >us10< IS AVAILABLE
[2023-04-24 18:01:58] SUCCESS    : service  >xsuaa< with plan >apiaccess< in region >us10< IS AVAILABLE
[2023-04-24 18:01:58] SUCCESS    : service  >destination< with plan >lite< in region >us10< IS AVAILABLE
[2023-04-24 18:01:58] SUCCESS    : service  >connectivity< with plan >lite< in region >us10< IS AVAILABLE
[2023-04-24 18:01:58] SUCCESS    : Use case supported in your global account!
[2023-04-24 08:30:15] SUCCESS    : service  >enterprise-messaging< with plan >dev< in region >us10< IS AVAILABLE
[2023-04-24 08:30:15] SUCCESS    : service  >enterprise-messaging-hub< with plan >standard< in region >us10< IS AVAILABLE
```

## Functionality Differences

The difference between the two versions of Bridge is the presence of the event mesh service. This service is responsible for notifications in Bridge, so users with a free tier BTP account will not have the notification functionality.