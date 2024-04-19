import { ApiProperty } from '@nestjs/swagger';
import {
	SuccessResponse,
	SuccessResultResponse,
} from 'src/constants/common.swagger';
import { UserRole } from 'src/constants/common.interface';

class IUserResponse extends SuccessResultResponse {
	@ApiProperty()
	token: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	phone: number;

	@ApiProperty()
	email: string;

	@ApiProperty({ example: UserRole.User, enum: UserRole })
	role: string;

	@ApiProperty()
	isEmailVerified: boolean;

	@ApiProperty({ example: 'false' })
	isAccountDeactivated: boolean;
}

export class UserLoginSuccessResponse extends SuccessResponse {
	@ApiProperty({ type: IUserResponse })
	result?: IUserResponse;
}

export class OtpSuccessSendResponse extends SuccessResponse {
	@ApiProperty({
		type: 'object',
		properties: { otpSend: { type: 'boolean' } },
	})
	result: { otpSend: boolean };
}

export class OtpSuccessVerifyResponse extends SuccessResponse {
	@ApiProperty({
		type: 'object',
		properties: { verified: { type: 'boolean' } },
	})
	result: { verified: boolean };
}

export class ChangedPasswordApiResponse extends SuccessResponse {
	@ApiProperty({
		type: 'object',
		properties: { changedPassword: { type: 'boolean' } },
	})
	result: { changedPassword: boolean };
}
