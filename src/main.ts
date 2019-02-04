import { GraphQLServer, PubSub } from 'graphql-yoga' // Websocket, Express, Cors, Apollo, Graphql
import * as morgan from 'morgan' // URL request logger => outputs to terminal

import { HomesController } from './homes/homes.controller'
import { HomesService } from './homes/homes.service'

import { Response, Params, Controller, Get, attachControllers } from '@decorators/express'
import { Injectable, Container } from '@decorators/di'


const _homesService = Container.get<HomesService>(HomesService);

// GraphQL schema
const typeDefs = `
  type Home {
    id: Int!
    name: String
    rooms: [Room]!
  }

  type Room {
    name: String!
    temperature: Float
    humidity: Float
  }

  type Query {
    Home(id: Int!): Home
    Homes: [Home]
  }

  type Subscription {
    HomesChanged: [Home]
  }
`

const resolvers = {
  Query: {
    Home: (_, { id }) => _homesService.findOne(id),
    Homes: () => _homesService.findAll()
  },
  Subscription: {
    HomesChanged: {      
      subscribe: () => pubsub.asyncIterator('HomesChanged') // listener for event => if triggered => send our dynamic data to the client with AsyncIterator 
    }
  }
}

// Simulate measurements that changes faster than normal..
let randomiseLastDigitTemperatureAndParseToFloat = (orgValue: number): number => {
  return orgValue + Math.floor(Math.random() * 3)-1
}
let randomiseLastDigitHumidityAndParseToFloat = (orgValue: any): any => {
  if (Math.random() < 0.5) {
    return parseFloat((orgValue + 0.01).toFixed(2))
  } else { 
    return parseFloat((orgValue - 0.01).toFixed(2))
  }  
}

// // Mock Actions to test dynamic data with websockets
let intervalSeconds: number = 4 * 1000 // change every 4 seconds
setInterval(() => {
  _homesService.findAll().map(home => {
    home.rooms.map(room => {
      room.temperature = randomiseLastDigitTemperatureAndParseToFloat(room.temperature)
      room.humidity = randomiseLastDigitHumidityAndParseToFloat(room.humidity)
  })
  })
  pubsub.publish('HomesChanged', { HomesChanged: _homesService.findAll()}) // Trigger "homeChanged" subscription event..
}, intervalSeconds)

const options = {
  port: process.env.PORT || 4000,
  endpoint: '/graphql',
  subscriptions: '/graphql', // websocket
  playground: '/graphql'
}

const pubsub = new PubSub() // Graphql subscription (websocket)
const websocketServer = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })
attachControllers(websocketServer.express, [HomesController])
websocketServer.use(morgan('combined')) // log network requests in console
websocketServer.start(options, ({ port }) => console.log(`Websocket Server is running on http://localhost:${port}`))