import { ApiProperty } from '@nestjs/swagger';
import { UserType } from 'src/users/dto/user.interface';

export class sendMobileVerificationOtpDto {
	@ApiProperty({ example: '+1' })
	countryCode: string;
	@ApiProperty({ example: 1234567890 })
	phone: number;
	@ApiProperty({ example: 'test@gmail.com' })
	email: string;
}

export class resendMobileVerificationOtpDto {
	@ApiProperty({ example: '+1' })
	countryCode: string;
	@ApiProperty({ example: 1234567890 })
	phone: number;
}

export class mobileOtpVerificationDto {
	@ApiProperty({ example: '+1' })
	countryCode: string;
	@ApiProperty({ example: 1234567890 })
	phone: number;
	@ApiProperty({ example: 123456 })
	otp: number;
	@ApiProperty({ example: 'john' })
	firstName: string;
	@ApiProperty({ example: 'Doe' })
	lastName: string;
	@ApiProperty({ example: 'test@gmail.com' })
	email: string;
	@ApiProperty({ example: 'Test@123' })
	password: string;
	@ApiProperty({
		example: 'passenger',
		enum: Object.values(UserType),
		isArray: false,
		required: false,
	})
	role: string;
}
