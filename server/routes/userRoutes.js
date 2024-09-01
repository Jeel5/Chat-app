const express = require('express');
const { searchUsers } = require('../controllers/userContoller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/search', authMiddleware, searchUsers);

module.exports = router;
