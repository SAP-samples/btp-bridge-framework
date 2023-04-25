# BTP Role Collections

If you are using a BTP trial account, please ignore the global account section. Additionally, you only need to verify that your trial subaccount has the following two roles from the second section: `Subaccount Administrator` and `Subaccount Service Administrator`.

## Global Account Roles

The role collection required at the global account level is called `Global Account Administrator`. It contains the following roles: `Global Account Admin`, `Global Account Usage Reporting Viewer`, `System Landscape Administrator`, and `User and Role Administrator`.

## Subaccount Roles

The following set of role collections should work at a subaccount level (with the roles listed underneath each role collection):
 - `Enterprise Messaging Administrator`
   - `ManageRole`
 - `Subaccount Administrator`
   - `Subaccount Admin`
   - `Cloud Connector Administrator`
   - `Destination Administrator`
   - `Subaccount Service Administrator`
   - `User and Role Administrator` 
 - `Subaccount Service Administrator`
   -  `Subaccount_Service_Admin`

However, if any problems occur during BTP service provisioning during the run time of the automated setup tool, you may need to add the following role collections:
 - `Cloud Connector Administrator`
   - `Cloud Connector Administrator`
 - `Connectivity and Destination Administrator`
   - `Cloud Connector Administrator`
   - `Destination Administrator` 
 - `Destination Administrator`
   - `Destination Administrator` 