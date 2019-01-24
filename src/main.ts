import { GraphQLServer, PubSub } from 'graphql-yoga' // Websocket, Express, Cors, Apollo, Graphql
import * as morgan from 'morgan' // URL request logger => outputs to terminal

import { HomesController } from './homes/homes.controller'
import { HomesService } from './homes/homes.service'

import { Response, Params, Controller, Get, attachControllers } from '@decorators/express'
import { Injectable, Container } from '@decorators/di'


const _homesService = Container.get<HomesService>(HomesService);

// GraphQL schema
const typeDefs = `
  type Query {
    house(id: ID!): House
    houses: [House]
  }

  type House {
    id: ID!
    name: String
    rooms: [Room]!
  }

  type Room {
    name: String!
    temperature: Float
    humidity: Float
  }

  type Subscription {
    housesChanged: [House]
  }
`

const resolvers = {
  Query: {
    house: (_, { id }) => _homesService.findOne(id),
    houses: () => _homesService.findAll()
  },
  Subscription: {
    housesChanged: {      
      subscribe: () => pubsub.asyncIterator('housesChanged') // listener for event => if triggered => send our dynamic data to the client with AsyncIterator 
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
// let intervalSeconds = 4 * 1000 // change every 4 seconds
setInterval(() => {
  _homesService.findAll().map(house => {
  house.rooms.map(room => {
      room.temperature = randomiseLastDigitTemperatureAndParseToFloat(room.temperature)
      room.humidity = randomiseLastDigitHumidityAndParseToFloat(room.humidity)
  })
  })
  pubsub.publish('housesChanged', { housesChanged: _homesService.findAll()}) // Trigger "housesChanged" subscription event..
}, 1500)

const options = {
  port: process.env.PORT || 4000,
  endpoint: '/graphql',
  subscriptions: '/subscriptions', // websocket
  playground: '/playground'
}

const pubsub = new PubSub() // Graphql subscription (websocket)
const websocketServer = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })
attachControllers(websocketServer.express, [HomesController])
websocketServer.use(morgan('combined')) // log network requests in console
websocketServer.start(options, ({ port }) => console.log(`Websocket Server is running on http://localhost:${port}`))


// // Simulate measurements that changes faster than normal..
// randomiseLastDigitTemperatureAndParseToFloat = orgValue => {
//   return parseFloat( parseFloat(orgValue) + Math.floor(Math.random() * 3)-1 )
// }
// randomiseLastDigitHumidityAndParseToFloat = orgValue => {
//   if (Math.random() < 0.5) {
//     return parseFloat(orgValue + parseFloat(Math.random() * (0.02 - 0.01))).toFixed(2)
//   } else {
//     return parseFloat(orgValue - parseFloat(Math.random() * (0.02 - 0.01))).toFixed(2)
//   }  
// }

// // Mock Actions to test dynamic data with websockets
// let intervalSeconds = 4 * 1000 // change every 4 seconds
// setInterval(() => {
//   homesMockDB.map(house => {
//     house.rooms.map(room => {
//       room.temperature = randomiseLastDigitTemperatureAndParseToFloat(room.temperature)
//       room.humidity = randomiseLastDigitHumidityAndParseToFloat(room.humidity)
//     })
//   })
//   pubsub.publish('housesChanged', { housesChanged: homesMockDB}) // Trigger "housesChanged" subscription event..
// }, intervalSeconds)


// query {
//   house(id: 2) {
//   	id
//     name
//     rooms {
//       name
//       temperature
//       humidity
//     }
//   }
//   houses {
//     id
//     name
//     rooms {
//       name
//       temperature
//       humidity
//     }
//   }
// }


// subscription {
//   housesChanged {
//     id
//     name
//     rooms {
//       name
//       temperature
//       humidity
//     }
//   }
// }
