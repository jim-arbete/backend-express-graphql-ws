# backend-express-graphql-ws

This project.

## Development server

Run `npm run dev` for a dev server. API endpoint listening on `http://localhost:4000/homes`. The app will automatically reload if you change any of the source files.

## Build

Run `tsc` to build the project. The build artifacts will be stored in the `dist/` directory.
Run `node dist/main.js` to run the built project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## GraphQL Test > Development server

Run `npm run start` to start dev server. Navigate to `http://localhost:4000/playground`. Use the following queries:

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
//
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

