import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { gql } from "graphql-tag";

const getNewClient = (username) => {
  const httpLink = createHttpLink({
    uri: "https://worklog-on-steroids.herokuapp.com/api/ql_open",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        "user-name": username ? username : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  client
    .query({
      query: gql`
        query getData {
          getProfile {
            oauthId
          }
        }
      `,
    })
    .then((result) =>
      console.log(
        result.data.getProfile.oauthId === username ? "Poprawnie" : "Błąd"
      )
    );
  return client;
};

// getNewClient("w.bozek");
