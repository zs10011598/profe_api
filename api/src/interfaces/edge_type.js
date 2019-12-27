const { gql } = require('apollo-server');

module.exports = gql`
  interface Edge {
    cursor: String!
    node: Node
  }
`;
