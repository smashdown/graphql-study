const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const { buildSchema } = require('graphql');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }
    
    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
    }
    
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    
    input UserInput {
        email: String!
        password: String!
    }
    
    type RootQuery {
        events: [Event!]!
    }
    
    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: graphQlResolvers,
    graphiql: true
}));

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphqlstudy-c2bfd.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
        {
            useNewUrlParser: true
        })
    .then(() => {
        console.log('mongodb connected');
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    })

