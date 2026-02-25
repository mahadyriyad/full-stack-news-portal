const express = require('express');
const { createContact, getAllContacts } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', createContact);
router.get('/', protect, getAllContacts);

module.exports = router;
