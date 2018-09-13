var express = require('express');
var router = express.Router();
const controller = require('../controllers/files')

router.post('/add', controller.addFile)
router.get('/file_list', controller.getFiles)
router.post('/check_exist_by_name', controller.checkExistByFileName)
router.post('/file_delete', controller.deleteFile)
router.post('/export', controller.exportFile)

module.exports = router;
