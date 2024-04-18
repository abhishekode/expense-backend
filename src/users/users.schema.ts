import type { Document } from 'mongoose';
import { Schema } from 'mongoose';
import type { Gender } from './dto/user.interface';
import { SignupType, UserType } from './dto/user.interface';

export interface User extends Document {
	firstName: string;
	lastName: string;
	phone: number;
	countryCode: string;
	email: string;
	password: string;
	role: UserType;
	isMobileVerified: boolean;
	isEmailVerified: boolean;
	isAccountDeactivated: boolean;
	signupMethod: SignupType;
	Otp?: number;
	mobileOtp?: number;
	otpExpireTime?: Date;
	resetPasswordToken?: string;
	dob?: string;
	description?: string;
	gender?: Gender;
	_doc: unknown;
}

const userSchemaFields = {
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phone: { type: Number, required: true, unique: true },
	countryCode: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	role: {
		type: String,
		enum: Object.values(UserType),
		required: true,
		default: UserType.Passenger,
	},
	isMobileVerified: { type: Boolean, default: true },
	isEmailVerified: { type: Boolean, default: false },
	isAccountDeactivated: { type: Boolean, default: false },
	signupMethod: {
		type: String,
		enum: Object.values(SignupType),
		required: true,
		default: SignupType.Custom,
	},
	Otp: { type: Number },
	otpExpireTime: { type: Date },
	resetPasswordToken: { type: String },
	dob: { type: String, required: false },
	description: { type: String, required: false },
	gender: { type: String, required: false },
};

const userSchemaOptions = {
	timestamps: true,
};

export const UserSchema = new Schema<User>(userSchemaFields, userSchemaOptions);
