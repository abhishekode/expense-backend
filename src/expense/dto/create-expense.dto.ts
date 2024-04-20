import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateExpenseDto {
	@ApiProperty()
	category: string;
	@ApiProperty()
	description: string;
	@ApiProperty()
	amount: number;
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

	@ApiProperty({ required: true, type: 'number' })
	page: number;

	@ApiProperty({ required: true, type: 'number' })
	size: number;
}
