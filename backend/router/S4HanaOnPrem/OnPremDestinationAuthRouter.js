const Router = require("express");
const OnPremDestinationAuthRouter = Router();
const AuthManager = require("../../sap/authManager");

const getBtpAccessToken = function (req, res, next) {
  // const logger = req.logger;
  // logger.info("fetching BTP accessToken");
  AuthManager.getBtpXsuaaAccessTokenWithTeamsAuthToken(req.headers.teams_auth_token).then((accessToken) => {
    req.accessToken = accessToken;
    next();
  });
}
OnPremDestinationAuthRouter.use(getBtpAccessToken);
module.exports = OnPremDestinationAuthRouter;