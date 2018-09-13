const {
  saveTemplate,
  getTemplates,
  findActiveTemplates
} = require('../repositories/templates')
const {getTagByIds} = require('../repositories/tags')

exports.saveTemplates = async(req, res) => {
  const formData = req.body
  if(!formData) {
    res.preconditionFailed(`no template data found`)
    return
  }
  try{
    const existRes = await findActiveTemplates({name: formData.templateName})
    if(existRes.length > 0) {
      res.preconditionFailed(`Template with current name already exist`)
      return
    }
    const dbTags = await getTagByIds(formData.tags)
    const saveRes = await saveTemplate({
      name: formData.templateName,
      tags: dbTags 
    })
    res.success(saveRes)
  } catch(err) {
    res.preconditionFailed(`template db save error, ${err.message || err}`)
  }
}

exports.getAllTags = async(req, res) => {
  try{
    const templatesRes = await getTemplates()
    res.success(templatesRes)
  } catch(e) {
    res.preconditionFailed(`get templates db error: ${e.message || e}`)
  }
}