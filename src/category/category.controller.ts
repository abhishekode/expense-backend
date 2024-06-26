import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseGuards,
	Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto, categoryJoiSchema } from './dto/create-category.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/constants/common.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
	CategorySuccessResponse,
	CategorySuccessResponseList,
} from './dto/category.swagger';
import {
	BadRequestResponse,
	NotFoundResponse,
	SuccessResponse,
} from 'src/constants/common.swagger';
import { JoiValidationPipe } from 'src/middleware/validation.pipe';

@ApiTags('category')
@ApiResponse({
	status: 404,
	description: 'Not Found',
	type: NotFoundResponse,
})
@ApiResponse({
	status: 400,
	description: 'Bad Request',
	type: BadRequestResponse,
})
@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post()
	@ApiResponse({ status: 200, type: CategorySuccessResponse })
	@ApiBearerAuth()
	@Roles(UserRole.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	create(@Body() categoryDto: CategoryDto) {
		return this.categoryService.create(categoryDto);
	}

	@Get()
	@ApiResponse({ status: 200, type: CategorySuccessResponseList })
	findAll() {
		return this.categoryService.findAll();
	}

	@Get(':id')
	@ApiResponse({ status: 200, type: CategorySuccessResponse })
	findOne(@Param('id') id: string) {
		return this.categoryService.findOne(id);
	}

	@Put(':id')
	@ApiResponse({ status: 200, type: SuccessResponse })
	@ApiBearerAuth()
	@Roles(UserRole.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	update(
		@Param('id') id: string,
		@Body(new JoiValidationPipe(categoryJoiSchema))
		updateCategoryDto: CategoryDto
	) {
		return this.categoryService.update(id, updateCategoryDto);
	}

	@Delete(':id')
	@ApiResponse({ status: 200, type: SuccessResponse })
	@ApiBearerAuth()
	@Roles(UserRole.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	remove(@Param('id') id: string) {
		return this.categoryService.remove(id);
	}
}
