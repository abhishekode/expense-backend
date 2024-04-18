import { BadRequestException, Injectable } from '@nestjs/common';
import type {
	mobileOtpVerificationDto,
	resendMobileVerificationOtpDto,
	sendMobileVerificationOtpDto,
} from './dto/otp-verification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { User } from 'src/users/users.schema';
import {
	generateOtpAndExpiryTime,
	generateTokenPayload,
	sendResponse,
} from 'src/utils/commonMethods';
import type { OtpVerification } from './otp-verification.schema';
import { generateHashPassword } from 'src/utils/password';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OtpVerificationService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		@InjectModel('OtpVerification')
		private OtpVerificationModel: Model<OtpVerification>,
		private jwtService: JwtService
	) {}

	async sendMobileVerificationOtp(
		sendMobileVerificationOtpDto: sendMobileVerificationOtpDto
	) {
		// Check if user with same email already registered in past
		const userWithSameEmailCount = await this.userModel
			.countDocuments({ email: sendMobileVerificationOtpDto.email })
			.exec();
		if (userWithSameEmailCount)
			throw new BadRequestException('Email is already in use');

		// Check if user with same phone number already registered in past
		const userWithSamePhoneCount = await this.userModel
			.countDocuments({ phone: sendMobileVerificationOtpDto.phone })
			.exec();
		if (userWithSamePhoneCount)
			throw new BadRequestException('Phone number is already in use');

		//  Generate OTP and expiry time for verifying the mobile number
		const { otp, otpExpireTime } = generateOtpAndExpiryTime();

		// Check if user already resuted in past for mobile verification and record exist in db
		const existingRequestedRecord = await this.OtpVerificationModel.findOne({
			phone: sendMobileVerificationOtpDto.phone,
		});
		if (existingRequestedRecord) {
			existingRequestedRecord.otp = otp;
			existingRequestedRecord.otpExpireTime = otpExpireTime;
			existingRequestedRecord.save();
		} else {
			new this.OtpVerificationModel({
				phone: sendMobileVerificationOtpDto.phone,
				otp,
				otpExpireTime,
			}).save();
		}

		const data = sendResponse({
			status: true,
			message: 'Otp sent successfully',
		});
		return data;

		// TODO: We need to send SMS OTP  here using Twilio or any other service provider to mobile number
	}

	async resendMobileVerificationOtp(
		resendMobileVerificationOtpDto: resendMobileVerificationOtpDto
	) {
		// // Check if user with same phone number already registered in past
		const userWithSamePhoneCount = await this.userModel
			.countDocuments({
				phone: resendMobileVerificationOtpDto.phone,
				isMobileVerified: true,
			})
			.exec();
		if (userWithSamePhoneCount)
			throw new BadRequestException('Your number is already verified');

		// //  Generate OTP and expiry time for verifying the mobile number
		const { otp, otpExpireTime } = generateOtpAndExpiryTime();

		// // Check if user already resuted in past for mobile verification and record exist in db
		const existingRequestedRecord = await this.OtpVerificationModel.findOne({
			phone: resendMobileVerificationOtpDto.phone,
		});
		if (existingRequestedRecord) {
			existingRequestedRecord.otp = otp;
			existingRequestedRecord.otpExpireTime = otpExpireTime;
			existingRequestedRecord.save();
		} else {
			new this.OtpVerificationModel({
				phone: resendMobileVerificationOtpDto.phone,
				otp,
				otpExpireTime,
			}).save();
		}

		const data = sendResponse({
			status: true,
			message: 'Otp sent successfully',
		});
		return data;
		// TODO: We need to send SMS OTP  here using Twilio or any other service provider to mobile number
	}

	async mobileOtpVerification(
		mobileOtpVerificationDto: mobileOtpVerificationDto
	) {
		// Fetch otp record from db and verify either it's correct or not expired
		const getOtpRecord = await this.OtpVerificationModel.findOne({
			phone: mobileOtpVerificationDto.phone,
		});

		if (!getOtpRecord)
			throw new BadRequestException('Something went wrong, Please try again');

		// Need to check  whether provided OTP is correct or not
		if (getOtpRecord.otp !== mobileOtpVerificationDto.otp) {
			throw new BadRequestException('Invalid OTP');
		}

		// We get valid record from db. Now need to check  whether it has been expired or not
		if (getOtpRecord.otpExpireTime < new Date()) {
			throw new BadRequestException('OTP is expired.');
		}

		// In the meantime if user verify with OTP if someone registered with same email. Just on a safer side
		const userWithSameEmailCount = await this.userModel
			.countDocuments({ email: mobileOtpVerificationDto.email })
			.exec();
		if (userWithSameEmailCount)
			throw new BadRequestException(
				'Someone else already used your email address. Please use another email.'
			);

		// In the meantime if user verify with OTP if someone registered with same email. Just on a safer side
		const userWithSamePhoneCount = await this.userModel
			.countDocuments({ phone: mobileOtpVerificationDto.phone })
			.exec();
		if (userWithSamePhoneCount)
			throw new BadRequestException(
				'Someone else already used your phone number. Please use another phone number.'
			);

		// We're good now we need to register new user  in our User collection and remove otp  record from OtpCollection
		const hashedPassword = await generateHashPassword(
			mobileOtpVerificationDto.password
		);

		delete mobileOtpVerificationDto.otp;

		const newUser = await new this.userModel({
			...mobileOtpVerificationDto,
			password: hashedPassword,
		}).save();
		const newUserDoc = newUser._doc as unknown as User;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: pass, ...rest } = newUserDoc;

		// Now need to remove entry from the otpCollection
		await this.OtpVerificationModel.deleteMany({
			phone: mobileOtpVerificationDto.phone,
		});

		const payload = generateTokenPayload(newUser);
		const token = await this.jwtService.signAsync(payload);

		const data = sendResponse({
			status: true,
			result: { token, user: { ...rest } },
			message: 'user logged-in successfully',
		});
		return data;
	}
}
