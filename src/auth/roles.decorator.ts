import { SetMetadata } from '@nestjs/common';
import type { UserType } from 'src/users/dto/user.interface';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
