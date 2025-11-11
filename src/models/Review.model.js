import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        trim: true,
        min: 1,
        max: 5,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    review: {
        type: String,
        required: true,
        trim: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true,
    }
}, { timestamps: true })

const ReviewModel = mongoose.models.Review || mongoose.model('Review', reviewSchema, 'reviews');
export default ReviewModel;