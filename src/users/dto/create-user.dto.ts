import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/constants/common.interface';

export class CreateUserDto {
	@ApiProperty({ example: 'john doe' })
	name: string;
	@ApiProperty({ example: '+912233445566' })
	phone: number;
	@ApiProperty({ example: 'johndoe@gmail.com' })
	email: string;
	@ApiProperty({ example: 'Test@12345' })
	password: string;
}

export class UpdateUserDto {
	@ApiProperty({ example: 'john doe' })
	name: string;
	@ApiProperty()
	description: string;
	@ApiProperty({ example: Gender.Male, enum: Gender })
	gender: string;
}

export class ChangePasswordDto {
	@ApiProperty()
	oldPassword?: string;
	@ApiProperty()
	newPassword: string;
}

export class LoginUserDto {
	@ApiProperty({ example: 'johndoe@gmail.com' })
	email: string;
	@ApiProperty({ example: 'Test@12345' })
	password: string;
}

export class ResendOtpDto {
	@ApiProperty({ example: 'john@gmail.com' })
	email: string;
}

export class verifyEmailOtpDto extends ResendOtpDto {
	@ApiProperty({ example: '123456' })
	otp: number;
}

export class ChangeForgotPasswordDto {
	@ApiProperty({ example: 'john@gmail.com' })
	email: string;
	@ApiProperty()
	newPassword: string;
}
