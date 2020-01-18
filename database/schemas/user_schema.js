const { Schema } = require('mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    approved: {
        type: Boolean,
        default: false
    }
})

module.exports = UserSchema;