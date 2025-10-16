import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true,
    }

}, { timestamps: true })

const CategoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema, 'categories')
export default CategoryModel