# Configuration File Examples

Steps involved in configuring each application of Bridge Framework:

- [Config Server Example](#config-server-example).
- [Frontend Application Example](#frontend-application-example)
- [Backend Application Example](#backend-application-example).

**For more information on Bridge Framework configuration files, click [here](./Bridge%20Application%20JSON%20Configuration.md).**
&nbsp;

## Config Server Example

Add your **backend** configuration in `/config/public/backend/objectMappingConfig.json`

   **Syntax:**

   ```
   {
       “System”: {
           “Interface”: {
               “BusinessObject”: {
                   .
                   .
                   .
               }
           }
       }
   }
   ```

   &nbsp;
   **Possible values:**

   - _System:_ `S4HanaOnPrem`, `S4HanaCloud`, `SuccessFactors`
   - _Interface:_ `Destination`, `IntegrationSuite`, `Graph`
   - _BusinessObject:_ Your business object name.

   &nbsp;&nbsp;
   **Example:** Backend Configuration to get Purchase Orders from S/4Hana on-premise system:

   ```
    {
        "S4HanaOnPrem": {
            "Destination": {
                "PurchaseOrder": {
                    "url": "/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrder",
                    "searchFields": ["PurchaseOrder", "CompanyCode", "Supplier"],
                    "updateFields": [
                    "PurchasingGroup",
                    "PurchasingOrganization",
                    "PurchasingProcessingStatus",
                    "AddressName",
                    "AddressPhoneNumber"
                    ],
                    "destinationName": "s4hanaonprem-destination",
                    "actionUrl": "",
                    "accessToken": true
                },
                "PurchaseOrderItem": {
                    "url": "/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrderItem",
                    "suffix": "to_PurchaseOrderItem",
                    "searchFields": ["PurchaseOrderItem"]
                }
            }
        }
   }

   ```

Add your **frontend** configurations in `/config/public/frontend/landingPageConfig.json` and `/config/public/frontend/simpleConfig/S4HanaOnPrem/Destination`:

   **a. Landing Page:**

   _Syntax:_

   ```
   {
       id: “landingPageConfig”,
       path: “/”,
       “solutions”: [
           {
               “key”: int,			// Unique key
               “header”: str,			// Tile header
               “description”: str,		// Tile description
               “path”: str,			// relative path to Table Page
           }
       ]
   }

   ```

   &nbsp;
   **Example:** Landing page Configuration to create Purchase Order tile on landing page.

   ```
    {
       "id": "landingPageConfig",
       "path": "/",
       "solutions": [
           {
           "key": 1,
           "header": "Purchase Orders",
           "description": "Find your PO's here",
           "path": "/S4HanaOnPrem/Destination/PurchaseOrderTable"
           }
       ]
    }
   ```

   **b. Table page:**

   _Syntax:_

   ```
   {
       "type": "Table",
       "system": "SystemName",
       "interface": "InterfaceName",
       "businessObject": "BusinessObjectName",
       .
       .
       <OptionalProperties>
       .
       .,
       "columns": [
           {
           "content": str 				// Property Name,
           "key": str					// PropertyKey
           },
           .
           .
       ]
   }
   ```

   &nbsp;
   **Example:** Configuration for table page.

   ```
        {
            "pageType": "Table",
            "title": "Purchase Orders",
            "system": "S4HanaOnPrem",
            "interface": "Destination",
            "businessObject": "PurchaseOrder",
            "components": [
                {
                "type": "Table",
                "system": "S4HanaOnPrem",
                "interface": "Destination",
                "businessObject": "PurchaseOrder",
                "searchable": true,
                "interactive": true,
                "maxItems": 10,
                "columns": [
                    {
                    "content": "PO Number",
                    "key": "PurchaseOrder"
                    },
                    {
                    "content": "Company Code",
                    "key": "CompanyCode"
                    },
                    {
                    "content": "Purchase Order Date",
                    "key": "PurchaseOrderDate"
                    },
                    {
                    "content": "Supplier",
                    "key": "Supplier"
                    }
                ]
                }
            ]
        }
   ```

   **c. Object page:**

   _Syntax:_

   ```
        {
            "type": "Object",
            "system": "SystemName",
            "interface": "InterfaceName",
            "businessObject": "BusinessObjectName",
            "title" "Page title",
            .
            .
            <OptionalProperties>
            .
            .,
            "components": [
                {
                    "type": "PropertyGrid",
                    "properties": [
                        {
                        "content": str,
                        "key": str
                        },
                        .
                        .
                    ]
                },
                {
                    "type": "Table",
                    "system": "SystemName",
                    "interface": "InterfaceName",
                    "businessObject": "BusinessObjectName/BusinessObjectItemName",
                    .
                    .
                    <OptionalProperties>
                    .
                    .,
                    "columns": [
                        {
                        "content": str 				// Property Name,
                        "key": str					// PropertyKey
                        },
                        .
                        .
                    ]
                },
            ]

        }
   ```

   &nbsp;
   **Example:** Configuration for ObjectPage.

   ```
        {
            "pageType": "Object",
            "system": "S4HanaOnPrem",
            "interface": "Destination",
            "businessObject": "PurchaseOrder",
            "CreationDate": "CreationDate",
            "LastChangeDateTime": "LastChangeDateTime",
            "PurchasingProcessingStatus": "PurchasingProcessingStatus",
            "title": "Purchase Order",
            "components": [
                {
                    "type": "PropertyGrid",
                    "properties": [
                        {
                        "content": "Purchase Order ID",
                        "key": "PurchaseOrder"
                        },
                        {
                        "content": "Purchase Order Type",
                        "key": "PurchaseOrderType"
                        },
                        {
                        "content": "Purchasing Processing Status",
                        "key": "PurchasingProcessingStatus"
                        },
                        {
                        "content": "Created By User",
                        "key": "CreatedByUser"
                        },
                        {
                        "content": "Creation Date",
                        "key": "CreationDate"
                        },
                        {
                        "content": "Supplier",
                        "key": "Supplier"
                        },
                        {
                        "content": "Net Payment Days",
                        "key": "NetPaymentDays"
                        },
                        {
                        "content": "Purchasing Group",
                        "key": "PurchasingGroup",
                        "editable": true
                        },
                        {
                        "content": "Address Name",
                        "key": "AddressName",
                        "editable": true
                        },
                        {
                        "content": "Address Phone Number",
                        "key": "AddressPhoneNumber",
                        "editable": true
                        }
                    ]
                },
                {
                    "type": "Table",
                    "title": "Purchase Order Items",
                    "interactive": true,
                    "system": "S4HanaOnPrem",
                    "interface": "Destination",
                    "businessObject": "PurchaseOrder/PurchaseOrderItem",
                    "columns": [
                        {
                        "content": "Item Number",
                        "key": "PurchaseOrderItem"
                        },
                        {
                        "content": "Item Text",
                        "key": "PurchaseOrderItemText"
                        },
                        {
                        "content": "Currency",
                        "key": "DocumentCurrency"
                        },
                        {
                        "content": "Net Price Amount",
                        "key": "NetPriceAmount"
                        }
                    ]
                }
            ]
        }

   ```

&nbsp;

## Frontend Application Example

Update configuration server and backend URL in the `/frontend/.env` file.

   **Syntax:**

   ```
   REACT_APP_CONFIG_URL=https://<frontend-app-name> .cfapps.<subaccount-region>.hana.ondemand.com

   REACT_APP_BACKEND_URL=https://<backend-app-name>.cfapps. .<subaccount-region>.hana.ondemand.com/gateway
   ```

Note, the .env file for the frontend is automatically generated and uploaded by the automated setup tool!

&nbsp;

## Backend Application Example

Update the information in `/backend/.env` file.

   ```
       # MS BOT app credentials
       MicrosoftAppId=<microsoft-app-id>
       MicrosoftAppPassword=<microsoft-app-password>
       connectionName=<bot-oauth-connection-name>

       # MS AD tenant
       MicrosoftTenantId=<azure-tenant-id>

       # XSUAA
       xsuaaClientId=<xsuaa-client-id>
       xsuaaClientSecret=<xsuaa-client-secret>

       # SAP Integration flow
       iFlowUrl=<iflow-url>
       iFlowClientId=<iflow-client-id>
       iFlowClientSecret=<iflow-client-secret>

       # Graph
       graphClientId=<graph-client-id>
       graphClientSecret=<graph-client-secret>


       # Frontend
       frontendUrl=<frontend-url>
       frontendFallbackUrl=<frontend-fallback-url>

       # Auth
       samlScope=<saml-scope-url>
       samlResourceUrl=<saml-resource-url>
       samlAlias=<saml-alias>

       # Config server
       configServerUrl=<config-server-url>

       # Maximum records return limitation

       REACT_APP_SCROLL_PAGE_SIZE=<any-integer-smaller-than-500>

       # Cache TTL seconds
       cacheTTL=300

       # If true, generates a transcript summary after every meeting in which transcription is enabled
       TranscriptSummaryEnabled=true

       # User Id used to grant permissions for transcript access
       UserId=<USER_ID_FOUND_IN_AZURE_PORTAL>

       # Graph API endpoint
       GraphApiEndpoint=https://graph.microsoft.com/beta

       # Transcript Summary Model Endpoint, Can Replace with Model of Your Preference
       TranscriptSummaryModelEndpoint=<TRANSCRIPT_MODEL_ENDPOINT>

       # Transcript Summary Model Token
       TranscriptSummaryModelAPIKey=<API_KEY_FOR_QUERYING_YOUR_SUMMARY_MODEL>
   ```

Note, the .env file for the backend is automatically generated and uploaded by the automated setup tool!