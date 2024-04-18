/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { OtpVerificationService } from './otp-verification.service';
import { JoiValidationPipe } from 'src/middleware/validation.pipe';
import {
	mobileOtpVerificationSchema,
	resendMobileVerificationOTPSchema,
	sendMobileVerificationOTPSchema,
} from './dto/joi-schema.dto';
import {
	mobileOtpVerificationDto,
	resendMobileVerificationOtpDto,
	sendMobileVerificationOtpDto,
} from './dto/otp-verification.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginSuccessResponse } from 'src/users/dto/user.swaggerResponse';
import {
	BadRequestResponse,
	NotFoundResponse,
	SuccessResponse,
} from 'src/constants/common.swagger';

@ApiTags('Otp verification')
@Controller('otp-verification')
@ApiResponse({
	status: 404,
	description: 'Not Found',
	type: NotFoundResponse,
})
@ApiResponse({
	status: 400,
	description: 'Bad Request',
	type: BadRequestResponse,
})
export class OtpVerificationController {
	constructor(
		private readonly otpVerificationService: OtpVerificationService
	) {}
	@ApiOperation({
		description: 'Send mobile verification code on phone number',
	})
	@Post('/send-mobile-verification-otp')
	@ApiResponse({ status: 200, type: SuccessResponse })
	@UsePipes(new JoiValidationPipe(sendMobileVerificationOTPSchema))
	sendMobileOtpVerification(
		@Body() sendMobileVerificationOtpDto: sendMobileVerificationOtpDto
	) {
		return this.otpVerificationService.sendMobileVerificationOtp(
			sendMobileVerificationOtpDto
		);
	}

	@Post('/resend-mobile-verification-otp')
	@ApiResponse({ status: 200, type: SuccessResponse })
	@UsePipes(new JoiValidationPipe(resendMobileVerificationOTPSchema))
	resendMobileOtpVerification(
		@Body() resendMobileVerificationOtpDto: resendMobileVerificationOtpDto
	) {
		return this.otpVerificationService.resendMobileVerificationOtp(
			resendMobileVerificationOtpDto
		);
	}

	@Post('/mobile-otp-verification')
	@ApiResponse({ status: 200, type: UserLoginSuccessResponse })
	@UsePipes(new JoiValidationPipe(mobileOtpVerificationSchema))
	mobileOtpVerification(
		@Body() mobileOtpVerificationDto: mobileOtpVerificationDto
	) {
		return this.otpVerificationService.mobileOtpVerification(
			mobileOtpVerificationDto
		);
	}
}
