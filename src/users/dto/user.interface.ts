export enum UserType {
	Passenger = 'passenger',
	Driver = 'driver',
	Admin = 'admin',
}

export enum UserTypeUpdate {
	Passenger = 'passenger',
	Driver = 'driver',
}
export enum Gender {
	Male = 'male',
	Female = 'female',
	Other = 'other',
}

export enum SignupType {
	Custom = 'custom',
	Facebook = 'facebook',
	Gmail = 'Gmail',
}

export interface LoginUser {
	email: string;
	password: string;
}

export interface MobileVerifiedType {
	phone: number;
	mobileOtp: number;
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
