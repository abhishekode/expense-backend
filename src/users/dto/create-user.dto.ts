import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import type { SignupType } from './user.interface';
import { UserType } from './user.interface';

export class CreateUserDto {
	firstName: string;
	lastName: string;
	phone: number;
	countryCode: string;
	email: string;
	password: string;
	role: UserType;
	isMobileVerified: boolean;
	isEmailVerified: boolean;
	signupMethod: SignupType;
	forgotPasswordOtp: number;
	mobileOtp: number;
}

export class updateUserAccountDetailsDto {
	@ApiProperty()
	firstName: string;
	@ApiProperty()
	lastName: string;
	@ApiProperty()
	dob: number;
	@ApiProperty()
	description: string;
	@ApiProperty()
	gender: string;
}
export class SwitchUserRoleDto {
	@ApiProperty({
		example: UserType.Passenger,
		enum: UserType,
	})
	role: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class ChangePasswordDto {
	@ApiProperty()
	oldPassword?: string;
	@ApiProperty()
	newPassword: string;
}

export class LoginUserDto {
	@ApiProperty()
	email: string;
	@ApiProperty()
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
