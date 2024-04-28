import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseGuards,
	Request,
	Query,
	Put,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import {
	CreateExpenseDto,
	UpdateExpenseDto,
	QueryExpenseDto,
} from './dto/create-expense.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/constants/common.interface';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import {
	ExpenseSuccessResponse,
	ExpenseSuccessResponseList,
} from './dto/expense.swagger';
import {
	BadRequestResponse,
	NotFoundResponse,
	SuccessResponse,
} from 'src/constants/common.swagger';

@ApiTags('Expense')
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
@Controller('expense')
export class ExpenseController {
	constructor(private readonly expenseService: ExpenseService) {}

	@Post()
	@ApiResponse({ status: 200, type: ExpenseSuccessResponse })
	@ApiBearerAuth()
	@Roles(UserRole.User)
	@UseGuards(AuthGuard, RolesGuard)
	create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
		const userId = req.user.id;
		return this.expenseService.create(createExpenseDto, userId);
	}

	@Get()
	@ApiResponse({ status: 200, type: ExpenseSuccessResponseList })
	@ApiBearerAuth()
	@Roles(UserRole.User)
	@UseGuards(AuthGuard, RolesGuard)
	findAll(@Request() req, @Query() filterQuery: QueryExpenseDto) {
		const userId = req.user.id;
		const { page, size } = filterQuery;
		return this.expenseService.findAll(userId, page, size, filterQuery);
	}

	@Get(':id')
	@ApiResponse({ status: 200, type: ExpenseSuccessResponseList })
	@ApiBearerAuth()
	@Roles(UserRole.User)
	@UseGuards(AuthGuard, RolesGuard)
	findOne(@Param('id') id: string, @Request() req) {
		const userId = req.user.id;
		return this.expenseService.findOne(id, userId);
	}

	@Put(':id')
	@ApiResponse({ status: 200, type: SuccessResponse })
	@ApiBearerAuth()
	@Roles(UserRole.User)
	@UseGuards(AuthGuard, RolesGuard)
	update(
		@Param('id') id: string,
		@Body() updateExpenseDto: UpdateExpenseDto,
		@Request() req
	) {
		const userId = req.user.id;
		return this.expenseService.update(id, updateExpenseDto, userId);
	}

	@Delete(':id')
	@ApiResponse({ status: 200, type: SuccessResponse })
	@ApiBearerAuth()
	@Roles(UserRole.User)
	@UseGuards(AuthGuard, RolesGuard)
	remove(@Param('id') id: string, @Request() req) {
		const userId = req.user.id;
		return this.expenseService.remove(id, userId);
	}
}
