import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { OtpVerificationModule } from './otp-verification/otp-verification.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(process.env.DATABASE_URL),
		MailerModule.forRoot({
			transport: {
				host: process.env.EMAIL_HOST,
				port: 587,
				secure: false,
				auth: {
					user: process.env.EMAIL,
					pass: process.env.EMAIL_PASSWORD,
				},
			},
		}),
		UsersModule,
		OtpVerificationModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule { }
