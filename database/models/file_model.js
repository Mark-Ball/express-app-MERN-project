const mongoose = require('mongoose');
const FileSchema = require('./../schemas/file_schema');

const FileModel = mongoose.model('file', FileSchema);

module.exports = FileModel;