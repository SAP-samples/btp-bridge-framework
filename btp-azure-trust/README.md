# Setup of the trust relationship to Azure AD in the BTP subaccount
* https://blogs.sap.com/2020/07/17/principal-propagation-in-a-multi-cloud-solution-between-microsoft-azure-and-sap-cloud-platform-scp/
* https://github.com/raepple/azure-scp-principal-propagation/blob/master/SCP/service/xs-security.json

```
cf create-service xsuaa application <XSUAA_SERVICE_NAME> -c ./xs-security.json
```