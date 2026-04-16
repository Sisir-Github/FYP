const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title for the review'],
      maxlength: 100,
    },
    text: {
      type: String,
      required: [true, 'Please add some text'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
    trek: {
      type: mongoose.Schema.ObjectId,
      ref: 'Trek',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per trek
ReviewSchema.index({ trek: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (trekId) {
  const obj = await this.aggregate([
    {
      $match: { trek: trekId },
    },
    {
      $group: {
        _id: '$trek',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Trek').findByIdAndUpdate(trekId, {
      averageRating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0, // Round to 1 decimal
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', async function (doc, next) {
  await doc.constructor.getAverageRating(doc.trek);
  next();
});

// Call getAverageRating after remove
ReviewSchema.post('deleteOne', { document: true, query: false }, async function (doc, next) {
  await doc.constructor.getAverageRating(doc.trek);
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);
