const express = require('express');
const router = express.Router();
const { getUsers, getUser } = require('../controllers/userController');

// GET /api/users
router.get('/', getUsers);

// GET /api/users/:id
router.get('/:id', getUser);

module.exports = router;