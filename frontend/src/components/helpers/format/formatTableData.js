import * as helper from "..";
export const formatTableData = (data, headerItems, tableObject) => {
    const tableDatas = [];
    for (let i = 0; i < data[0].values.d.results.length; i++) {
      const items = [];
      const tableData = {};
      // searchparam lowercase to follow convention for custom attributes in DOM
      let searchparam = "";
      for (let j = 0; j < headerItems.length; j++) {
        if (headerItems[j].key in data[0].values.d.results[i]) {
          let rowData = {};
          let headerItemsKey = headerItems[j].key;
          rowData["key"] = (i + 1).toString() + "-" + (j + 1).toString();
          let contentValue =
            data[0].values.d.results[i][headerItemsKey].toString();
          if (helper.isDate(contentValue)) {
            rowData["content"] = helper.formatDate(contentValue);
          } else {
            rowData["content"] = data[0].values.d.results[i][headerItemsKey];
          }
          if (
            tableObject in data[0].values.d.results[i]
          ) {
            searchparam = data[0].values.d.results[i][tableObject];
          }
          items.push(rowData);
        }
      }
      tableData["key"] = i + 1;
      tableData.items = items;
      tableData.searchparam = searchparam;
      tableDatas.push(tableData);
    }

    return tableDatas;
  };