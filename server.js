const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const songs = require('./routes/songs');
const users = require('./routes/users');
const branches = require('./routes/branches');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const http = require('http');
// const googleMaps = require('@google/maps');
require('dotenv').config();

const server = http.createServer(app);
const io = require("socket.io")(server,{cors: {
    origin: "*",
  }});
  //////////////////////// Code Alon added to allow fetch /////////////
  
  //////////////////////////////////////////

mongoose.connect(process.env.MongodbConectionString)
  .then(() => console.log('Connected!'));

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};
app.get('/Home', authenticateToken, (req, res) => {
  res.sendFile(__dirname + '/HomePage.html');
});


app.use('/songs', songs);
app.use('/users' ,users);
app.use('/branches' ,branches);
app.set('socketio', io);

/////////////////////////////////////// Twitter Part /////////////////////////////////
const Twitter = require('twitter');


const client = new Twitter({
  consumer_key: 'u0Z9fky4EN0piQ3bwJWlCtlCa',
  consumer_secret: 'xPXzSY2wOudm4dpRDLUz9CO3CMTN2vD0CjDmodCBATV9dKytS5',
  access_token_key: '1648417416337055745-FQpWqnRJ75tO1f7MtsUFnaVSLQt8zp',
  access_token_secret: 'I8T00IDw9QO4c8LSQaCcbNjE9dH2gSsAKPRlEzZAItisI'
});


app.post('/tweet', (req, res) => {
  console.log("got to post");
  const tweet = req.body.tweet;

  client.post('statuses/update', {status: tweet}, (error, tweet, response) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      console.log(tweet);
      res.sendStatus(200);
    }
  });
});
//////////////////////////

server.listen(3000, function () {
    console.log('listening on 3000')
})
