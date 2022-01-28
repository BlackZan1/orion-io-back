import { 
    Body, 
    Controller, 
    Get, 
    Post, 
    UseGuards 
} from '@nestjs/common'
import { 
    ApiBearerAuth, 
    ApiOperation, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger'
import { RolesGuard } from 'src/roles/guards/roles.guard'
import { Roles } from 'src/roles/roles.decorator'

// schemas
import { User } from './schemas/user.schema'

// enum
import { RoleEnum } from 'src/roles/roles.enum'

// dto
import { CreateUserDto } from './dto/create-user.dto'

// services
import { UsersService } from './users.service'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: 'Получение всех пользователей (ДЕМО)' })
    @ApiResponse({ status: 200, type: [User] })
    @Get()
    async get() {
        const results = await this.usersService.getAll()

        return {
            results
        }
    }

    @ApiOperation({ summary: 'Создание пользователя (ДЕМО)' })
    @ApiResponse({ status: 201, type: User })
    @Post()
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto)
    }

    @ApiOperation({ summary: 'Создание пользователя-админа (ДЕМО)' })
    @ApiResponse({ status: 201, type: User })
    @Post('admin')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    createAdmin(@Body() userDto: CreateUserDto) {
        return this.usersService.createAdmin(userDto)
    }
}