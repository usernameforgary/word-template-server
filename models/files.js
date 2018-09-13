const mongoose = require('mongoose')
const Schema = mongoose.Schema

const filesSchema = new Schema({
  file_name: {type: String, required: true},
  file_path: {type: String, required: true},
  templates: {type: Array, required: false},
  is_active: {type: Boolean, required: true, default: true}
}, {
  timestamps: true
})

module.exports = filesSchema