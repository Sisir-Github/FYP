const Blog = require('../models/Blog');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Upload helper using streamifier
 */
const uploadStream = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
exports.getBlogs = asyncHandler(async (req, res, next) => {
  // Add filtering/pagination if needed
  const blogs = await Blog.find({ isPublished: true })
    .populate('author', 'name email')
    .sort('-createdAt');

  res.status(200).json(new ApiResponse(200, 'Blogs fetched successfully', blogs));
});

/**
 * @desc    Get single blog by slug
 * @route   GET /api/blogs/:slug
 * @access  Public
 */
exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name email');

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  res.status(200).json(new ApiResponse(200, 'Blog fetched successfully', blog));
});

/**
 * @desc    Create new blog
 * @route   POST /api/blogs
 * @access  Private/Admin
 */
exports.createBlog = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload a photo for the blog');
  }

  // Upload to Cloudinary
  const result = await uploadStream(req.file.buffer, {
    folder: 'everest_encounter/blogs',
    crop: 'fill',
  });

  const blogData = {
    ...req.body,
    image: {
      public_id: result.public_id,
      url: result.secure_url,
    },
    author: req.user.id,
  };

  const blog = await Blog.create(blogData);

  res.status(201).json(new ApiResponse(201, 'Blog created successfully', blog));
});

/**
 * @desc    Update blog
 * @route   PATCH /api/blogs/:id
 * @access  Private/Admin
 */
exports.updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  const blogData = { ...req.body };

  // If new image is uploaded
  if (req.file) {
    // Delete old image from Cloudinary
    await cloudinary.uploader.destroy(blog.image.public_id);

    // Upload new image
    const result = await uploadStream(req.file.buffer, {
      folder: 'everest_encounter/blogs',
      crop: 'fill',
    });

    blogData.image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, blogData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, 'Blog updated successfully', blog));
});

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:id
 * @access  Private/Admin
 */
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  // Delete image from Cloudinary
  await cloudinary.uploader.destroy(blog.image.public_id);

  await blog.deleteOne();

  res.status(200).json(new ApiResponse(200, 'Blog deleted successfully', {}));
});
