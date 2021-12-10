import { Body, Controller, Get, Post } from '@nestjs/common'

// dto
import { CreateUserDto } from './dto/create-user.dto'

// services
import { UsersService } from './users.service'

@Controller('/api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    getAll(): string {
        return `{
            users: []
        }`
    }

    @Post()
    create(@Body() userDto: CreateUserDto) {
        console.log(userDto)
        
        return this.usersService.create(userDto)
    }
}
