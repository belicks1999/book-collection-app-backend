const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getMyBooks
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const { bookRules, validate } = require('../utils/validation');

const router = express.Router();

// Protect all routes
router.use(protect);
// Get all books and create a book
router
  .route('/add-book')
  .get(getBooks)
  .post(bookRules, validate, createBook);

// Get current user's books
router.get('/my-books', getMyBooks);

// Get, update and delete a book
router
  .route('/:id')
  .get(getBook)
  .put(bookRules, validate, updateBook)
  .delete(deleteBook);

module.exports = router;