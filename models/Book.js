const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
    },
    publicationDate: {
      type: Date,
      required: [true, 'Publication date is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    pageCount: {
      type: Number,
      min: 1,
    },
    coverImage: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for common queries
bookSchema.index({ title: 'text', author: 'text', genre: 'text' });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;