import { 
    Body, 
    Controller, 
    Get, 
    HttpCode,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

// services
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'
import { FilesService } from 'src/files/files.service'

// dto
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

// guards
import { LocalAuthGuard } from './guards/local.guard'
import { JwtAuthGuard } from './guards/jwt.guard'

// decorators
import { Public } from './public.decorator'

// schemas
import { User } from 'src/users/schemas/user.schema'
import { Jwt } from './schemas/jwt.schema'

@ApiTags('Authorization')
@Controller('/api/auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private filesService: FilesService
    ) {}

    @ApiOperation({ summary: 'Регистрация - Публичный' })
    @ApiResponse({ status: 201, type: User })
    @Public()
    @Post('register')
    @UseInterceptors(FileInterceptor('photo'))
    @HttpCode(201)
    async create(@Body() dto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
        let newDto = { ...dto }

        if(file) {
            const photo = await this.filesService.uploadFile(file)

            newDto.photo = photo.filename
        }

        return this.usersService.createUser(newDto)
    }

    @ApiOperation({ summary: 'Регистрация админа (ДЕМО) - Публичный' })
    @ApiResponse({ status: 201, type: User })
    @Public()
    @Post('register-admin')
    @UseInterceptors(FileInterceptor('photo'))
    @HttpCode(201)
    async createAdmin(@Body() dto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
        let newDto = { ...dto }

        if(file) {
            const photo = await this.filesService.uploadFile(file)

            newDto.photo = photo.filename
        }

        return this.usersService.createAdmin(newDto)
    }

    @ApiOperation({ summary: 'Вход - Публичный' })
    @ApiResponse({ status: 200, type: User })
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

    @ApiOperation({ summary: 'Получение нового токена' })
    @ApiResponse({ status: 200, type: Jwt })
    @Post('refresh')
    async refresh(@Body() refreshDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshDto.refreshToken)
    }

    @ApiOperation({ summary: 'Получение данных пользователя' })
    @ApiResponse({ status: 200, type: User })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Request() req) {
        return req.user
    }
}