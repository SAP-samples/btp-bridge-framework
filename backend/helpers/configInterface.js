const axios = require("axios");

class ConfigInterface {
  getInterfaceMappingConfig(systemName, interfaceName, logger){
    return new Promise((resolve, reject) => {
      logger.info("Retrieving interface mapping for " + interfaceName + " in system: " + systemName);
      axios.get(process.env.objectMappingConfigUrl).then((response) => {
        logger.info("Interface mapping retrieved is: " + (JSON.stringify(response.data[systemName][interfaceName])));
        resolve(response.data[systemName][interfaceName]);
      }).catch((error) => {
        logger.error("Exception Happens On Retrieve IntefaceMapping For " + interfaceName + "in " + systemName + " error=" + error);
        reject(error);
      });
    })
  }
}

module.exports = new ConfigInterface();