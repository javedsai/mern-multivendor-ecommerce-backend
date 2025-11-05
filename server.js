const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { dbConnect } = require('./utilities/db')

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))
app.use(bodyParser.json())
app.use(cookieParser())

//used to run api on postman otherwise postman gets request body as undefined. Later add this in middleware
app.use(express.json());

app.use('/api', require('./routes/authRoutes'))
app.get('/', (req, res) => res.send('Hello Server'))

const port = process.env.port
dbConnect()
app.listen(port, () => console.log(`Server is running on port ${port}`))