import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// schemas
import { Role, RoleDocument } from './schemas/role.schema'

// dto
import { CreateRoleDto } from './dto/create-role.dto'

// enum
import { RoleEnum } from './roles.enum'

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>
    ) {}

    async create(dto: CreateRoleDto): Promise<Role> {
        return new this.roleModel(dto).save()
    }

    async getAll(): Promise<Role[]> {
        return this.roleModel.find({})
    }

    async getAdmin(): Promise<Role> {
        return this.roleModel.findOne({ value: RoleEnum.Admin })
    }

    async getSuperUser(): Promise<Role> {
        return this.roleModel.findOne({ value: RoleEnum.SuperUser })
    }

    async getUser(): Promise<Role> {
        return this.roleModel.findOne({ value: RoleEnum.User })
    }
}