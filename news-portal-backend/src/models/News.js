const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Technology', 'Sports', 'Business', 'Entertainment', 'Health', 'Politics', 'Science', 'Other'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    readingTime: {
      type: Number, // in minutes
      default: 5,
    },
  },
  { timestamps: true }
);

// Generate slug from title
NewsSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('News', NewsSchema);
