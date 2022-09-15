# SAP Graph
* SAP Graph https://navigator.graph.sap/
* SAP API Hub https://api.sap.com/
  * API key: XjIoROHsfB7fTvNYPg1geqM1fZxy0Abd
* SAP Graph Community Topic https://community.sap.com/topics/graph
* SAP Graph Tutorial
  * Youtube Playlist https://www.youtube.com/playlist?list=PLkzo92owKnVy6eAKxRAhVC5Vp_AjsZ23U
  * Source Code https://github.com/saphanaacademy/SAPGraph
* Purchase Order
  * API https://api.sap.com/api/API_PURCHASEORDER_PROCESS_SRV/overview
  * Sandbox https://sandbox.api.sap.com/s4hanacloud/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV
  * Create a Destination
* BTP User Role: SAP_Graph_Key_User
* SAP Graph Toolkit https://www.npmjs.com/package/@sap/graph-toolkit
  * graphctl login -f sap-graph-creds-us10.json
  * graphctl list config
  * graphctl generate config -f sap-graph-config-us10.json (generate from Destinations)
  * graphctl activate config -f sap-graph-config-us10.json
  * graphctl list config (status: OFFLINE to AVAILABLE)
  * graphctl get config v1
  * graphctl get access-token
  * graphctl delete config
  * graphctl logout
* Postman
  * 