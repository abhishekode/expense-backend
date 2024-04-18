import type { Document } from 'mongoose';
import { Schema } from 'mongoose';
import { VerificationType } from './dto/otp-verification.interface';

export interface OtpVerification extends Document {
	phone: number;
	otp: number;
	verificationFor: VerificationType;
	otpExpireTime?: Date;
}

const otpVerificationSchemaFields = {
	phone: { type: Number, required: true, unique: true },
	verificationFor: {
		type: String,
		enum: Object.values(VerificationType),
		required: true,
		default: VerificationType.MobileNumberVerification,
	},
	otp: { type: Number },
	otpExpireTime: { type: Date },
};

const otpVerificationSchemaOptions = {
	timestamps: true,
};

export const OtpVerificationSchema = new Schema<OtpVerification>(
	otpVerificationSchemaFields,
	otpVerificationSchemaOptions
);
