import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { CategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ICategory } from './category.schema';

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel('Category')
		private readonly categoryModel: Model<ICategory>
	) {}

	private sendResponse(data: any, message: string) {
		return {
			status: true,
			message,
			result: data,
		};
	}

	private async getCategoryById(id: string) {
		const category = await this.categoryModel.findById(id);
		if (!category) {
			throw new NotFoundException(`Cannot find category ${id}`);
		}
		return category;
	}

	async create(createCategoryDto: CategoryDto) {
		const { name } = createCategoryDto;

		if (!name) {
			throw new NotFoundException(`Cannot find category name`);
		}

		const categoryExists = await this.categoryModel.findOne({ name });

		if (categoryExists) {
			throw new BadRequestException('Category already exists');
		}
		const newCategory = new this.categoryModel({
			...createCategoryDto,
		});
		const categoryDetail = await newCategory.save();
		return this.sendResponse(
			categoryDetail,
			'New category created successfully'
		);
	}

	async findAll() {
		const categories = await this.categoryModel.find();
		return this.sendResponse(categories, 'Categories fetched successfully');
	}

	async findOne(id: string) {
		const category = await this.getCategoryById(id);
		return this.sendResponse(category, 'Category fetched successfully');
	}

	async update(id: string, updateCategoryDto: CategoryDto) {
		const { name } = updateCategoryDto;
		const category = await this.getCategoryById(id);

		category.name = name;
		await category.save();

		return this.sendResponse(null, 'Category updated successfully');
	}

	async remove(id: string) {
		await this.getCategoryById(id);
		await this.categoryModel.findByIdAndDelete(id);
		return this.sendResponse(null, 'Category deleted successfully');
	}
}
