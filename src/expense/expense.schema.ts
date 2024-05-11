// expense.model.ts
import type { Types } from 'mongoose';
import { Schema } from 'mongoose';
import type { ICategory } from 'src/category/category.schema';
import { PaidIn } from 'src/constants/common.interface';
import type { User } from 'src/users/users.schema';

export interface IExpense extends Document {
	amount: number;
	notes: string;
	category: Types.ObjectId | ICategory;
	user: Types.ObjectId | User;
	paidIn: PaidIn;
	date: Date;
}

export const expenseSchema = new Schema<IExpense>(
	{
		amount: { type: Number, required: true },
		notes: { type: String, required: true },
		category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		paidIn: { type: String, required: true, enum: PaidIn },
		date: { type: Date, required: true, default: Date.now() },
	},
	{ timestamps: true }
);
