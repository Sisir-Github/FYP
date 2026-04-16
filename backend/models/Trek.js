const mongoose = require('mongoose');
const slugify = require('slugify');

const TrekSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a trek title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
      unique: true,
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'Please add trek duration in days'],
    },
    price: {
      type: Number,
      required: [true, 'Please add trek price'],
    },
    difficulty: {
      type: String,
      required: [true, 'Please add difficulty level'],
      enum: ['Easy', 'Moderate', 'Challenging', 'Strenuous'],
    },
    maxAltitude: {
      type: Number,
      required: [true, 'Please add max altitude in meters'],
    },
    bestSeasons: {
      type: [String],
      required: [true, 'Please add best seasons'],
      enum: ['Spring', 'Summer', 'Autumn', 'Winter'],
    },
    accommodations: {
      type: [String],
      required: [true, 'Please specify accommodation types'],
    },
    meals: {
      type: [String],
      required: [true, 'Please specify meal types included'],
    },
    startPoint: {
      type: String,
      required: [true, 'Please add starting point'],
    },
    endPoint: {
      type: String,
      required: [true, 'Please add ending point'],
    },
    itinerary: [
      {
        day: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        accommodation: String,
        meals: [String],
      },
    ],
    included: {
      type: [String],
      required: true,
    },
    excluded: {
      type: [String],
      required: true,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug from title
TrekSchema.pre('save', async function () {
  this.slug = slugify(this.title, { lower: true });
});

// Configure virtual for reviews (later Phase)
TrekSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'trek',
  justOne: false,
});

module.exports = mongoose.model('Trek', TrekSchema);
