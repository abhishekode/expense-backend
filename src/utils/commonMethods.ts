import type { UserType } from 'src/users/dto/user.interface';
import type { User } from 'src/users/users.schema';
interface JwtTokenPayload {
	id: string;
	email: string;
	role: UserType;
}
interface IResponseData {
	status: boolean;
	result?: any;
	message?: string;
}

export const sendResponse = (res: IResponseData): any => {
	const { status, result, message } = res;
	return {
		status: status,
		result: result,
		message: message,
	};
};

export const getPaginationOptions = (page: number, size: number) => {
	const defaultPage = 1;
	const defaultSize = 10;
	const maxPageSize = 100;

	const normalizedPage = Math.max(defaultPage, page || defaultPage);
	const normalizedSize = Math.min(
		maxPageSize,
		Math.min(defaultSize, size || defaultSize)
	);

	const skip = (normalizedPage - 1) * normalizedSize;
	const limit = normalizedSize;

	return { skip, limit };
};

export const generateOtpAndExpiryTime = (): {
	otp: number;
	otpExpireTime: Date;
} => {
	// Generate new OTP
	const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
	const otpExpireTime = new Date(Date.now() + 1 * 60000); // OTP expiry time, 1 minutes from now

	return { otp, otpExpireTime };
};

export const generateTokenPayload = (user: User): JwtTokenPayload => {
	const payload = {
		id: user._id,
		email: user.email,
		role: user.role,
	};
	return payload;
};
