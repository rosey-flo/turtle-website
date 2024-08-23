const gql = String.raw

//type User gets insterted to type Query---so only what is included in users can be queried from back end above
const typeDefs = gql`
    type User {
        _id: ID
        username:String
        email: String
    }

    type Response {
        message: String
    }

    type AuthResponse {
        message: String
        user: User
    }

    type Query {
        getUser: AuthResponse
    } 

    type Mutation {
        registerUser(username: String, email: String, password: String): AuthResponse
        loginUser(email: String, password: String) : AuthResponse
    } 
`;

module.exports = typeDefs;