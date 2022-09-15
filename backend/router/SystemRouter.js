const Router = require("express");

const SystemRouter = Router();
const S4HanaCloudInterfaceRouter = require("./S4HanaCloud/S4HanaCloudInterfaceRouter");
const S4HanaOnPremInterfaceRouter = require("./S4HanaOnPrem/S4HanaOnPremInterfaceRouter");

SystemRouter.use("/S4HanaCloud", S4HanaCloudInterfaceRouter);
SystemRouter.use("/S4HanaOnPrem", S4HanaOnPremInterfaceRouter);

module.exports = SystemRouter;
