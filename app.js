const path = require("path");

const express = require("express");
const app = express();
require("dotenv").config();
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

app.use(express.static(path.join(__dirname, "public"))); //js,css
app.use(express.static(path.join(__dirname, "views"))); //html

app.set("view engine", "ejs");
app.set("views", "views");

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`Server Listening on port ${port}...`)
);

const io = require("socket.io")(server);
io.on("connection", function(socket) {
  console.log("a user connected");
});

const apiai = require("apiai")(APIAI_TOKEN);

// Homepage
app.get("/", (req, res) => {
  return res.render("bot");
});


io.on("connection", function(socket) {
  socket.on("chat message", text => {
    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on("response", response => {
      let aiText = response.result.fulfillment.speech;
      socket.emit("bot reply", aiText);
    });

    apiaiReq.on("error", error => {
      console.log(error);
    });

    apiaiReq.end();
  });
});
