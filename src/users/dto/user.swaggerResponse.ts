import { ApiProperty } from '@nestjs/swagger';
import { SignupType, UserType } from './user.interface';
import {
	SuccessResponse,
	SuccessResultResponse,
} from 'src/constants/common.swagger';

class IUserResponse extends SuccessResultResponse {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty({ example: '+1' })
	countryCode: string;

	@ApiProperty()
	phone: number;

	@ApiProperty()
	email: string;

	@ApiProperty({ example: UserType.Passenger, enum: UserType })
	role: UserType;

	@ApiProperty()
	isMobileVerified: boolean;

	@ApiProperty()
	isEmailVerified: boolean;

	@ApiProperty({ example: 'false' })
	isAccountDeactivated: boolean;

	@ApiProperty({ example: 'custom', enum: SignupType })
	signupMethod: SignupType;
}

class UserLoginResponse {
	@ApiProperty()
	token: string;
	@ApiProperty({ type: IUserResponse })
	user: IUserResponse;
}

class OtpSendResponse {
	@ApiProperty({ example: true })
	otpSend: boolean;
}
class OtpVerifiedResponse {
	@ApiProperty({ example: true })
	verified: boolean;
}
class ChangedPasswordResponse {
	@ApiProperty({ example: true })
	changedPassword: boolean;
}
export class UserLoginSuccessResponse extends SuccessResponse {
	@ApiProperty({ type: UserLoginResponse })
	result?: UserLoginResponse;
}

export class OtpSuccessSendResponse extends SuccessResponse {
	@ApiProperty({ type: OtpSendResponse })
	result?: OtpSendResponse;
}

export class OtpSuccessVerifyResponse extends SuccessResponse {
	@ApiProperty({ type: OtpVerifiedResponse })
	result?: OtpVerifiedResponse;
}

export class ChangedPasswordApiResponse extends SuccessResponse {
	@ApiProperty({ type: ChangedPasswordResponse })
	result?: ChangedPasswordResponse;
}
