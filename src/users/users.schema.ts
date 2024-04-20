import type { Document } from 'mongoose';
import { Schema } from 'mongoose';
import type { Gender } from 'src/constants/common.interface';
import { UserRole } from 'src/constants/common.interface';

export interface User extends Document {
	name: string;
	email: string;
	phone: number;
	password: string;
	role: UserRole;
	isEmailVerified: boolean;
	isAccountDeactivated: boolean;
	otp?: number;
	otpExpireTime?: Date;
	resetPasswordToken?: string;
	description?: string;
	gender?: Gender;
	profileImg?: string;
	_doc: unknown;
}

const userSchemaFields = {
	name: { type: String, required: true },
	phone: { type: Number, required: true, unique: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	role: {
		type: String,
		enum: Object.values(UserRole),
		default: UserRole.User,
	},
	isEmailVerified: { type: Boolean, default: false },
	isAccountDeactivated: { type: Boolean, default: false },
	otp: { type: Number },
	otpExpireTime: { type: Date },
	resetPasswordToken: { type: String },
	description: { type: String, required: false },
	gender: { type: String, required: false },
	profileImg: { type: String, required: false },
};

const userSchemaOptions = {
	timestamps: true,
};

export const UserSchema = new Schema<User>(userSchemaFields, userSchemaOptions);
