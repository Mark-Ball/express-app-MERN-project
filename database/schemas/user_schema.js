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
        trim: true,
        bcryt: true
    },
    approved: {
        type: Boolean,
        default: false
    }
})

UserSchema.plugin(require('mongoose-bcrypt'));

module.exports = UserSchema;