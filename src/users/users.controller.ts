import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { RolesGuard } from 'src/roles/guards/roles.guard'
import { Roles } from 'src/roles/roles.decorator'

// enum
import { RoleEnum } from 'src/roles/roles.enum'

// dto
import { CreateUserDto } from './dto/create-user.dto'

// services
import { UsersService } from './users.service'

@Controller('/api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async get() {
        const results = await this.usersService.getAll()

        return {
            results
        }
    }

    @Post()
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto)
    }

    @Post('admin')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    createAdmin(@Body() userDto: CreateUserDto) {
        return this.usersService.createAdmin(userDto)
    }
}