import { ApolloProvider } from "@apollo/client";
import apolloClient from "./apolloClient";
import SteriItems from "./components/SteriItems";
import { Button } from "./components/ui/button";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <h1>React + Apollo + GraphQL</h1>
        <Button>HELLO WORLD</Button>
        <SteriItems />
      </div>
    </ApolloProvider>
  )
}

export default App
