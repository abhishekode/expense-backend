import {
	Controller,
	Post,
	Body,
	UsePipes,
	Put,
	UseGuards,
	Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
	ChangeForgotPasswordDto,
	ChangePasswordDto,
	LoginUserDto,
	ResendOtpDto,
	SwitchUserRoleDto,
	updateUserAccountDetailsDto,
	verifyEmailOtpDto,
} from './dto/create-user.dto';
import { JoiValidationPipe } from 'src/middleware/validation.pipe';
import {
	verifyOtpSchema,
	loginSchema,
	otpValidatorSchema,
	changePasswordSchema,
	updateUserAccountDetailsSchema,
	changeForgotPasswordSchema,
	ChangeUserRoleSchema,
} from './dto/joi-schema.dto';
import { UserType } from './dto/user.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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
} from './dto/user.swaggerResponse';

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

	@Post('login')
	@ApiResponse({ status: 200, type: UserLoginSuccessResponse })
	@UsePipes(new JoiValidationPipe(loginSchema))
	login(@Body() requestData: LoginUserDto) {
		return this.usersService.login(requestData);
	}

	@Put('forgot-password')
	@ApiResponse({ status: 200, type: OtpSuccessSendResponse })
	@UsePipes(new JoiValidationPipe(otpValidatorSchema))
	async forgotPassword(@Body() args: ResendOtpDto) {
		const { email } = args;
		return this.usersService.resendOtp(email, true);
	}

	@Put('resend-forgot-password-otp')
	@ApiResponse({ status: 200, type: OtpSuccessSendResponse })
	@UsePipes(new JoiValidationPipe(otpValidatorSchema))
	async resendForgotPasswordOtp(@Body() args: ResendOtpDto) {
		return this.usersService.resendOtp(args.email, true);
	}

	@Put('verify-otp')
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
	@Roles(UserType.Driver, UserType.Passenger)
	@UseGuards(AuthGuard, RolesGuard)
	@UsePipes(new JoiValidationPipe(changePasswordSchema))
	async changeCurrentPassword(@Body() args: ChangePasswordDto, @Request() req) {
		const email = req.user.email;
		return this.usersService.changePassword(email, args, false);
	}

	// TODO: Add here JWT verifier as middleware
	@Post('deactivate-account')
	@ApiResponse({ status: 200, type: SuccessResponse })
	@Roles(UserType.Driver, UserType.Passenger)
	@UseGuards(AuthGuard, RolesGuard)
	async deactivateAccount(@Request() req) {
		const email = req.user.email;
		return this.usersService.deactivateAccount(email);
	}

	// TODO: Add here JWT verifier as middleware
	@Put('account')
	@ApiResponse({ status: 200, type: SuccessResponse })
	@Roles(UserType.Driver)
	@UseGuards(AuthGuard, RolesGuard)
	@UsePipes(new JoiValidationPipe(updateUserAccountDetailsSchema))
	async updateUserAccountDetails(
		@Body() requestData: updateUserAccountDetailsDto,
		@Request() req
	) {
		const email = req.user.email;

		return this.usersService.updateUserAccountDetails(email, requestData);
	}

	@Put('switch-role')
	@ApiResponse({ status: 200, type: UserLoginSuccessResponse })
	@Roles(UserType.Driver, UserType.Passenger)
	@UseGuards(AuthGuard, RolesGuard)
	async userSwitchRole(
		@Body(new JoiValidationPipe(ChangeUserRoleSchema))
		requestData: SwitchUserRoleDto,
		@Request() req
	) {
		const email = req.user.email;
		const userRole = requestData.role as UserType;
		return this.usersService.changeUserRole(email, userRole);
	}
}
