export const getData = async (url, authToken) => {
  const headers = { "Content-Type": "application/json" };
  if (authToken) {
    headers.teams_auth_token = authToken;
  }

  const requestOptions = {
    method: "GET",
    headers: headers
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    console.log("Error: ", response.statusText);
  } else {
    const data = await response.json();
    return data;
  }
};
