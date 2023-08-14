export const getData = async (reqUrl, authToken, reqQuery) => {
  let headers = {
    "Content-Type": "application/json",
    integration_type: process.env.REACT_APP_INTEGRATION_TYPE,
  };
  if (authToken) {
    headers.teams_auth_token = authToken;
  }

  const requestOptions = {
    method: "GET",
    headers: headers,
  };

  let url = new URL(reqUrl);
  if (reqQuery) {
    Object.keys(reqQuery).forEach((key) => {
      url.searchParams.append(key, reqQuery[key]);
    });
  }

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    console.log("Error in getData: ", response.statusText);
  } else {
    const data = await response.json();
    return data;
  }
};
