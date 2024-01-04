const express = require("express");
const http = require("http");
const Server = require("socket.io").Server;
const app = express();
const path = require("path");
const { Game } = require("./models");


// added db now test on aws

const db = require("./config/connection");
// db.once("open", () => {
//   app.listen(5001, () => {
//     // find games
//     Game.find({}).then((games) => {
//       console.log(games);
//     });
    
//     console.log(`API server running on 5001 ${5001}!`);
//     console.log(`Use GraphQL at http://localhost:${5001}${server.graphqlPath}`);
//   });
// });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../../../../var/www/html/build");
// const buildPath = path.join(_dirname  , "../client/build");

app.use(express.static(buildPath));

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../../../../var/www/html/build/index.html"),
    // path.join(__dirname, "../client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

io.on("connection", (socket) => {
  console.log("We are connected");

  socket.on("chat", (chat) => {
    io.emit("chat", chat);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

server.listen(6001, () => console.log("Listening to port 6001"));
