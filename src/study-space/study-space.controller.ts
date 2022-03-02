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

// schemas
import { StudySpace } from './schemas/study-space.schema'

@ApiTags('Study space (Учебное пространство - основная платформа)')
@ApiBearerAuth()
@Controller('/api/study-space')
export class StudySpaceController {
    constructor(
        private studySpaceService: StudySpaceService,
        private filesService: FilesService
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
}
