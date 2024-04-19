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
import { AwsS3Service } from 'src/utils/aws-s3-upload';

@Injectable()
export class CategoryService {
	constructor(
		@InjectModel('Category')
		private readonly categoryModel: Model<ICategory>,
		private readonly awsS3Service: AwsS3Service
	) {}

	async create(createCategoryDto: CategoryDto, file: Express.Multer.File) {
		const { name } = createCategoryDto;

		const category = await this.categoryModel.findOne({ name });

		if (category) {
			throw new BadRequestException('Category already exists');
		}
		const image = await this.awsS3Service.uploadToS3('category', file);
		const newCategory = new this.categoryModel({
			...createCategoryDto,
			categoryImage: image[0],
		});
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

	async update(
		id: string,
		updateCategoryDto: CategoryDto,
		file?: Express.Multer.File
	) {
		const { name } = updateCategoryDto;
		const category = await this.categoryModel.findById(id);

		if (!category) {
			throw new NotFoundException(`Cannot find category ${id}`);
		}

		if (file.filename && category.categoryImage.length) {
			await this.awsS3Service.deleteS3ObjectByUrl(category.categoryImage);
		}

		if (file.filename) {
			const image = await this.awsS3Service.uploadToS3('category', file);
			category.categoryImage = image[0];
		}

		category.name = name;

		await category.save();

		const data = sendResponse({
			status: true,
			message: 'Category updated successfully',
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
