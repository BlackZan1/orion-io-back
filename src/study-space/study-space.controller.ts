import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    Query, 
    Request, 
    UploadedFile, 
    UseGuards, 
    UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { 
    ApiBearerAuth, 
    ApiOperation, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger'

// guards
import { RolesGuard } from 'src/roles/guards/roles.guard'

// decorators
import { Roles } from 'src/roles/roles.decorator'

// enum
import { RoleEnum } from 'src/roles/roles.enum'
import { CreateUserDto } from 'src/users/dto/create-user.dto'

// dto
import { CreateStudySpaceDto } from './dto/create-study-space.dto'

// services
import { StudySpaceService } from './study-space.service'
import { FilesService } from 'src/files/files.service'
import { TokensService } from 'src/tokens/tokens.service'
import { UsersService } from 'src/users/users.service'

// schemas
import { StudySpace } from './schemas/study-space.schema'
import { Token } from 'src/tokens/schemas/token.schema'
import { User } from 'src/users/schemas/user.schema'

@ApiTags('Study space (Учебное пространство - основная платформа)')
@ApiBearerAuth()
@Controller('/api/study-space')
export class StudySpaceController {
    constructor(
        private studySpaceService: StudySpaceService,
        private filesService: FilesService,
        private tokensService: TokensService,
        private usersService: UsersService
    ) {}

    @ApiOperation({ summary: 'Создание учебного пространства' })
    @ApiResponse({ status: 201, type: StudySpace })
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(@Body() dto: CreateStudySpaceDto, @Request() req, @UploadedFile() file: Express.Multer.File) {
        const { user } = req
        let newDto = { ...dto }

        if(file) {
            const photo = await this.filesService.uploadFile(file)

            newDto.image = photo.filename
        }

        return this.studySpaceService.create(newDto)
    }

    @ApiOperation({ summary: 'Создание пользователя прямо в учебном пространстве (Полезно для адмонов)' })
    @ApiResponse({ status: 201, type: StudySpace })
    @Post('/create-user') 
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('photo'))
    async createUser(@Request() req, @Body() userDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        let newDto = { ...userDto }

        if(file) {
            const photo = await this.filesService.uploadFile(file)
 
            newDto.photo = photo.filename as any
        }

        return this.studySpaceService.addUser(studySpaceId, user._id, newDto)
    }

    @ApiOperation({ summary: 'Получение токенов для модераторов' })
    @ApiResponse({ status: 200, type: [Token] })
    @Get('/tokens-admin')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async getModeratorsTokens(@Request() req) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        const result = await this.tokensService.getModerators(studySpaceId)

        return {
            result
        }
    }

    @ApiOperation({ summary: 'Получение токенов для преподавателей' })
    @ApiResponse({ status: 200, type: [Token] })
    @Get('/tokens-teachers')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async getTeachersTokens(@Request() req) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        const result = await this.tokensService.getTeachers(studySpaceId)

        return {
            result
        }
    }

    @ApiOperation({ summary: 'Получение всех преподавателей' })
    @ApiResponse({ status: 200, type: [User] })
    @Get('/teachers')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async getTeachers(@Request() req, @Query() query) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.usersService.getTeachers(studySpaceId, query)
    }

    @ApiOperation({ summary: 'Получение всех методистов' })
    @ApiResponse({ status: 200, type: [User] })
    @Get('/admins')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async getAdmins(@Request() req, @Query() query) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.usersService.getAdmins(studySpaceId, query)
    }
}
