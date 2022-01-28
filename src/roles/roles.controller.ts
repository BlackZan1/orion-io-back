import { Body, Controller, Get, Post } from '@nestjs/common'
import { 
    ApiBearerAuth, 
    ApiOperation, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger'

// dto
import { CreateRoleDto } from './dto/create-role.dto'

// services
import { RolesService } from './roles.service'

// schemas
import { Role } from './schemas/role.schema'

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('/api/roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @ApiOperation({ summary: 'Создание роли (ДЕМО)' })
    @ApiResponse({ status: 201, type: Role })
    @Post()
    async create(@Body() roleDto: CreateRoleDto) {
        console.log(roleDto)

        return this.rolesService.create(roleDto)
    }

    @ApiOperation({ summary: 'Получение всех ролей (ДЕМО)' })
    @ApiResponse({ status: 200, type: [Role] })
    @Get()
    async get() {
        return this.rolesService.getAll()
    }
}
