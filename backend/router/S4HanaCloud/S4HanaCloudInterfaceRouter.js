const Router = require("express");
const S4HanaCloudInterfaceRouter = Router();

const IntegrationSuiteAuthRouter = require("./IntegrationSuiteAuthRouter");
const IntegrationSuiteRouter = require("./IntegrationSuiteRouter");
const GraphAuthRouter = require("./GraphAuthRouter");
const GraphRouter = require("./GraphRouter");
const DestinationRouter = require("./DestinationRouter");
const ConfigInterface = require("../../helpers/configInterface");

const getInterfaceMappingConfig = function (req, res, next) {
  const params = req.baseUrl.split('/');
  const systemName = params[2];
  const interfaceName = params[3];
  ConfigInterface.getInterfaceMappingConfig(systemName, interfaceName, req.logger).then((interfaceMapping) => {
    req.interfaceMapping = interfaceMapping;
    next();
  });
}

S4HanaCloudInterfaceRouter.use("/IntegrationSuite", getInterfaceMappingConfig, IntegrationSuiteAuthRouter, IntegrationSuiteRouter);
S4HanaCloudInterfaceRouter.use("/Graph", getInterfaceMappingConfig, GraphAuthRouter, GraphRouter);
S4HanaCloudInterfaceRouter.use("/Destination", getInterfaceMappingConfig, DestinationRouter);

module.exports = S4HanaCloudInterfaceRouter;