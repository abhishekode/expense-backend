// expense.model.ts
import type { Types } from 'mongoose';
import { Schema } from 'mongoose';
import type { ICategory } from 'src/category/category.schema';
import type { User } from 'src/users/users.schema';

export interface IExpense extends Document {
	amount: number;
	description: string;
	category: Types.ObjectId | ICategory;
	user: Types.ObjectId | User;
}

export const expenseSchema = new Schema<IExpense>(
	{
		amount: { type: Number, required: true },
		description: { type: String, required: true },
		category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);
