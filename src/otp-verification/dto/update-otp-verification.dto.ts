import { PartialType } from '@nestjs/swagger';
import { sendMobileVerificationOtpDto } from './otp-verification.dto';

export class UpdateOtpVerificationDto extends PartialType(
	sendMobileVerificationOtpDto
) {}
