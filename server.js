const express = require("express");
const cors = require("cors");
const app = express();
const { WebSocketServer } = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
var corsOptions =
  ["https://www.188betpg.pro","https://188betpg.pro"];

  // "http://localhost:3000";


// app.use(cors(corsOptions));
app.use(cors({ credentials: true, origin: corsOptions }));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8001;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

const clients = {};

wsServer.on('connection', (connection) => {
  // Generate a unique code for every user
  const userId = uuidv4();

  // Store the new connection
  clients[userId] = connection;

  // Set up heartbeat mechanism
  connection.isAlive = true;

  connection.on('pong', () => {
    connection.isAlive = true; // Mark connection as alive on receiving pong
  });

  const interval = setInterval(() => {
    wsServer.clients.forEach((client) => {
      if (client.isAlive === false) return client.terminate();

      client.isAlive = false;
      client.ping(); // Send a ping
    });
  }, 30000); // Ping every 30 seconds

  connection.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    const messageToSend = JSON.stringify(parsedMessage);
    // Broadcast message to all clients
    wsServer.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(messageToSend);
      }
    });
  });

  connection.on('close', () => {
    console.log('Client disconnected');
    delete clients[userId];
    clearInterval(interval); // Clear interval when client disconnects
  });

  connection.on('error', (error) => {
    console.log('WebSocket Error:', error);
  });

  connection.send(JSON.stringify({ type: 'welcome', message: 'WebSocket connected' }));
});




//static image folder

app.use('/app/images', express.static('./app/images'))
// app.use('/app/images/driving',express.static('./app/images/driving'))

const db = require("./app/models");

const Role = db.role;
const Weburl = db.weburl;



db.sequelize.sync();

// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
//     initial4();
//   });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/admin.routes')(app);
require('./app/routes/people.routes')(app);
require('./app/routes/weburl.routes')(app);
require('./app/routes/creditadmin.routes')(app);
require('./app/routes/game.routes')(app);
require('./app/routes/camp.routes')(app);
require('./app/routes/banner.routes')(app);
require('./app/routes/timerestriction.routes')(app);





// set port, listen for requests
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 3,
    name: "mod"
  });

  Role.create({
    id: 2,
    name: "admin"
  });
}


function initial3() {

  Bank.create({
    bankname: "ธนาคารกสิกรไทย"
  });

  Bank.create({
    bankname: "ธนาคารกรุงเทพ"
  });

  Bank.create({
    bankname: "ธนาคารไทยพาณิชย์"
  });
  Bank.create({
    bankname: "ธนาคารกรุงไทย"
  });
  Bank.create({
    bankname: "ธนาคารกรุงศรี"
  });

  Bank.create({
    bankname: "ธนาคารทหารไทยธนชาต"
  });

  Bank.create({
    bankname: "ธนาคารแลนด์แอนด์เฮ้าส์"
  });
  Bank.create({
    bankname: "ธนาคารออมสิน"
  });
  Bank.create({
    bankname: "ธนาคารเกียรตินาคินภัทร"
  });
  Bank.create({
    bankname: "ธนาคารซิตี้แบงก์"
  });
  Bank.create({
    bankname: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร"
  });
  Bank.create({
    bankname: "ธนาคารยูโอบี"
  });
}

function initial4() {
  Weburl.create({
    name: "facebook",
    nameurl: "#"
  });
  Weburl.create({
    name: "line",
    nameurl: "#"
  });
  Weburl.create({
    name: "website",
    nameurl: "https://188betpg.pro"
  });
  Weburl.create({
    name: "gmail",
    nameurl: "#"
  });
  Weburl.create({
    name: "idbank",
    nameurl: "1"
  });
  Weburl.create({
    name: "codebank",
    nameurl: "0000000000"
  });
  Weburl.create({
    name: "namebank",
    nameurl: "name lastname"
  });
  Weburl.create({
    name: "imgbank",
    nameurl: ""
  });
  Weburl.create({
    name: "bankdetail",
    nameurl: ""
  });
  Weburl.create({
    name: "imglogoweb",
    nameurl: ""
  });
  Weburl.create({
    name: "webname",
    nameurl: "188 Sood"
  });
  Weburl.create({
    name: "aboutus",
    nameurl: ""
  });
  Weburl.create({
    name: "notice",
    nameurl: "Bitcoinsv-Optionex is a global multi-asset fintech group operating proprietary technology-based trading platforms. Bitcoinsv-Optionex offers customers a range of trading products, including Contracts for Difference (“CFDs”), share dealing, and futures trading. "
  });

}

