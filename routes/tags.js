const express = require('express')
const controller = require('../controllers/tags')

const router = express.Router()

router.post('/add', controller.saveTag)
router.get('/list_all', controller.getAllTags)
router.post('/delete', controller.deleteTagById)

module.exports = router