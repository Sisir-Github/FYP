const Trek = require('../models/Trek');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * @desc    Get all treks (with filtering, sorting, pagination)
 * @route   GET /api/treks
 * @access  Public
 */
exports.getTreks = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  let queryObj = JSON.parse(queryStr);

  // Handle nested array searches (like included meals/seasons etc if sent as comma-separated)
  if (reqQuery.bestSeasons) {
    queryObj.bestSeasons = { $in: reqQuery.bestSeasons.split(',') };
  }
  if (reqQuery.difficulty) {
    queryObj.difficulty = { $in: reqQuery.difficulty.split(',') };
  }

  // Handle Search keyword
  if (req.query.keyword) {
    queryObj.$or = [
      { title: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } }
    ];
  }

  query = Trek.find(queryObj);

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // default sort by newest
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Trek.countDocuments(queryObj);

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const treks = await query;

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json(
    new ApiResponse(200, 'Treks fetched successfully', {
      count: treks.length,
      pagination,
      data: treks,
    })
  );
});

/**
 * @desc    Get single trek
 * @route   GET /api/treks/:id (or /:slug if configured later)
 * @access  Public
 */
exports.getTrek = asyncHandler(async (req, res, next) => {
  const trek = await Trek.findById(req.params.id);

  if (!trek) {
    throw new ApiError(404, `Trek not found with id of ${req.params.id}`);
  }

  res.status(200).json(new ApiResponse(200, 'Trek fetched successfully', trek));
});

/**
 * @desc    Get single trek by slug
 * @route   GET /api/treks/slug/:slug
 * @access  Public
 */
exports.getTrekBySlug = asyncHandler(async (req, res, next) => {
  const trek = await Trek.findOne({ slug: req.params.slug });

  if (!trek) {
    throw new ApiError(404, `Trek not found with slug of ${req.params.slug}`);
  }

  res.status(200).json(new ApiResponse(200, 'Trek fetched successfully', trek));
});

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
 * @desc    Create new trek
 * @route   POST /api/treks
 * @access  Private/Admin
 */
exports.createTrek = asyncHandler(async (req, res, next) => {
  let reqData = { ...req.body };

  // Parse JSON strings back to objects (since FormData sends arrays/objects as strings)
  const arrayFields = ['bestSeasons', 'accommodations', 'meals', 'included', 'excluded', 'itinerary'];
  arrayFields.forEach(field => {
    if (reqData[field] && typeof reqData[field] === 'string') {
      try {
        reqData[field] = JSON.parse(reqData[field]);
      } catch (e) {
        // If it's a simple comma string
        reqData[field] = reqData[field].split(',').map(s => s.trim());
      }
    }
  });

  // Handle multiple image uploads if req.files exists (from upload.array('images'))
  let images = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) => {
      return uploadStream(file.buffer, {
        folder: 'everest_encounter/treks',
        crop: 'fill',
      });
    });

    const results = await Promise.all(uploadPromises);
    images = results.map(result => ({
      public_id: result.public_id,
      url: result.secure_url
    }));
  }

  reqData.images = images;

  const trek = await Trek.create(reqData);
  res.status(201).json(new ApiResponse(201, 'Trek created successfully', trek));
});

/**
 * @desc    Update trek
 * @route   PUT /api/treks/:id
 * @access  Private/Admin
 */
exports.updateTrek = asyncHandler(async (req, res, next) => {
  // First ensure trek exists
  let trek = await Trek.findById(req.params.id);

  if (!trek) {
    throw new ApiError(404, `Trek not found with id of ${req.params.id}`);
  }

  let reqData = { ...req.body };

  // Parse JSON strings
  const arrayFields = ['bestSeasons', 'accommodations', 'meals', 'included', 'excluded', 'itinerary'];
  arrayFields.forEach(field => {
    if (reqData[field] && typeof reqData[field] === 'string') {
      try {
        reqData[field] = JSON.parse(reqData[field]);
      } catch (e) {
        reqData[field] = reqData[field].split(',').map(s => s.trim());
      }
    }
  });

  let newImages = [];
  let existingImages = trek.images || [];

  // Handle images if new files provided
  if (req.files && req.files.length > 0) {
    
    // Optional: check if they specified which existing images to KEEP
    // For simplicity, if they upload new images and don't pass an "images" array, we replace all old ones
    if (req.body.replaceImages === 'true' && existingImages.length > 0) {
      // Delete old from cloudinary
      const destroyPromises = existingImages.map(img => 
        cloudinary.uploader.destroy(img.public_id)
      );
      try { await Promise.all(destroyPromises); } catch(e) { console.error("Cloudinary cleanup error:", e); }
      existingImages = []; 
    }

    const uploadPromises = req.files.map((file) => {
      return uploadStream(file.buffer, {
        folder: 'everest_encounter/treks',
        crop: 'fill',
      });
    });

    const results = await Promise.all(uploadPromises);
    newImages = results.map(result => ({
      public_id: result.public_id,
      url: result.secure_url
    }));
  }

  // Only override images if new ones are successfully processed and we explicitly want to replace them
  // Otherwise we merge or keep existing
  if (newImages.length > 0) {
      reqData.images = [...existingImages, ...newImages];
  }

  trek = await Trek.findByIdAndUpdate(req.params.id, reqData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, 'Trek updated successfully', trek));
});

/**
 * @desc    Delete trek
 * @route   DELETE /api/treks/:id
 * @access  Private/Admin
 */
exports.deleteTrek = asyncHandler(async (req, res, next) => {
  const trek = await Trek.findById(req.params.id);

  if (!trek) {
    throw new ApiError(404, `Trek not found with id of ${req.params.id}`);
  }

  // Delete images from cloudinary
  if (trek.images && trek.images.length > 0) {
    const destroyPromises = trek.images.map(img => 
      cloudinary.uploader.destroy(img.public_id)
    );
    try {
      await Promise.all(destroyPromises);
    } catch(e) {
      console.error("Cloudinary cleanup error:", e);
    }
  }

  await trek.deleteOne();
  
  res.status(200).json(new ApiResponse(200, 'Trek deleted successfully', {}));
});
