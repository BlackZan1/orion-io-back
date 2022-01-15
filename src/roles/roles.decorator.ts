import { SetMetadata } from '@nestjs/common'

// enum
import { RoleEnum } from './roles.enum'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles)