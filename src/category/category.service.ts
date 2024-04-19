import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { CategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ICategory } from './category.schema';
import { sendResponse } from 'src/utils/commonMethods';

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel('Category')
		private readonly categoryModel: Model<ICategory>
	) {}

	async create(createCategoryDto: CategoryDto) {
		const { name } = createCategoryDto;

		const category = await this.categoryModel.findOne({ name });

		if (category) {
			throw new BadRequestException('Category already exists');
		}
		const newCategory = new this.categoryModel({ ...createCategoryDto });
		const categoryDetail = await newCategory.save();
		const data = sendResponse({
			status: true,
			result: categoryDetail,
			message: 'new category created successfully',
		});
		return data;
	}

	async findAll() {
		const category = await this.categoryModel.find();
		const data = sendResponse({
			status: true,
			result: category,
			message: 'category fetched successfully',
		});
		return data;
	}

	async findOne(id: string) {
		const category = await this.categoryModel.findById(id);
		if (!category) {
			throw new NotFoundException(`Cannot find category ${id}`);
		}
		const data = sendResponse({
			status: true,
			result: category,
			message: 'category fetched successfully',
		});
		return data;
	}

	async update(id: string, updateCategoryDto: CategoryDto) {
		const category = await this.categoryModel.findById(id);
		if (!category) {
			throw new NotFoundException(`Cannot find category ${id}`);
		}
		Object.assign(category, updateCategoryDto);
		await category.save();
		const data = sendResponse({
			status: true,
			message: 'category updated successfully',
		});
		return data;
	}

	async remove(id: string) {
		const category = await this.categoryModel.findByIdAndDelete(id);
		if (!category) {
			throw new NotFoundException(`Cannot find category ${id}`);
		}
		const data = sendResponse({
			status: true,
			message: 'category delete successfully',
		});
		return data;
	}
}
