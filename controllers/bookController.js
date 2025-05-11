const Book = require('../models/Book');

/**
 * @desc    Get all books
 * @route   GET /api/books
 * @access  Private
 */
exports.getBooks = async (req, res, next) => {
  try {
    // Build query - include search and filter options
    const query = {};
    
    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Filter by genre
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    
    // Filter by author
    if (req.query.author) {
      query.author = { $regex: req.query.author, $options: 'i' };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query with pagination
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Book.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
      },
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single book
 * @route   GET /api/books/:id
 * @access  Private
 */
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new book
 * @route   POST /api/books
 * @access  Private
 */
exports.createBook = async (req, res, next) => {
  try {
    // Add user ID to the book
    req.body.user = req.user._id;
    
    const book = await Book.create(req.body);
    
    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update book
 * @route   PUT /api/books/:id
 * @access  Private
 */
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
    
    // Check if user is book owner or admin
    if (book.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book',
      });
    }
    
    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete book
 * @route   DELETE /api/books/:id
 * @access  Private
 */
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
    
    // Check if user is book owner or admin
    if (book.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book',
      });
    }
    
    await book.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get books by current user
 * @route   GET /api/books/my-books
 * @access  Private
 */
exports.getMyBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ user: req.user._id });
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};