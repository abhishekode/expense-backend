import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaidIn } from 'src/constants/common.interface';

export class CreateExpenseDto {
	@ApiProperty()
	category: string;
	@ApiProperty()
	notes: string;
	@ApiProperty()
	amount: number;
	@ApiProperty({ enum: PaidIn, example: PaidIn.UPI })
	paidIn: PaidIn;
	@ApiProperty()
	date: Date;
}

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

export class QueryExpenseDto {
	@ApiProperty({ required: false })
	category?: string;

	@ApiProperty({ required: false, type: 'string', format: 'date' })
	startDate?: Date;

	@ApiProperty({ required: false, type: 'string', format: 'date' })
	endDate?: Date;

	@ApiProperty({ required: false, type: 'number' })
	minAmount?: number;

	@ApiProperty({ required: false, type: 'number' })
	maxAmount?: number;

	@ApiProperty({ enum: PaidIn, example: PaidIn.UPI, required: false })
	paidIn: PaidIn;

	@ApiProperty({ required: true, type: 'number' })
	page: number;

	@ApiProperty({ required: true, type: 'number' })
	size: number;
}
