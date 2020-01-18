const { Schema } = require('mongoose');

const FileSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: Object,
        required: true
    },
    location: {
        type: String,
        required: true
    }
})

module.exports = FileSchema;