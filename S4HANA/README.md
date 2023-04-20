# Create Customize S/4 HANA Job For Sending PO - Approval Workflow Creation Event to SAP Event Mesh

This repository contains a code sample of the S/4 HANA background job and instructions for developing a customized job for sending Purchase Order - Approval WorkFlow Creation Event to SAP Event Mesh

## Scenario:

When business user creates a purchase order, which meets the conditions to trigger the purchase order approval workflow in the S/4 Hana on-premise system, this The customize job ZRP_SEND_PO_WF_DATA_TO_EM will gather the purchase order, pending approval workflow task, and the assigned approver data into one message, and send the message into the message queue in the SAP Event Mesh.

This job needs to be scheduled to trigger on 1 minute periodically in the S/4 Hana on-premise system, and the email of the business user must be the same one on the S/4 Hana on-premise, SAP Business Technology Platform, and Microsoft Teams app.

## Implementation : Development of S/4 HANA Job

Follow the below steps to develope the customize job on the S/4 Hana on-premise system, and schedule to trigger this job.

## [Step 1: Create ZRP_SEND_PO_WF_DATA_TO_EM Class & Method]

Please enter transaction code SE24 to open the class builder, and create ZRP_SEND_PO_WF_DATA_TO_EM class and its method shown on the below screenshot.
![Capture](https://github.wdf.sap.corp/storage/user/105079/files/ff972500-dcf0-11ec-9917-99934e492f8b)

Please find the source code of this class and its related types and methods in the folder https://github.wdf.sap.corp/SCE/Siemens/tree/master/S4HANA/Class

## [Step 2: Create ZRP_SEND_PO_WF_DATA_TO_EM Report]

Please enter transaction code SE38 to open the ABAP Editor, and create the ZRP_SEND_PO_WF_DATA_TO_EM report by clicking the Create button.
![Capture](https://github.wdf.sap.corp/storage/user/105079/files/77654f80-dcf1-11ec-9510-ceba3443378b)

Please find the source code of this ZRP_SEND_PO_WF_DATA_TO_EM report in the folder https://github.wdf.sap.corp/SCE/Siemens/tree/master/S4HANA/Report

## [Step 3: Schedule Trigger Of ZRP_SEND_PO_WF_DATA_TO_EM Report]

Please enter transaction code SM36 to enter the Define Job page, and then follow the below steps to set up the start condition for the job.

3.1 Enter your report name ( my case is ZRP_SEND_PO_WF_DATA_TO_EM ), and click the Save button after the pop-up screen shows up
![Capture](https://github.wdf.sap.corp/storage/user/105079/files/703f4100-dcf3-11ec-9f08-4c59845432a6)

3.2 Click Step Back Button
![Capture](https://github.wdf.sap.corp/storage/user/105079/files/9bc22b80-dcf3-11ec-8ae7-5912832a4f56)

3.3 Click the Start condition button on the menu bar, and then click Immediate and check the Periodic Job checkbox in the pop-up window
![Capture](https://github.wdf.sap.corp/storage/user/105079/files/0ecba200-dcf4-11ec-8e59-49d0bc7a23d0)

3.4 Click Period Values in the pop-up window and then select Other period in the Period Values pop up window
![Capture](https://github.wdf.sap.corp/storage/user/105079/files/64a04a00-dcf4-11ec-8152-c49a07cc5164)

3.5 Enter the 1 Minutes in the Explicit Period Value pop up window and click save on all three pop up windows
![Capture](https://github.wdf.sap.corp/storage/user/105079/files/bfd23c80-dcf4-11ec-9855-b0c169432311)

3.6 Click Save button on the Define Job main page on the right bottom cornor. If you are seeing the message on the left bottom corner, which says "Job saved with status: Released", then your job will be scheduled to trigger on 1-minute periodically successfully. 4.![Capture](https://github.wdf.sap.corp/storage/user/105079/files/53a40880-dcf5-11ec-9d9f-d58b095aacbf)
