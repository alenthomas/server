/* global require */
const { ApolloServer, gql } = require('apollo-server');
const {
    updateUserDetail,
    deleteUserDetail,
    login,
    register,
    editUser,
} = require('./mutations.js');

const {initUsers, initUserDetails} = require('./initialize.js');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

// updateUser(3, {username: 'al3n', password: 'some_random_password'});
// createUserDetails(3, 'kkd', 'doc_id_1');
// updateUserDetails(3, {place: 'banglore', doc_id: 'random-shit'});
// getUsers()

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.

  type User {
    id: Int
    username: String
    password: String
    user_details: UserDetails
  }

  type UserDetails {
    id: Int
    user_id: Int
    place: String
    doc_id: String
  }

  type LoginResponse {
    success: Boolean
    error: Boolean
    info: String
    user: User
  }

  type RegisterResponse {
    success: Boolean
    error: Boolean
    info: String
    user: User
  }

  type EditResponse {
    success: Boolean
    error: Boolean
    info: String
    user: User
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    users: [User]
    user_details: [UserDetails]
  }
  type Mutation {
    updateUser(username: String, password: String): User
    updateUserDetail(username: String, place: String, doc_id: String): UserDetails
    deleteUserDetail(username: String): UserDetails
    login(username: String, password: String): LoginResponse
    register(username: String, password: String): RegisterResponse
    editUser(username: String, password: String): EditResponse
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    Query: {
	users: () => initUsers().then(users => users),
	user_details: () => initUserDetails()
	    .then(user_details => user_details)
    },
    Mutation: {
	updateUser: (gql, {username, password}) => updateUser(username, password).then(user => user),
	updateUserDetail: (gql, {username, place, doc_id}) => updateUserDetail(username, place, doc_id).then(userDetails => userDetails),
	deleteUserDetail: (gql, {username}) => deleteUserDetail(username).then(user_details => user_details),
	login: (gql, {username, password}) => login(username, password).then(user => user),
	register: (gql, {username, password}) => register(username, password).then(user => user),
	editUser: (gql, {username, password}) => editUser(username, password).then(user => user)
  },
};

/* mutation template 
mutation {
  createUser(username: "rashid" password: "lksjdlkjs") {
    username password id
  }
}
*/

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
