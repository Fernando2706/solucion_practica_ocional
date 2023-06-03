import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
} from "@apollo/client"

// https://practicaopcional.deno.dev/graphql

const link = new HttpLink({
    uri: "https://practicaopcional.deno.dev/graphql",
    headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, POST, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Credentials": "true",
    },
})

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
})

export default client