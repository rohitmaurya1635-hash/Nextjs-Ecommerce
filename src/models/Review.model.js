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
    deletedAt: {
        type: Date,
        default: null,
        index: true,
    }
}, { timestamps: true })