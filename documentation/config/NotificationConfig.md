# Notification configuration

Notification configuration file of the Bridge Framework allows you to configure the push notification for approval workflows. Using notification config, you can map the fields from the workflow event into an approval card that will be delivered to the approvers.

Syntax:

```
{
  "BusinessObject": "<business-object-name>",
  "fields": {
    "ReceiverEmailList": "<receiver-email-field>",
    "ObjectId": "<business-object-id-field>",
    "ActionId": "<workflow-id-field>",
    "Description": "<description-field>",
    "CreatedBy": "<created-by-field>",
    "Others": {<other-fields-to-map>} //Optional
  },
  "DetailScreenConfig": "<path-to-object-page-config-file>",
  "origSysManagementAppURL": "<backend-system-URL>"
}


```

- BusinessObject: (Required)
  Name of the business object involved in the workflow. Ex. PurchaseOrder

- fields: (Required)
  Mapping of the field names from workflow event into Bridge Framework's syntax.

  - ReceiverEmailList: (Required) Feild in the workflow event that contain the email of the user who shall receive the approval notification.

  - ObjectId: (Required) Field in the workflow event that contain the business object ID.

  - ActionId: (Required) Field in the workflow event that contain workflow ID. This field may be _optional_ in case of non-worflow based notifications.

  - Description: (Required) Field in the workflow event that contain the description of the workflow.

  - CreatedBy: (Required) Field in the workflow event that contain name of the workflow creator.

  - Others: (Optional) Optional dump of key-value pairs that contain additional information that needs to be added to the notification card. Only **string** values are supported.<br/>
    Ex. To add the field `Priority` into the notification card, add it to the `Others` object as below. <br/>
    Others: {"Priority": "PRIORITY"} -> The key `Priority` is a key that will be added to the notification card, and the value `PRIORITY` is the field in the workflow event that contain the priority information.

- DetailScreenConfig: (Required)
  Path to the buisiness object frontend page configuration.

- origSysManagementAppURL: (Required)
  URL of the backend SAP system. Ex: SAP S/4HANA purhcase order management portal URL.
