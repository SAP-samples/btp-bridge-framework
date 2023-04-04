# Bridge Framework Deployment

Once your environment set-up has been completed in both SAP BTP and Azure, you're ready to start building and deploying your application. This guide will cover the following steps:

1. Deploy the configuration server
2. Deploy the frontend application
3. Deploy the backend application
4. Upload and install your app on Teams

## Step 1: Deploy the Configuration Server

Generally, many apps will follow a navigation flow familiar to SAP users:

Landing page -> Table page -> Object page
- Landing page: Displays cards (called solutions) that link to other pages in your application. You can think of this as a launchpad. 
- Table page: Displays a collection of business objects with information in columns. Each row can be clicked on to navigate to a detailed object view. You can think of this as a list report page. 
- Object page: Displays information specific to a particular instance of a business object. You can think of this as an object detail page. 

In this step we will configure the mappings and content needed to automatically generate the landing page, table pages, and object pages. 

Start in the framework's root directory. Navigate to the backend config file:

```
cd config/public/backend
```

Open `objectMappingConfig.json` with your editor of choice. The file is structured as follows:

```
{
   "System":{
      "Interface":{
         "BusinessObject":{
             .
             .
             .
         }
      }
   }
}
```

| Property       | Values                                    |
| -------------- | ----------------------------------------- |
| System         | S4HanaOnPrem, S4HanaCloud, SuccessFactors |
| Interface      | Destination, IntegrationSuite, Graph      |
| BusinessObject | Ex. PurchaseOrder, SalesOrder, User, etc. |

An example configuration of `objectMappingConfig.json`:

```
{
   "S4HanaOnPrem":{
      "Destination":{
         "PurchaseOrder":{
            "url":"/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrder",
            "searchFields":[
               "PurchaseOrder",
               "CompanyCode",
               "Supplier"
            ],
            "updateFields":[
               "PurchasingGroup",
               "PurchasingOrganization",
               "PurchasingProcessingStatus",
               "AddressName",
               "AddressPhoneNumber"
            ],
            "destinationName":"s4hanaonprem-destination",
            "actionUrl":"",
            "accessToken":true
         },
         "PurchaseOrderItem":{
            "url":"/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrderItem",
            "suffix":"to_PurchaseOrderItem",
            "searchFields":[
               "PurchaseOrderItem"
            ]
         }
      }
   }
}
```

Once `objectMappingConfig.json` has been configured you are now ready to configure the landing page for your app. Navigate:

```
cd ../frontend
```

Open `landingPageConfig.json` with your editor. The file is structured as follows:

```
{
   "id":"landingPageConfig",
   "path":"/",
   "solutions":[
      {
         "key":"int",
         "header":"str",
         "description":"str",
         "path":"str"
      }
   ]
}
```

| Property    | Values                                                                                |
| ----------- | ------------------------------------------------------------------------------------- |
| key         | Unique key for the page                                                               |
| header      | Title for the page                                                                    |
| description | Description displayed below the header                                                |
| path        | Unique path to page, structured as "/\<System>/\<Interface>/\<ObjectName>\<PageType>" |

An example configuration of `landingPageConfig.json`:
```
{
   "id":"landingPageConfig",
   "path":"/",
   "solutions":[
      {
         "key":1,
         "header":"Purchase Orders",
         "description":"Find your PO's here",
         "path":"/S4HanaOnPrem/Destination/PurchaseOrderTable"
      }
   ]
}
```

The card (solution) we just configured in the landing page will link to a Table Page. So let's configure the Table Page. Navigate:
```
cd simpleConfig
``` 
Then, navigate into the folders corresponding to the system and interface you want to use. In our case we'll use SAP S/4HANA and SAP Destination Service:
```
cd S4HanaOnPrem/Destination
```
Now, you can create a JSON file following this naming convention:
- Table page: \<BusinessObjectName>Table.json, for example `PurchaseOrderTable.json`

Open the JSON file we just created, a Table page follows this structure:
```
{
   "type":"Table",
   "system":"SystemName",
   "interface":"InterfaceName",
   "businessObject":"BusinessObjectName",
   "columns":[
      {
         "content":"str",
         "key":"str"
      }
   ]
}
```
An example configuration of `PurchaseOrderTable.json`:
```
{
   "pageType":"Table",
   "title":"Purchase Orders",
   "system":"S4HanaOnPrem",
   "interface":"Destination",
   "businessObject":"PurchaseOrder",
   "components":[
      {
         "type":"Table",
         "system":"S4HanaOnPrem",
         "interface":"Destination",
         "businessObject":"PurchaseOrder",
         "searchable":true,
         "interactive":true,
         "columns":[
            {
               "content":"PO Number",
               "key":"PurchaseOrder"
            },
            {
               "content":"Company Code",
               "key":"CompanyCode"
            },
            {
               "content":"Purchase Order Date",
               "key":"PurchaseOrderDate"
            },
            {
               "content":"Supplier",
               "key":"Supplier"
            }
         ]
      }
   ]
}
```
With our Table page configured, you can see that our table of Purchase Orders has a property `"interactive": true`. This property indicates that the rows of the table can be clicked and navigate to an object page with a detailed view of the selected business object.  

So, in the same directory as your Table page's JSON file, you can create another JSON file for your business object following this naming convention:
- Object page: \<BusinessObjectName>.json, for example `PurchaseOrder.json`

There are many different configuration options for object pages, but the structure of the JSON file is very similar to the Table page. Here is an example of `PurchaseOrder.json`:
```
{
   "pageType":"Object",
   "system":"S4HanaOnPrem",
   "interface":"Destination",
   "businessObject":"PurchaseOrder",
   "CreationDate":"CreationDate",
   "LastChangeDateTime":"LastChangeDateTime",
   "PurchasingProcessingStatus":"PurchasingProcessingStatus",
   "title":"Purchase Order",
   "components":[
      {
         "type":"PropertyGrid",
         "properties":[
            {
               "content":"Purchase Order ID",
               "key":"PurchaseOrder"
            },
            {
               "content":"Purchase Order Type",
               "key":"PurchaseOrderType"
            },
            {
               "content":"Purchasing Processing Status",
               "key":"PurchasingProcessingStatus"
            },
            {
               "content":"Created By User",
               "key":"CreatedByUser"
            },
            {
               "content":"Creation Date",
               "key":"CreationDate"
            },
            {
               "content":"Supplier",
               "key":"Supplier"
            },
            {
               "content":"Net Payment Days",
               "key":"NetPaymentDays"
            },
            {
               "content":"Purchasing Group",
               "key":"PurchasingGroup",
               "editable":true
            },
            {
               "content":"Address Name",
               "key":"AddressName",
               "editable":true
            },
            {
               "content":"Address Phone Number",
               "key":"AddressPhoneNumber",
               "editable":true
            }
         ]
      },
      {
         "type":"Table",
         "title":"Purchase Order Items",
         "interactive":true,
         "system":"S4HanaOnPrem",
         "interface":"Destination",
         "businessObject":"PurchaseOrder/PurchaseOrderItem",
         "columns":[
            {
               "content":"Item Number",
               "key":"PurchaseOrderItem"
            },
            {
               "content":"Item Text",
               "key":"PurchaseOrderItemText"
            },
            {
               "content":"Currency",
               "key":"DocumentCurrency"
            },
            {
               "content":"Net Price Amount",
               "key":"NetPriceAmount"
            }
         ]
      }
   ]
}
```
The object mappings, landing page, table page, and object page have all been configured. The configurations must now be deployed to a static server. 

Navigate back to the root directory of Bridge Framework and run the following commands:
```
cd config
cf login -a <YOUR_API_URL>
```
Once you have logged into cloud foundry you can run a shell script to index the files and push them to a static server:
```
./index-and-push.sh
```