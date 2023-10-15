import { ApolloProvider } from "@apollo/client";
import apolloClient from "./apolloClient";
import { Toaster } from "./components/ui/toaster";
import ClinicProvider from "./lib/ClinicProvider";
import AppRouter from "./screens/AppRouter";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ClinicProvider>
        <AppRouter />
      </ClinicProvider>
      <Toaster />
    </ApolloProvider>
  )
}

export default App
