const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema({
  tag_key: {type: String, required: true},
  tag_value: {type: String, required: true},
  templates: {type: Array, required: false},
  is_active: {type: Boolean, required: true, default: true}
}, {
  timestamps: true
})

module.exports = tagSchema