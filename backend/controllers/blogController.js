const Blog = require('../models/Blog');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const fileUpload = require('../utils/fileUpload');

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
exports.getBlogs = async (req, res, next) => {
  const blogs = await Blog.find({ isPublished: true })
    .populate('author', 'name email')
    .sort('-createdAt');

  res.status(200).json(new ApiResponse(200, 'Blogs fetched successfully', blogs));
};

exports.getBlog = async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name email');

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  res.status(200).json(new ApiResponse(200, 'Blog fetched successfully', blog));
};

exports.createBlog = async (req, res, next) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload a photo for the blog');
  }

  const result = await fileUpload.uploadSingle(req.file.buffer, 'blogs');

  const blogData = {
    ...req.body,
    image: {
      public_id: result.public_id,
      url: result.url,
    },
    author: req.user.id,
  };

  const blog = await Blog.create(blogData);
  res.status(201).json(new ApiResponse(201, 'Blog created successfully', blog));
};

exports.updateBlog = async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  const blogData = { ...req.body };

  if (req.file) {
    await fileUpload.deleteImage(blog.image.public_id, 'blogs');
    const result = await fileUpload.uploadSingle(req.file.buffer, 'blogs');

    blogData.image = {
      public_id: result.public_id,
      url: result.url,
    };
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, blogData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, 'Blog updated successfully', blog));
};

exports.deleteBlog = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  await fileUpload.deleteImage(blog.image.public_id, 'blogs');
  await blog.deleteOne();

  res.status(200).json(new ApiResponse(200, 'Blog deleted successfully', {}));
};
