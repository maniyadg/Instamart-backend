const express = require('express')
const db = require('./db/connection')
require('dotenv').config();

const app = express()

app.use(express.json())


// db connection
db()

app.get('/' , (req,res) => {
    res.send('<h1>welcome to InstaMart server</h1>')
})




const PORT =process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(
      `Server Running on port ${PORT}`
    );
  });