import * as Joi from 'joi';
import { Gender } from 'src/constants/common.interface';

export const registrationSchema = Joi.object({
	name: Joi.string().alphanum().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	phone: Joi.number().min(10).required(),
});

export const updateUserAccountDetailsSchema = Joi.object({
	name: Joi.string().alphanum().min(3).max(30).required(),
	description: Joi.string().optional(),
	gender: Joi.string()
		.optional()
		.valid(...Object.values(Gender)),
});

export const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

export const otpValidatorSchema = Joi.object({
	email: Joi.string().email().required(),
});

export const verifyOtpSchema = Joi.object({
	email: Joi.string().email().required(),
	otp: Joi.number().min(6).required(),
});

export const changeForgotPasswordSchema = Joi.object({
	newPassword: Joi.string().min(6).required(),
	email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object({
	newPassword: Joi.string().min(6).required(),
	oldPassword: Joi.string().min(6).required(),
});
