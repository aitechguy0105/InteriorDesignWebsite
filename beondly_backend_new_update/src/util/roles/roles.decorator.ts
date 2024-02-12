import { SetMetadata } from '@nestjs/common';
import { UserRole } from './user.roles';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
