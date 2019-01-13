const { ApolloServer, gql } = require('apollo-server');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const users = [
  {
    id: 1,
    username: 'alenthomas',
    password: 'some_password_1'
  },
  {
    id: 2,
    username: 'rashid',
    password: 'some_password_2'
  }
]

const user_details = [
  {
    id: 1,
    user: users[0],
    place: 'kkd',
    doc_id: 'some_doc_id_1',
  },
  {
    id: 2,
    user: users[1],
    place: 'bng',
    doc_id: 'some_doc_id_2'
  }
]

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  type User {
    id: Int
    username: String
    password: String
    user_details: UserDetails
  }

  type UserDetails {
    id: Int
    user: User
    place: String
    doc_id: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
    users: [User]
    user_details: [UserDetails]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    users: () => users,
    user_details: () => user_details
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});