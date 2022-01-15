import { Body, Controller, Get, Post } from '@nestjs/common'

// dto
import { CreateRoleDto } from './dto/create-role.dto'

// services
import { RolesService } from './roles.service'

@Controller('/api/roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @Post()
    async create(@Body() roleDto: CreateRoleDto) {
        console.log(roleDto)

        return this.rolesService.create(roleDto)
    }

    @Get()
    async get() {
        return this.rolesService.getAll()
    }
}
