import type { Document } from 'mongoose';
import { Schema } from 'mongoose';

export interface ICategory extends Document {
	name: string;
}

export const CategorySchema = new Schema<ICategory>(
	{
		name: { type: String, required: true, unique: true },
	},
	{ timestamps: true }
);
