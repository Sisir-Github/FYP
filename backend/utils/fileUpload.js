const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const path = require('path');
const fs = require('fs');

/**
 * Higher-level upload utility to switch between Cloudinary and Local Storage
 */
const fileUpload = {
  /**
   * Upload single image
   * @param {Buffer} buffer - File buffer from multer
   * @param {string} folder - Destination folder (e.g., 'blogs', 'treks')
   * @returns {Promise<{public_id: string, url: string}>}
   */
  uploadSingle: async (buffer, folder) => {
    // Check if Cloudinary is configured
    const isCloudinaryConfigured = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET;

    if (isCloudinaryConfigured) {
      return new Promise((resolve, reject) => {
        const options = {
          folder: `everest_encounter/${folder}`,
          crop: 'fill',
        };
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
          if (result) resolve({ public_id: result.public_id, url: result.secure_url });
          else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    } else {
      // Local Storage Fallback
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      const uploadPath = path.join(__dirname, '../uploads', folder, fileName);
      
      // Ensure directory exists (just in case)
      const dir = path.dirname(uploadPath);
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(uploadPath, buffer);
      
      // Return a URL relative to the server
      const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5050}`;
      return {
        public_id: fileName, // Using filename as ID for deletion
        url: `${serverUrl}/uploads/${folder}/${fileName}`
      };
    }
  },

  /**
   * Delete image
   * @param {string} public_id - Image ID (public_id for Cloudinary or filename for Local)
   * @param {string} folder - Folder name (only for Local deletion)
   */
  deleteImage: async (public_id, folder) => {
    const isCloudinaryConfigured = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET;

    if (isCloudinaryConfigured && public_id.includes('/')) {
      // If it looks like a Cloudinary ID (usually contains folder paths)
      return await cloudinary.uploader.destroy(public_id);
    } else {
      // Local deletion
      const filePath = path.join(__dirname, '../uploads', folder, public_id);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
};

module.exports = fileUpload;
