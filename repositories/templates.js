const mongoose = require('mongoose')
const templateSchema = require('../models/templates')
const Template = mongoose.model('Template', templateSchema)

const saveTemplate = (data) => {
  const newTemplate = new Template(data)
  return newTemplate.save()
}

const getTemplates = () => {
  return Template.find({is_active: true}).sort({updatedAt: -1})
}

const findActiveTemplates = (filters = {}, sortBy = {}) => {
  filters.is_active = true
  sortBy.updatedAt = -1
  return Template.find(filters).sort(sortBy)
}

module.exports = {
  saveTemplate,
  getTemplates,
  findActiveTemplates,
}