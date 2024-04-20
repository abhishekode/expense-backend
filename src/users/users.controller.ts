import {
	Controller,
	Post,
	Body,
	UsePipes,
	Put,
	UseGuards,
	Request,
	Get,
	UseInterceptors,
	UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
	ChangeForgotPasswordDto,
	ChangePasswordDto,
	LoginUserDto,
	ResendOtpDto,
	UpdateUserDto,
	verifyEmailOtpDto,
	CreateUserDto,
} from './dto/create-user.dto';
import { JoiValidationPipe } from 'src/middleware/validation.pipe';
import {
	verifyOtpSchema,
	loginSchema,
	otpValidatorSchema,
	changePasswordSchema,
	updateUserAccountDetailsSchema,
	changeForgotPasswordSchema,
	registrationSchema,
} from './dto/joi-schema.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import {
	BadRequestResponse,
	NotFoundResponse,
	SuccessResponse,
} from 'src/constants/common.swagger';
import {
	UserLoginSuccessResponse,
	OtpSuccessSendResponse,
	OtpSuccessVerifyResponse,
	ChangedPasswordApiResponse,
	IUserResponse,
} from './dto/user.swaggerResponse';
import { UserRole } from 'src/constants/common.interface';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@Controller('users')
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
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('register')
	@ApiResponse({ status: 200, type: UserLoginSuccessResponse })
	@UsePipes(new JoiValidationPipe(registrationSchema))
	create(@Body() requestData: CreateUserDto) {
		return this.usersService.createNewUser(requestData);
	}

	@Post('login')
	@ApiResponse({ status: 200, type: UserLoginSuccessResponse })
	@UsePipes(new JoiValidationPipe(loginSchema))
	login(@Body() requestData: LoginUserDto) {
		return this.usersService.login(requestData);
	}

	@Post('forgot-password')
	@ApiResponse({ status: 200, type: OtpSuccessSendResponse })
	@UsePipes(new JoiValidationPipe(otpValidatorSchema))
	async forgotPassword(@Body() args: ResendOtpDto) {
		const { email } = args;
		return this.usersService.resendOtp(email, true);
	}

	@Post('resend-forgot-password-otp')
	@ApiResponse({ status: 200, type: OtpSuccessSendResponse })
	@UsePipes(new JoiValidationPipe(otpValidatorSchema))
	async resendForgotPasswordOtp(@Body() args: ResendOtpDto) {
		return this.usersService.resendOtp(args.email, true);
	}

	@Post('verify-otp')
	@ApiResponse({ status: 200, type: OtpSuccessVerifyResponse })
	@UsePipes(new JoiValidationPipe(verifyOtpSchema))
	async verifyEmailOtp(@Body() args: verifyEmailOtpDto) {
		const { email, otp } = args;
		return this.usersService.verifyEmailOtp(email, otp);
	}

	@Put('change-forgot-password')
	@ApiResponse({ status: 200, type: ChangedPasswordApiResponse })
	@UsePipes(new JoiValidationPipe(changeForgotPasswordSchema))
	async changeForgotPassword(@Body() args: ChangeForgotPasswordDto) {
		const { newPassword, email } = args;
		return this.usersService.changePassword(email, { newPassword }, true);
	}

	@Put('change-password')
	@ApiResponse({ status: 200, type: ChangedPasswordApiResponse })
	@ApiBearerAuth()
	@Roles(UserRole.Admin, UserRole.User)
	@UseGuards(AuthGuard, RolesGuard)
	@UsePipes(new JoiValidationPipe(changePasswordSchema))
	async changeCurrentPassword(@Body() args: ChangePasswordDto, @Request() req) {
		const email = req.user.email;
		return this.usersService.changePassword(email, args, false);
	}

	@Put('account')
	@ApiResponse({ status: 200, type: SuccessResponse })
	@ApiBearerAuth()
	@Roles(UserRole.Admin, UserRole.User)
	@UseGuards(AuthGuard, RolesGuard)
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FilesInterceptor('profileImg'))
	async updateUserAccountDetails(
		@Body(new JoiValidationPipe(updateUserAccountDetailsSchema))
		requestData: UpdateUserDto,
		@Request() req,
		@UploadedFiles() file: Express.Multer.File
	) {
		const email = req.user.email;

		return this.usersService.updateUserAccountDetails(email, requestData, file);
	}

	@Post('deactivate-account')
	@ApiResponse({ status: 200, type: SuccessResponse })
	@ApiBearerAuth()
	@Roles(UserRole.Admin, UserRole.User)
	@UseGuards(AuthGuard, RolesGuard)
	async deactivateAccount(@Request() req) {
		const email = req.user.email;
		return this.usersService.deactivateAccount(email);
	}

	@Get('profile')
	@ApiBearerAuth()
	@ApiResponse({ status: 200, type: IUserResponse })
	@Roles(UserRole.Admin, UserRole.User)
	@UseGuards(AuthGuard, RolesGuard)
	async getUserProfile(@Request() req) {
		const email = req.user.email;
		return this.usersService.getUserProfile(email);
	}
}
