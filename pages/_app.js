import '../styles/index.css'
import { ApolloProvider } from "@apollo/client/react";
import { client } from "../lib/apollo";
import { AppProvider } from '../contexts/AppContext';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider >
    </ApolloProvider>
  )
}

export default MyApp