import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery } from 'mongoose';
import { Model } from 'mongoose';
import type { IExpense } from './expense.schema';
import type {
	CreateExpenseDto,
	QueryExpenseDto,
	UpdateExpenseDto,
} from './dto/create-expense.dto';
import { getPaginationOptions, sendResponse } from 'src/utils/commonMethods';

@Injectable()
export class ExpenseService {
	constructor(
		@InjectModel('Expense')
		private readonly expenseModel: Model<IExpense>
	) {}

	private async verifyExpenseOwnership(id: string, userId: string) {
		const expense = await this.expenseModel.findById(id);
		if (!expense) {
			throw new NotFoundException(`Cannot find expense ${id}`);
		}
		if (expense.user.toString() !== userId) {
			throw new UnauthorizedException(
				`This expense is not owned by you, please check your account`
			);
		}
		return expense;
	}

	async create(createExpenseDto: CreateExpenseDto, userId: string) {
		const createdExpense = new this.expenseModel({
			...createExpenseDto,
			user: userId,
		});
		const savedExpense = await createdExpense.save();
		const data = sendResponse({
			status: true,
			result: savedExpense,
			message: 'New Expense added successfully',
		});
		return data;
	}

	async findAll(userId: string, page = 1, size = 10, query: QueryExpenseDto) {
		const filterQuery = this.buildFilterQuery(query);
		const { skip, limit } = getPaginationOptions(page, size);
		const filter = { user: userId, ...filterQuery };

		const [expenses, total] = await Promise.all([
			this.expenseModel
				.find(filter)
				.limit(limit)
				.skip(skip)
				.populate('category', 'name')
				.sort({ createdAt: -1 })
				.exec(),
			this.expenseModel.countDocuments(),
		]);

		const finalExpenseData = { expenses, total };

		const data = sendResponse({
			status: true,
			result: finalExpenseData,
			message: 'Expense fetched successfully',
		});
		return data;
	}

	async findOne(id: string, userId: string) {
		const expense = await this.verifyExpenseOwnership(id, userId);

		const data = sendResponse({
			status: true,
			result: expense,
			message: 'Expense fetched successfully',
		});
		return data;
	}

	async update(id: string, updateExpenseDto: UpdateExpenseDto, userId: string) {
		const expense = await this.verifyExpenseOwnership(id, userId);
		Object.assign(expense, updateExpenseDto);
		await expense.save();

		const data = sendResponse({
			status: true,
			message: 'Expense updated successfully',
		});
		return data;
	}

	async remove(id: string, userId: string) {
		await this.verifyExpenseOwnership(id, userId);
		await this.expenseModel.findByIdAndDelete(id);
		const data = sendResponse({
			status: true,
			message: 'Expense removed successfully',
		});
		return data;
	}

	private buildFilterQuery(query: QueryExpenseDto): FilterQuery<IExpense> {
		const filter: FilterQuery<IExpense> = {};

		if (query.category) {
			filter.category = query.category;
		}

		if (query.startDate) {
			filter.date = { ...filter.date, $gte: query.startDate };
		}

		if (query.endDate) {
			filter.date = { ...filter.date, $lte: query.endDate };
		}

		if (query.minAmount !== undefined) {
			filter.amount = { ...filter.amount, $gte: query.minAmount };
		}

		if (query.maxAmount !== undefined) {
			filter.amount = { ...filter.amount, $lte: query.maxAmount };
		}

		return filter;
	}
}
