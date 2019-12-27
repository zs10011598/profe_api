const { gql } = require('apollo-server');

module.exports = gql`
  interface Node {
    id: ID!
  }
`;
