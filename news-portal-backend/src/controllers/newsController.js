const News = require('../models/News');

// Get all news with pagination
exports.getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    let query = { isPublished: true };
    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    const news = await News.find(query)
      .populate('author', 'name avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments(query);

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get top 6 featured news
exports.getTopNews = async (req, res) => {
  try {
    const news = await News.find({ isPublished: true })
      .populate('author', 'name avatar email')
      .sort({ views: -1, createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single news
exports.getSingleNews = async (req, res) => {
  try {
    const { slug } = req.params;

    let news = await News.findOne({ slug }).populate('author', 'name avatar email bio');
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create news (requires authentication)
exports.createNews = async (req, res) => {
  try {
    const { title, description, content, image, category, tags, readingTime } = req.body;

    if (!title || !description || !content || !image || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const news = await News.create({
      title,
      description,
      content,
      image,
      category,
      tags: tags ? tags.split(',') : [],
      readingTime: readingTime || 5,
      author: req.user.id,
      authorName: req.user.name,
    });

    await news.populate('author', 'name avatar email');

    res.status(201).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update news
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, image, category, tags, readingTime } = req.body;

    let news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Check authorization
    if (news.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this news' });
    }

    if (title) news.title = title;
    if (description) news.description = description;
    if (content) news.content = content;
    if (image) news.image = image;
    if (category) news.category = category;
    if (tags) news.tags = tags.split(',');
    if (readingTime) news.readingTime = readingTime;

    await news.save();
    await news.populate('author', 'name avatar email');

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    let news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Check authorization
    if (news.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this news' });
    }

    await News.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's news
exports.getUserNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const news = await News.find({ author: req.user.id })
      .populate('author', 'name avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments({ author: req.user.id });

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get news by category
exports.getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const news = await News.find({ category, isPublished: true })
      .populate('author', 'name avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments({ category, isPublished: true });

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: news,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
