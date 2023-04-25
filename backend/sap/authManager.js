const axios = require('axios');

class AuthManager {
  getBtpAccessTokenWithTeamsAuthToken(teamsAuthToken) {
    return this.getAzureAdAccessTokenForBtpSamlAssertion(teamsAuthToken)
      .then((azureAdAccessToken) => this.getSamlAssertionOnBehalfOfSapBtp(azureAdAccessToken))
      .then((samlAssertion) => this.getAccessTokenFromSapBtp(samlAssertion));
  }

  getBtpXsuaaAccessTokenWithTeamsAuthToken(teamsAuthToken) {
    return this.getAzureAdAccessTokenForBtpSamlAssertion(teamsAuthToken)
      .then((azureAdAccessToken) => this.getSamlAssertionOnBehalfOfSapBtp(azureAdAccessToken))
      .then((samlAssertion) => this.getAccessTokenFromSapBtpXsuaa(samlAssertion));
  }

  getGraphAccessTokenWithTeamsAuthToken(teamsAuthToken) {
    return this.getAzureAdAccessTokenForBtpSamlAssertion(teamsAuthToken)
      .then((azureAdAccessToken) => this.getSamlAssertionOnBehalfOfSapBtp(azureAdAccessToken))
      .then((samlAssertion) => this.getAccessTokenFromSapGraph(samlAssertion));
  }

  getAzureAdAccessTokenForBtpSamlAssertion(teamsAuthToken) {
    return new Promise((resolve, reject) => {
      const url = `https://login.microsoftonline.com/${process.env.MicrosoftTenantId}/oauth2/v2.0/token`;
      const params = new URLSearchParams({
          client_id: process.env.MicrosoftAppId,
          client_secret: process.env.MicrosoftAppPassword,
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: teamsAuthToken,
          requested_token_use: 'on_behalf_of',
          scope: process.env.samlScope
      });
      const httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      axios
        .post(url, params.toString(), httpConfig)
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log('getAzureAdAccessTokenForBtpSamlAssertion error', error);
          reject(error);
        });
    });
  }

  getSamlAssertionOnBehalfOfSapBtp(accessToken) {
    return new Promise((resolve, reject) => {
      const url = `https://login.microsoftonline.com/${process.env.MicrosoftTenantId}/oauth2/token`;
      const params = new URLSearchParams({
        client_id: process.env.MicrosoftAppId,
        client_secret: process.env.MicrosoftAppPassword,
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: accessToken,
        requested_token_use: 'on_behalf_of',
        requested_token_type: 'urn:ietf:params:oauth:token-type:saml2',
        resource: process.env.samlResourceUrl
      });
      const httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      axios
        .post(url, params.toString(), httpConfig)
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log('getSamlAssertionOnBehalfOfSapBtp', error);
          reject(error);
        });
    });
  }

  getAccessTokenFromSapBtp(samlAssertion) {
    return new Promise((resolve, reject) => {
      const url = `${process.env.samlResourceUrl}/oauth/token/alias/${process.env.samlAlias}`;
      const params = new URLSearchParams({
        assertion: samlAssertion,
        grant_type: 'urn:ietf:params:oauth:grant-type:saml2-bearer'
      });
      const httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: process.env.iFlowClientId,
          password: process.env.iFlowClientSecret
        }
      };

      axios
        .post(url, params.toString(), httpConfig)
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log('getAccessTokenFromSapBtp error', error);
          reject(error);
        });
    });
  }

  getAccessTokenFromSapBtpXsuaa(samlAssertion) {
    return new Promise((resolve, reject) => {
      const url = `${process.env.samlResourceUrl}/oauth/token/alias/${process.env.samlAlias}`;
      const params = new URLSearchParams({
        assertion: samlAssertion,
        grant_type: 'urn:ietf:params:oauth:grant-type:saml2-bearer'
      });
      const httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: process.env.xsuaaClientId,
          password: process.env.xsuaaClientSecret
        }
      };

      axios
        .post(url, params.toString(), httpConfig)
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log('getAccessTokenFromSapBtpXsuaa error', error);
          reject(error);
        });
    });
  }

  getAccessTokenFromSapGraph(samlAssertion) {
    return new Promise((resolve, reject) => {
      const url = `${process.env.samlResourceUrl}/oauth/token/alias/${process.env.samlAlias}`;
      const params = new URLSearchParams({
        assertion: samlAssertion,
        grant_type: 'urn:ietf:params:oauth:grant-type:saml2-bearer'
      });
      const httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: process.env.graphClientId,
          password: process.env.graphClientSecret
        }
      };

      axios
        .post(url, params.toString(), httpConfig)
        .then((response) => {
          resolve(response.data.access_token);
        })
        .catch((error) => {
          console.log('getAccessTokenFromSapGraph error', error);
          reject(error);
        });
    });
  }
}
module.exports = new AuthManager();