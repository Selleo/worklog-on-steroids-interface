import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://worklog-on-steroids.herokuapp.com/api/ql",
  cache: new InMemoryCache(),
});

const ExternalApi = () => {
  const [message, setMessage] = useState("");

  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();

  const callApi = async () => {
    try {
      const response = await fetch(
        `https://worklog-on-steroids.herokuapp.com/api/public`
      );

      const responseData = await response.json();

      setMessage(responseData.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const callSecureApi = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "graphql-api",
        scope: "read",
      });
      console.log(token);

      const response = await fetch(
        `https://worklog-on-steroids.herokuapp.com/api/private`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();

      setMessage(responseData.message);
    } catch (error) {
      console.log(error);
      setMessage(error.message);
    }
  };

  const callSecureApiGraphQL = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "graphql-api",
      });

      const res = await client.query({
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        query: gql`
          query GetProfile {
            getProfile {
              velocity
            }
          }
        `,
      });
      setMessage(JSON.stringify(res.data));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h1>External API</h1>
      <p>
        Use these buttons to call an external API. The protected API call has an
        access token in its authorization header. The API server will validate
        the access token using the Auth0 Audience value.
      </p>
      <div
        className="btn-group mt-5"
        role="group"
        aria-label="External API Requests Examples"
      >
        <button type="button" className="btn btn-primary" onClick={callApi}>
          Get Public Message
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={callSecureApi}
        >
          Get Protected Message
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={callSecureApiGraphQL}
        >
          Get Protected GraphQL
        </button>
      </div>
      {message && (
        <div className="mt-5">
          <h6 className="muted">Result</h6>
          <div className="container-fluid">
            <div className="row">
              <code className="col-12 text-light bg-dark p-4">{message}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalApi;
