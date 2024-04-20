import { ApiProperty } from '@nestjs/swagger';
import {
	SuccessResponse,
	SuccessResultResponse,
} from 'src/constants/common.swagger';

export class IExpenseResponse extends SuccessResultResponse {
	@ApiProperty()
	category: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	amount: number;

	@ApiProperty()
	user: string;
}

export class ExpenseSuccessResponse extends SuccessResponse {
	@ApiProperty({ type: IExpenseResponse })
	result?: IExpenseResponse;
}

export class ExpenseSuccessResponseList extends SuccessResponse {
	@ApiProperty({
		type: 'object',
		properties: {
			expenses: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						category: {
							type: 'object',
							properties: {
								_id: { type: 'string' },
								name: { type: 'string' },
							},
						},
						description: { type: 'string' },
						amount: { type: 'number' },
						user: { type: 'string' },
						createdAt: { type: 'string' },
						updatedAt: { type: 'string' },
					},
				},
			},
			count: { type: 'number' },
		},
	})
	result: { expenses: IExpenseResponse[]; count: number };
}
