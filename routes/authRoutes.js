const express = require('express');

const user = require('../controllers/user')

const router = express()

router.get('/login', user.getLogin)

module.exports = router;