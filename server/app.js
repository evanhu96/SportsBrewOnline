const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
require("dotenv").config();
const Game = require("./models/Game");
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 6001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

console.log("after server");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  console.log("in development");
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
} else {
  console.log("not in development");
  const buildPath = "../../../../var/www/html/build";
  app.use(express.static(path.join(__dirname, buildPath)));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, buildPath, "index.html"));
  });
}

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};
// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
