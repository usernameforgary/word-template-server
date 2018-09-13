const mongoose = require('mongoose')
const fileSchema = require('../models/files')
const File = mongoose.model('File', fileSchema)

const saveFile = (data) => {
  const newFile = new File(data)
  return newFile.save()
}

const getFiles = () => {
  return File.find({is_active: true}).sort({updatedAt: -1})
}

const findActiveFiles = (filters = {}, sortBy = {updatedAt: -1}) => {
  filters.is_active = true
  return File.find(filters).sort(sortBy)
}

const updateById = (id, updateFields = {}) => {
  return File.updateOne({_id: id}, {$set: updateFields})
}

module.exports = {
  saveFile,
  getFiles,
  findActiveFiles,
  updateById,
}