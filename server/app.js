const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./schema/schema');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb+srv://andrew:Andrew123@graphql-cluster-bizau.mongodb.net/graphql-demo?retryWrites=true&w=majority',
 { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', () => {
  console.log('Mongo db is connected');
});

app.use(cors());
app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema
}))

app.listen(4000, () => {
  console.log('Listening on port 4000');
})