const core = require('@sap-cloud-sdk/core');
const ResponseFormatter = require("../helpers/responseFormatter");

class Destination {
  searchObject(businessObject, query, interfaceMapping, accessToken) {
    return new Promise((resolve, reject) => {
      const objectMapping = interfaceMapping[businessObject];

      const url = objectMapping.url;
      const params = ResponseFormatter.toParams(query, objectMapping.searchFields);
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) { destination['jwt'] = accessToken; }

      core.executeHttpRequest(
        destination,
        { method: 'GET', url: `${url}?${params}` }
      ).then((response) => {
        resolve(response.data.d.results);
      }).catch((error) => {
        console.log('searchObject error', error);
        reject(error);
      });
    });
  }

  searchObjectItems(businessObject, id, businessObjectItem, query, interfaceMapping, accessToken) {
    return new Promise((resolve, reject) => {
      const objectMapping = interfaceMapping[businessObject];
      const objectItemMapping = interfaceMapping[businessObjectItem];

      const url = `${objectMapping.url}('${id}')/${objectItemMapping.suffix}`;
      const params = ResponseFormatter.toParams(query, objectMapping.searchFields);
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) { destination['jwt'] = accessToken; }

      core.executeHttpRequest(
        destination,
        { method: 'GET', url: `${url}?${params}` }
      ).then((response) => {
        resolve(response.data.d.results);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getObject(businessObject, id, interfaceMapping, accessToken){
    return new Promise( (resolve, reject) => {
      const objectMapping = interfaceMapping[businessObject];

      const url = `${objectMapping.url}('${id}')`;
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) { destination['jwt'] = accessToken; }

      core.executeHttpRequest(
        destination,
        { method: 'GET', url: url }
      ).then((response) => {
        resolve(response.data.d);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getObjectItem(businessObject, id, businessObjectItem, itemId, interfaceMapping, accessToken){
    return new Promise( (resolve, reject) => {
      const objectMapping = interfaceMapping[businessObject];
      const objectItemMapping = interfaceMapping[businessObjectItem];

      const url = `${objectItemMapping.url}(${businessObject}='${id}',${businessObjectItem}='${itemId}')`;
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) { destination['jwt'] = accessToken; }

      core.executeHttpRequest(
        destination,
        { method: 'GET', url: url }
      ).then((response) => {
        resolve(response.data.d);
      }).catch((error) => {
        console.log('getObjectItem error', error);
        reject(error);
      });
    })
  }

  updateObject(businessObject, id, interfaceMapping, body, accessToken){
    return new Promise( (resolve, reject) =>{
      const objectMapping = interfaceMapping[businessObject];

      const url = `${objectMapping.url}('${id}')`;
      const destination = { destinationName: objectMapping.destinationName };
      if (objectMapping.accessToken) { destination['jwt'] = accessToken; }

      core.executeHttpRequest(
        destination,
        { method: 'PATCH', url: url, data: body },
        { fetchCsrfToken: true }
      ).then((response) => {
        resolve(response);
      }).catch((error) => {
        console.log('updateObject error', error);
        reject(error);
      });
    });
  }
}
module.exports = new Destination();