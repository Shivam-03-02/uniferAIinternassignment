const express = require('express');
const router = express.Router();
const functions = require('../functionalities/functions');
const auth = require('../middleware/auth');

router.post('/register', functions.register);
router.post('/login', functions.login);
router.get('/me', auth, functions.getUserDetails);
router.put('/deactivate', auth, functions.deactivateUser);

module.exports = router;