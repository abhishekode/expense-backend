import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
	@ApiProperty()
	name: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		required: false,
	})
	files: Express.Multer.File;
}

export const categoryJoiSchema = Joi.object({
	name: Joi.string().required(),
});
