export interface LoginUser {
	email: string;
	password: string;
}

export interface ResendOtpArgs {
	email: string;
}

export interface verifyEmailOtpArgs extends ResendOtpArgs {
	otp: number;
}

export interface ChangeForgotPassword {
	email: string;
	newPassword: string;
}
