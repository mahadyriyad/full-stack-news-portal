const express = require('express');
const {
  getAllNews,
  getTopNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews,
  getUserNews,
  getNewsByCategory,
} = require('../controllers/newsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllNews);
router.get('/top', getTopNews);
router.get('/category/:category', getNewsByCategory);
router.get('/:slug', getSingleNews);

// Protected routes
router.post('/', protect, createNews);
router.put('/:id', protect, updateNews);
router.delete('/:id', protect, deleteNews);
router.get('/user/news', protect, getUserNews);

module.exports = router;
