const { saveTag, getAllTags } = require('../repositories/tags')

exports.saveTag = async(req, res) => {
  const formData = req.body
  if(!formData) {
    res.preconditionFailed(`no tag data found`)
    return
  }
  try{
    const saveRes = await saveTag({
      tag_key: formData.tagKey,
      tag_value: formData.tagValue
    })
    res.success(saveRes)
  } catch(err) {
    res.preconditionFailed(`tag db save error, ${err.message || err}`)
  }
}

exports.getAllTags = async(req, res) => {
  try{
    const tagRes = await getAllTags()
    res.success(tagRes)
  } catch(e) {
    res.preconditionFailed(`get tags db error: ${e.message || e}`)
  }
}

