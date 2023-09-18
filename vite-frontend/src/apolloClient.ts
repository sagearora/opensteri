import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

const http_link = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
})

const client = new ApolloClient({
  link: http_link,
  cache: new InMemoryCache()
})

export default client