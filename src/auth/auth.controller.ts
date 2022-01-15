import { 
    Body, 
    Controller, 
    Get, 
    Headers, 
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from '@nestjs/common'

// services
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'

// dto
import { CreateUserDto } from 'src/users/dto/create-user.dto'

// guards
import { LocalAuthGuard } from './guards/local.guard'
import { JwtAuthGuard } from './guards/jwt.guard'

// decorators
import { Public } from './public.decorator'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Controller('/api/auth')
export class AuthController {
    constructor(
        // private configService: ConfigService,
        private usersService: UsersService,
        private authService: AuthService
    ) {}

    @Public()
    @Post('register')
    @HttpCode(201)
    async create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto)
    }

    @Public()
    @Post('register-admin')
    @HttpCode(201)
    async createAdmin(@Body() userDto: CreateUserDto) {
        return this.usersService.createAdmin(userDto)
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        const { user } = req

        return this.authService.getToken({ 
            userId: user._id,
            studySpaceId: user.studySpace._id,
            role: user.role
        })
    }

    @Post('refresh')
    async refresh(@Body() refreshDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshDto.refreshToken)
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Request() req) {
        return req.user
    }
}