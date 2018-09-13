const express = require('express')
const controller = require('../controllers/templates')

const router = express.Router()

router.post('/add', controller.saveTemplates)
router.get('/list_all', controller.getAllTags)

module.exports = router