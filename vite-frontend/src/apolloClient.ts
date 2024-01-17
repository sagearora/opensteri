import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

const http_link = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
})

const client = new ApolloClient({
  link: http_link,
  cache: new InMemoryCache({
    typePolicies: {
      countable_item: {
        fields: {
          // Define custom merge function for fields you want to protect from overwrite
          total_scanned: {
            read () {
              return undefined
            },
            merge(existing) {
              // Do nothing, don't store in the cache
              return existing; // or simply return;
            },
          },
        },
      },
    },
  })
})

export default client