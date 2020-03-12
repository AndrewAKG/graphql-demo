const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./schema/schema');
const cors = require('cors');
const port  = process.env.PORT || 4000;
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})