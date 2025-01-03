const express = require('express')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const port = process.env.PORT || 5000
const mongoose = require('mongoose');
const colors = require('colors');
const cors = require('cors');

const app = express();
app.use(cors());

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log(`MongoDB connected`.cyan.underline.bold))
        .catch(err => console.log(err))
}

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}))

app.listen(port, console.log(`Server is running on port ${port}`))
connectDB();
