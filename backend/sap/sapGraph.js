const axios = require("axios");

class SapGraph {
  searchObject(paramPathArray, query, interfaceMapping, accessToken){
    return new Promise( (resolve, reject) =>{
      let businessObject = paramPathArray[paramPathArray.length-1];
      let objectMapping = interfaceMapping[businessObject];

      //step 1: get the url
      let url;

      if(paramPathArray.length > 2){
        url = interfaceMapping[paramPathArray[0]].url + "/";
        // add all the keys of the parent obj to the path
        let parentIdArray = paramPathArray[1].split('+');
        parentIdArray.forEach((id) => {
          url += id + "/";
        })

        url += objectMapping.suffix;
      }
      else{
        url = objectMapping.url;
      }
      
      const httpConfig = {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          $top: query.top ? query.top : 50
        },
        // This is to override the default axios whitespace encoding of '+' which SAP Graph cannot consume.
        paramsSerializer: (params) => {
          let result = '';
          Object.keys(params).forEach(key => {
              result += `${key}=${encodeURIComponent(params[key])}&`;
          });
          return result.substring(0, result.length - 1);
        }
      };

      //step 2: construct the filters
      if (objectMapping.searchFields && query["filterValue"]) {
        const filters = [];
        objectMapping.searchFields.forEach( (field) => {
          field = field.trim();
          filters.push(`contains(` + field + `,'` + query["filterValue"] + `')`);
        });
        httpConfig.params["$filter"] = filters.join(" or ");
      }

      axios
        .get(url, httpConfig)
        .then((response) => {
          resolve(response.data.value);
        })
        .catch((error) => {
          reject(error.response.data);
        });

    });
  }


  getObject(paramPathArray, query, interfaceMapping, accessToken){
    return new Promise( (resolve, reject) => {
      let businessObject = paramPathArray[paramPathArray.length-2];
      let objectMapping = interfaceMapping[businessObject];
      //IMPORTANT: currently operating under assumption that 
      // (1) can only search up to the first level of dependent object
      //step 1: get the url
      let url;
      if(paramPathArray.length > 2){
        // append all the keys of the parent obj to the path
        url = interfaceMapping[paramPathArray[0]].url;
        let parentIdArray = paramPathArray[1].split('+');
        parentIdArray.forEach((id) => {
          url += '/' + id;
        })
        url+= '/' + objectMapping.suffix;
        // append all keys of the parent obj again
        parentIdArray.forEach((id) => {
          url += '/' + id;
        })
        // append all ids of the dep obj to the path
        paramPathArray[paramPathArray.length-1].split('+').forEach((id)=> {
          url += '/' + id;
        })
      }
      else{
        url = objectMapping.url;
        paramPathArray[paramPathArray.length-1].split('+').forEach((id)=> {
          url += '/' + id;
        })
      }

      const httpConfig = {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      };

      axios
        .get(url, httpConfig)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data);
        });

    })
  }

  updateObject(paramPathArray, query, interfaceMapping, body, accessToken, logger){
    return new Promise( (resolve, reject) =>{
      logger.info("started update object action");
      let businessObject = paramPathArray[paramPathArray.length-2];
      let objectMapping = interfaceMapping[businessObject];

      let url;
      if(paramPathArray.length > 2){
        // append all the keys of the parent obj to the path
        url = interfaceMapping[paramPathArray[0]].url;
        let parentIdArray = paramPathArray[1].split('+');
        parentIdArray.forEach((id) => {
          url += '/' + id;
        })
        url+= '/' + objectMapping.suffix;
        // append all keys of the parent obj again
        parentIdArray.forEach((id) => {
          url += '/' + id;
        })
        // append all ids of the dep obj to the path
        paramPathArray[paramPathArray.length-1].split('+').forEach((id)=> {
          url += '/' + id;
        })
      }
      else{
        url = objectMapping.url;
        paramPathArray[paramPathArray.length-1].split('+').forEach((id)=> {
          url += '/' + id;
        })
      }

      const httpConfig = {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "If-Match": "*"
        }
      };
      axios
        .patch(url,body, httpConfig)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
module.exports = new SapGraph();