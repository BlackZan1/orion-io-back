import { 
    BadRequestException,
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
import { 
    ApiBearerAuth, 
    ApiBody, 
    ApiOperation, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger'

// services
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'
import { FilesService } from 'src/files/files.service'
import { TokensService } from 'src/tokens/tokens.service'
import { StudySpaceService } from 'src/study-space/study-space.service'
import { GroupsService } from 'src/groups/groups.service'

// dto
import { CreateUserDto, CreateUserTokenDto } from 'src/users/dto/create-user.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { SignInDto } from './dto/sign-in.dto'

// guards
import { LocalAuthGuard } from './guards/local.guard'
import { JwtAuthGuard } from './guards/jwt.guard'

// decorators
import { Public } from './public.decorator'

// schemas
import { User, UserDocument } from 'src/users/schemas/user.schema'
import { Jwt } from './schemas/jwt.schema'

// enum
import { TokenActions } from 'src/tokens/tokens.enum'

// utils
import { MulterFile } from 'utils/multer-storage'

@ApiTags('Authorization')
@ApiBearerAuth()
@Controller('/api/auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private filesService: FilesService,
        private tokensService: TokensService,
        private studySpaceService: StudySpaceService,
        private groupsService: GroupsService
    ) {}

    @ApiOperation({ summary: 'Регистрация - Публичный' })
    @ApiResponse({ status: 201, type: User })
    @Public()
    @Post('register')
    @UseInterceptors(FileInterceptor('photo'))
    @HttpCode(201)
    async create(@Body() dto: CreateUserTokenDto, @UploadedFile() file: MulterFile) {
        const token = await this.tokensService.check(dto.token)

        if(!token.action) throw new BadRequestException('Action is not valid!')

        let newDto = { 
            ...dto,
            studySpace: token.studySpaceId
        }

        if(file) {
            const photo = await this.filesService.uploadFile(file)

            newDto.photo = photo.filename as any
        }

        let user: UserDocument
        let isModerator = false

        switch(token.action) {
            case TokenActions.createUser:
                user = await this.usersService.createUser(newDto)

                break
            case TokenActions.createSuperUser:
                user = await this.usersService.createSuperUser(newDto)

                break
            case TokenActions.createAdmin:
                user = await this.usersService.createAdmin(newDto)
                isModerator = true
                
                break
            case TokenActions.createTeacher:
                user = await this.usersService.createTeacher(newDto)

                break
            default:
                break
        }
        
        if(token.groupId) {
            await this.groupsService.addUser(token.groupId, user.id, user.studySpace)
        }
        else if(isModerator) {
            await this.groupsService.addSuperUser(user.id, user.studySpace)
        }

        await this.tokensService.delete(dto.token)

        return user
    }

    @ApiOperation({ summary: 'Регистрация админа (ДЕМО) - Публичный' })
    @ApiResponse({ status: 201, type: User })
    @Public()
    @Post('register-admin')
    @UseInterceptors(FileInterceptor('photo'))
    @HttpCode(201)
    async createAdmin(@Body() dto: CreateUserDto, @UploadedFile() file: MulterFile) {
        let newDto = { ...dto }

        if(file) {
            const photo = await this.filesService.uploadFile(file)

            newDto.photo = photo.filename as any
        }

        return this.usersService.createAdmin(newDto)
    }

    @ApiOperation({ summary: 'Вход - Публичный' })
    @ApiResponse({ status: 200, type: User })
    @ApiBody({ type: SignInDto })
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(200)
    async login(@Request() req) {
        const { user } = req

        return this.authService.getToken({ 
            userId: user._id,
            studySpaceId: user.studySpace._id,
            role: user.role.value
        })
    }

    @Public()
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
    async me(@Request() req) {
        const { user } = req

        const studySpace = await this.studySpaceService.getById(user.studySpace._id, user._id)

        return {
            user,
            studySpace
        }
    }
}