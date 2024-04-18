import { Module } from '@nestjs/common';
import { OtpVerificationService } from './otp-verification.service';
import { OtpVerificationController } from './otp-verification.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/users.schema';
import { OtpVerificationSchema } from './otp-verification.schema';

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forFeature([
			{
				name: 'User',
				schema: UserSchema,
			},
			{
				name: 'OtpVerification',
				schema: OtpVerificationSchema,
			},
		]),
	],
	controllers: [OtpVerificationController],
	providers: [OtpVerificationService],
})
export class OtpVerificationModule {}
