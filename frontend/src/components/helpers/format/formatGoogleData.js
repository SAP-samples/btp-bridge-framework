import * as helper from "..";

export const formatGoogleData = (data, headerItems, tableObject) => {
  let formattedData = [];
  for (let i = 0; i < data[0].values.d.results.length; i++) {
    // searchparam lowercase to follow convention for custom attributes in DOM
    let searchparam = "";
    let businessObject = {};
    for (let j = 0; j < headerItems.length; j++) {
      if (headerItems[j].key in data[0].values.d.results[i]) {
        businessObject = data[0].values.d.results[i];
        // console.log("bo", businessObject);
        let headerItemsKey = headerItems[j].key;
        let contentValue =
          data[0].values.d.results[i][headerItemsKey].toString();
        if (helper.isDate(contentValue)) {
          console.log("Date", headerItemsKey, businessObject[headerItemsKey]);

          businessObject[headerItemsKey] = helper.formatDate(contentValue);
        }
        if (tableObject in data[0].values.d.results[i]) {
          searchparam = data[0].values.d.results[i][tableObject];
        }
      }
    }
    formattedData.push(businessObject);
  }
  console.log("Formatted data", formattedData);
  return formattedData;
};
