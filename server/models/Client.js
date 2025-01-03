const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    }
});

module.exports = mongoose.model("Client", ClientSchema)