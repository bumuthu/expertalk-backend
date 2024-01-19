import mongoose, { Document, Schema } from 'mongoose';
import { CategoryModel, SourceModel } from '../entities';

export interface CategoryDocument extends Document, CategoryModel { }

const categorySchema = new Schema({
    name: String,
    childCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
});

const CategoryDBModel = mongoose.model<CategoryDocument>('Category', categorySchema);

export default CategoryDBModel;
