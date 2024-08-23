require('dotenv').config()
const express = require('express')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const cookieParser = require('cookie-parser')

const resolvers = require('./schema/resolvers')
const typeDefs = require('./schema/typeDefs')

const db= require('./config/connection')

const app = express();
const PORT = process.env.PORT || 3333;

function generateId() {
    let min = 1000000000000000; // 10^15
    let max = 9999999999999999; // 10^16 - 1
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

//single object example
const user = {
    name: 'EF',
    age: 27,
    password: 'some secret'
}
//array example
const users = [{
    name: 'EF',
    age: 27,
    id: 1,
    password: 'some secret'
},
{
    name: 'EF',
    age: 27,
    id: 2,
    password: 'some secret'
},
{
    name: 'EF',
    age: 27,
    id: 3,
    password: 'some secret'
}
]

//arg was made in graphql webface
const server = new ApolloServer({
    typeDefs,
    resolvers
})


async function startServer() {
    await server.start()

    app.use(
        '/graphql',
        //cors()
        express.json(),
        cookieParser(), //needs to be called before express middleware
        expressMiddleware(server, {
            context: ({req, res}) => {
                return {
                    req,
                    res
                }
            }
        })
    );


    db.once('open', () => {
        app.listen(PORT, () => {
            console.log('Express server running on port', PORT)
            console.log('GraphQL ready at /graphql')
        })
    })
}

startServer()