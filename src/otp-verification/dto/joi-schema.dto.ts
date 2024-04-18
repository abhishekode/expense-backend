import * as Joi from 'joi';
import {
	countryCodeSchema,
	phoneSchema,
} from 'src/constants/common.joi-validation';
import { UserType } from 'src/users/dto/user.interface';

export const sendMobileVerificationOTPSchema = Joi.object({
	email: Joi.string().email().required(),
	countryCode: countryCodeSchema,
	phone: phoneSchema,
});

export const resendMobileVerificationOTPSchema = Joi.object({
	countryCode: countryCodeSchema,
	phone: phoneSchema,
});

export const mobileOtpVerificationSchema = Joi.object({
	countryCode: countryCodeSchema,
	phone: phoneSchema,
	otp: Joi.number().min(10).required(),

	firstName: Joi.string().alphanum().min(3).max(30).required(),
	lastName: Joi.string().alphanum().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	role: Joi.string()
		.optional()
		.valid(...Object.values(UserType)),
});
