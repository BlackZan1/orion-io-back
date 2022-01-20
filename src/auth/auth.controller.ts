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

@Controller('/api/auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private filesService: FilesService
    ) {}

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