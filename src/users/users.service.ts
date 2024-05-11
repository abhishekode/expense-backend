import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type {
	ChangePasswordDto,
	CreateUserDto,
	LoginUserDto,
	UpdateUserDto,
} from './dto/create-user.dto';
import { Model } from 'mongoose';
import type { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
	matchPassword,
	generateHashPassword,
	generatePasswordResetToken,
} from 'src/utils/password';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import {
	generateOtpAndExpiryTime,
	generateTokenPayload,
	sendResponse,
} from 'src/utils/commonMethods';
import { CloudinaryService } from 'src/utils/cloudinary';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel('User')
		private readonly userModel: Model<User>,
		private jwtService: JwtService,
		private mailService: MailerService,
		private cloudinaryService: CloudinaryService
	) {}

	private async findUserByEmail(email: string): Promise<User> {
		const user = await this.userModel.findOne({ email }).exec();

		if (!user) {
			throw new NotFoundException('user not found with email!');
		}

		return user;
	}

	private async verifyOldPassword(
		user: User,
		oldPassword: string
	): Promise<void> {
		const isPasswordMatch = await matchPassword(oldPassword, user.password);
		if (!isPasswordMatch) {
			throw new BadRequestException('Old password is incorrect.');
		}
	}

	private async verifyResetToken(user: User, email: string): Promise<void> {
		if (!user.resetPasswordToken) {
			throw new BadRequestException('First send reset password');
		}
		const combinedData = `${user._id}${email}`;
		const isTokenValid = await matchPassword(
			combinedData,
			user.resetPasswordToken
		);
		if (!isTokenValid) {
			throw new BadRequestException('Token is invalid.');
		}
	}

	private async sendOtpEmail(email: string, otp: number): Promise<void> {
		const message = `Welcome to RAD, Please verify your email, Your OTP: ${otp}!`;
		await this.mailService.sendMail({
			from: process.env.EMAIL_HOST,
			to: email,
			subject: `Your OTP for registration`,
			text: message,
		});
	}

	async createNewUser(createUser: CreateUserDto) {
		const { email, password, phone } = createUser;
		const userWithSameEmailCount = await this.userModel
			.countDocuments({ email })
			.exec();
		if (userWithSameEmailCount)
			throw new BadRequestException(
				'Someone else already used your email address. Please use another email.'
			);

		// In the meantime if user verify with OTP if someone registered with same email. Just on a safer side
		const userWithSamePhoneCount = await this.userModel
			.countDocuments({ phone })
			.exec();
		if (userWithSamePhoneCount)
			throw new BadRequestException(
				'Someone else already used your phone number. Please use another phone number.'
			);

		// We're good now we need to register new user  in our User collection
		const hashedPassword = await generateHashPassword(password);
		const { otp, otpExpireTime } = generateOtpAndExpiryTime();

		await new this.userModel({
			...createUser,
			password: hashedPassword,
			otp,
			otpExpireTime,
		}).save();

		this.sendOtpEmail(email, otp);

		const data = sendResponse({
			status: true,
			result: { otpSend: true },
			message: 'New user created successfully, Please verify your email!',
		});
		return data;
	}

	async resendOtp(email: string, isResetPassword = false) {
		const user = await this.findUserByEmail(email);
		const { otp, otpExpireTime } = generateOtpAndExpiryTime();

		user.otp = otp;
		user.otpExpireTime = otpExpireTime;
		if (isResetPassword) {
			user.resetPasswordToken = await generatePasswordResetToken(
				email,
				user._id
			);
		}
		await user.save();

		await this.sendOtpEmail(email, otp);
		const data = sendResponse({
			status: true,
			result: { otpSend: true },
			message: 'Otp sent successfully',
		});
		return data;
	}

	async verifyEmailOtp(email: string, otp: number) {
		const emailOtp = parseInt(otp.toString());
		const user = await this.findUserByEmail(email);
		if (user.otp !== emailOtp || user.otpExpireTime < new Date()) {
			throw new BadRequestException('OTP is invalid or expired.');
		}

		user.otp = undefined;
		user.otpExpireTime = undefined;
		user.isEmailVerified = true;
		await user.save();

		const data = sendResponse({
			status: true,
			result: { verified: true },
			message: 'Email verified successfully',
		});
		return data;
	}

	async login(userData: LoginUserDto) {
		const { email, password } = userData;
		const user = await this.findUserByEmail(email);

		const isPasswordMatch = await matchPassword(password, user.password);
		if (!isPasswordMatch) {
			throw new BadRequestException('Password is incorrect.');
		}

		if (user.isAccountDeactivated)
			throw new BadRequestException(
				'Your account is deactivated. Please connect support for reactivate account.'
			);

		const newUserDoc = user._doc as unknown as User;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: pass, ...rest } = newUserDoc;

		const payload = generateTokenPayload(user);
		const token = await this.jwtService.signAsync(payload);

		const data = sendResponse({
			status: true,
			result: { token, ...rest },
			message: 'user logged-in successfully',
		});
		return data;
	}

	async changePassword(
		email: string,
		changePasswordDto: ChangePasswordDto,
		isForgotPassword: boolean
	) {
		const user = await this.findUserByEmail(email);

		if (isForgotPassword) {
			await this.verifyResetToken(user, email);
		} else {
			await this.verifyOldPassword(user, changePasswordDto.oldPassword);
		}

		const newPasswordHash = await generateHashPassword(
			changePasswordDto.newPassword
		);
		user.password = newPasswordHash;
		user.resetPasswordToken = undefined;
		await user.save();

		const data = sendResponse({
			status: true,
			result: { changedPassword: true },
			message: 'Password changes successfully',
		});
		return data;
	}

	async deactivateAccount(email: string) {
		const user = await this.findUserByEmail(email);
		user.isAccountDeactivated = true;
		await user.save();

		const data = sendResponse({
			status: true,
			message: 'Your account is successfully deactivated.',
		});
		return data;
	}

	async updateUserAccountDetails(
		email: string,
		userUpdateData: UpdateUserDto,
		file: Express.Multer.File
	) {
		const user = await this.findUserByEmail(email);
		if (user.profileImg && file.filename) {
			await this.cloudinaryService.deleteImageByUrl(user.profileImg);
		}
		const images = await this.cloudinaryService.uploadImage(file);

		Object.assign(user, userUpdateData);
		user.profileImg = images.url;

		await user.save();

		const data = sendResponse({
			status: true,
			message: 'Your profile details is updated successfully',
		});
		return data;
	}

	async getUserProfile(email: string): Promise<User> {
		const user = await this.findUserByEmail(email);

		if (!user.isEmailVerified)
			throw new BadRequestException(
				'Your email is not verified. Please verify it first'
			);

		const newUserDoc = user._doc as unknown as User;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: pass, ...rest } = newUserDoc;

		const data = sendResponse({
			status: true,
			result: { ...rest },
			message: 'user logged-in successfully',
		});
		return data;
	}
}
