const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true, // Enables GraphiQL interface
}));

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
