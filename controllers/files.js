const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Docxtemplater = require('docxtemplater')
const JSZip = require('jszip')

const {
  saveFile,
  getFiles,
  findActiveFiles,
  updateById
} = require('../repositories/files')
const {findActiveTemplates} = require('../repositories/templates')

const uploadedPath = path.resolve(__dirname, '../public/uploaded')
const fileUrl = '/public/uploaded/'

exports.getFiles = async(req, res) => {
  try {
    const files = await getFiles()
    res.success({
      files: files
    })
  } catch(err) {
    res.preconditionFailed(err.message || err)  
  }
}

exports.checkExistByFileName = async(req, res) => {
  const file_name = req.body.file_name
  try {
    const files = await findActiveFiles({file_name: file_name})
    res.success({exist: true})
  } catch(err) {
    res.preconditionFailed(err.message || err)
  }
}

exports.addFile = async(req, res) => {
  try {
    const filename = await saveFileToDisk(req, res)
    const filepath = `${fileUrl}/${filename}`
    try {
      const existFiles = await findActiveFiles({file_name: filename})
      if(existFiles.length > 0) {
        res.send(400, 'File with this name already exist') 
        return
      }
      const saveRes = await saveFile({
        file_name: filename,
        file_path: filepath
      })
      res.success({
        id: saveRes._id,
        file_name: saveRes.file_name,
        file_path: saveRes.file_path
      })
    } catch(err) {
      res.preconditionFailed(`Failed save file to db, ${err.message || err}`) 
      return
    }
  } catch(err) {
    res.preconditionFailed(err.message || err)  
  }
}

function saveFileToDisk(req, res) {
  let filename = ''
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadedPath)
    },
    filename: (req, file, callback) => {
      filename = file.originalname
      callback(null, file.originalname)
    }
  })
  const upload = multer({storage: storage}).any()
  return new Promise((resolve, reject) => {
    upload(req, res, err => {
      if(err) {
        reject(`file save failed, ${err.message}`)
      } else {
        resolve(filename)
      }
    })
  })
}

exports.deleteFile = async(req, res) => {
  const id = req.body.id
  if(!id) {
    res.preconditionFailed(`Please select item to be deleted`) 
    return
  }
  try {
    const updateRes = await updateById(id, {is_active: false})
    if(updateRes.ok) {
      res.success({
        updated: true
      })
    } else {
      res.preconditionFailed(`Server update failed: ${updateRes.message || updateRes}`)
    }
  } catch(err) {
    res.preconditionFailed(`Server update catch error: ${err.message || err}`)
  }
}

exports.exportFile = async(req, res) => {
  const formData = req.body
  if(!formData.fileName || !formData.templateName) {
    res.preconditionFailed(`Please select file and template`)
    return
  }
  try {
    const fileName = formData.fileName
    const templateName = formData.templateName
    const fileRes = await findActiveFiles({file_name: fileName}) 
    const templateRes = await findActiveTemplates({name: templateName})

    if(!(fileRes[0] || templateRes[0])) {
      res.preconditionFailed(`Can not find file or template in DB`)
      return
    }
    const file = fileRes[0]
    const template = templateRes[0]
    let mappingData = {}
    template.tags.map(tag => {
      mappingData = Object.assign({}, {...mappingData}, {[tag.tag_key] : tag.tag_value})
    })
    if(Object.keys(mappingData).length === 0) {
      res.preconditionFailed(`Template selected has no tags`)
      return
    }

    const content = fs.readFileSync(`${uploadedPath}/${file.file_name}`, 'binary')
    const zip = new JSZip(content)
    const doc = new Docxtemplater()
    doc.loadZip(zip)
    doc.setData(mappingData)
    try {
      doc.render()
    } catch (error) {
      var e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
      }
      console.error(JSON.stringify({error: e}));
      res.preconditionFailed(`Server export catch error: ${error.message || error}`)
      return
    }
    
    const buf = doc.getZip().generate({type: 'nodebuffer'})
    const outputFile = path.resolve(uploadedPath, 'output.docx')
    fs.writeFileSync(outputFile, buf)
    //res.sendFile(outputFile) 
    res.download(outputFile) 
  } catch(err) {
    console.error(err)
    res.preconditionFailed(`Server export catch error: ${err.message || err}`)
  }
}