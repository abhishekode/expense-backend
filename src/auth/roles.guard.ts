import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserType } from 'src/users/dto/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { User } from 'src/users/users.schema';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		@InjectModel('User') private readonly userModel: Model<User>
		// @InjectModel('Admin') private readonly adminModel: Model<IAdmin>
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		);
		if (!requiredRoles) {
			return false;
		}
		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user || !user.id) {
			return false;
		}
		if (user.role === UserType.Driver) {
			const isDriver = await this.userModel.findById(user.id);
			if (!isDriver) {
				return false;
			}
			return true;
		}
		if (user.role === UserType.Admin) {
			// const adminDetails = await this.adminModel.findById(user.id);

			// if (!adminDetails.isActive) {
			// 	return false;
			// }
			return true;
		} else {
			const isUser = await this.userModel.findById(user.id);

			if (!isUser || isUser.isAccountDeactivated) {
				throw new UnauthorizedException(
					'Your account is deactivated. Please connect support for reactivate account. '
				);
			}
		}

		return requiredRoles.some((role) => user.role?.includes(role));
	}
}
