// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const branches = require('./routes/branches');
// const newLocal = require('custom-env');
// newLocal.env(process.env.NODE_ENV, './config');

// mongoose.connect("mongodb://127.0.0.1:27017/Spotify", 
//                 {   useNewUrlParser: true, 
//                     useUnifiedTopology: true });

// var app = express();
// app.use(cors());
// app.use(bodyParser.urlencoded({extended : true}));
// app.use(express.json());

// app.use('/branches', branches);


// app.listen(process.env.PORT); 


const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const branches = require('./routes/branches');
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Spotify", 
                {   useNewUrlParser: true, 
                    useUnifiedTopology: true });


app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use('/branches', branches);

app.listen(3000, function () {
    console.log('listening on 3000')
})