const mongoose = require('mongoose')
const tagSchema = require('../models/tags')
const Tag = mongoose.model('Tag', tagSchema)

const saveTag = (data) => {
  const newTag = new Tag(data)
  return newTag.save()
}

const getAllTags = () => {
  return Tag.find({is_active: true}).sort({updatedAt: -1})
}

const getTagByIds = (ids) => {
  const mongoIds = ids.map(id => mongoose.Types.ObjectId(id))
  return Tag.find({
    _id: {$in: mongoIds}
  })
}

const updateById = (id, updateFields) => {
  return Tag.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, updateFields, {
    returnNewDocument: true
  })
}

module.exports = {
  saveTag,
  getAllTags,
  getTagByIds,
  updateById,
}