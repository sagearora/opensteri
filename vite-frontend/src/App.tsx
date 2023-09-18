import { ApolloProvider } from "@apollo/client";
import apolloClient from "./apolloClient";
import AppRouter from "./screens/AppRouter";
import { Toaster } from "./components/ui/toaster";
import { ProvideUser } from "./lib/UserProvider";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ProvideUser>
        <AppRouter />
      </ProvideUser>
      <Toaster />
    </ApolloProvider>
  )
}

export default App
