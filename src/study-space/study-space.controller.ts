import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
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
import { StudySpace } from './schemas/study-space.schema'

@ApiTags('Study space (Учебное пространство - основная платформа)')
@ApiBearerAuth()
@Controller('/api/study-space')
export class StudySpaceController {
    constructor(
        private studySpaceService: StudySpaceService,
        private filesService: FilesService
    ) {}

    @ApiOperation({ summary: 'Получение учебного пространства' })
    @ApiResponse({ status: 200, type: StudySpace })
    @Get()
    async get(@Request() req) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.studySpaceService.getById(studySpaceId)
    }

    @ApiOperation({ summary: 'Создание учебного пространства' })
    @ApiResponse({ status: 201, type: StudySpace })
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(@Body() dto: CreateStudySpaceDto, @UploadedFile() file: Express.Multer.File) {
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

            newDto.photo = photo.filename
        }

        return this.studySpaceService.addUser(studySpaceId, newDto)
    }

    @ApiOperation({ summary: 'Добавление пользователя в учебном пространстве через ID (DEMO)' })
    @ApiResponse({ status: 200, type: StudySpace })
    @Post('/demo/add-user/:id') 
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async addUser(@Request() req, @Param() params) {
        const { id } = params
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.studySpaceService.addUserById(studySpaceId, id)
    }

    @ApiOperation({ summary: 'Добавление группы в учебном пространстве через ID (DEMO)' })
    @ApiResponse({ status: 200, type: StudySpace })
    @Post('/demo/add-group/:id') 
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async addGroup(@Request() req, @Param() params) {
        const { id } = params
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.studySpaceService.addGroupById(studySpaceId, id)
    }
}
