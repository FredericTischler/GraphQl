import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export function createApolloClient(token: string) {
    return new ApolloClient({
        link: new HttpLink({
            uri: 'https://zone01normandie.org/api/graphql-engine/v1/graphql',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        cache: new InMemoryCache(),
    })
}
