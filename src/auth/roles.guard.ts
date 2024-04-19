import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ROLES_KEY } from './roles.decorator';
import type { User } from 'src/users/users.schema';
import type { UserRole } from 'src/constants/common.interface';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		@InjectModel('User') private readonly userModel: Model<User>
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		);

		if (!requiredRoles || requiredRoles.length === 0) {
			// No roles are required, so access is granted.
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user || !user.id) {
			// User is not authenticated, access denied.
			throw new UnauthorizedException('Authentication credentials missing.');
		}

		const isUser = await this.userModel.findById(user.id);

		if (!isUser || isUser.isAccountDeactivated) {
			// User not found or account is deactivated.
			throw new UnauthorizedException(
				'Your account is deactivated. Please contact support to reactivate your account.'
			);
		}

		const userRoles = isUser.role || [];
		const hasRequiredRole = requiredRoles.some((role) =>
			userRoles.includes(role)
		);

		if (!hasRequiredRole) {
			// User does not have required roles.
			throw new UnauthorizedException('Insufficient permissions.');
		}

		return true;
	}
}
