const mongoose = require('mongoose')
const tagSchema = require('./tags')
const Schema = mongoose.Schema

const templateSchema = new Schema({
  name: {type: String, required: true},
  tags: [tagSchema],
  files: {type: Array, required: false},
  is_active: {type: Boolean, required: true, default: true}
}, {
  timestamps: true
})

module.exports = templateSchema