require('dotenv').config();
const express = require('express');
const cors = require('cors')
const morgan = require('morgan')

const authRoute = require('./src/routes/auth-route')

const app = express();
app.use(cors());
app.use(morgan('dev'))
app.use(express.json());


// app.use('/auth', (()=>console.log("kuyy")) )
app.use('/auth', authRoute )

const PORT = process.env.PORT || '5000';

app.listen(PORT, () => console.log(`server runnig on port: ${PORT}`));