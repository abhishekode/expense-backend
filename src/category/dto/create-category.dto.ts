import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
	@ApiProperty()
	name: string;
}

export const categoryJoiSchema = Joi.object({
	name: Joi.string().required(),
});
