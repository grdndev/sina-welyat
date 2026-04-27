const express = require('express');
const infoController = require('../controllers/infoController');
const router = express.Router();

router.get('/', infoController.getInfos);

module.exports = router;
