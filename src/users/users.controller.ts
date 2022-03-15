import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Patch, 
    Query, 
    Request, 
    UploadedFile, 
    UseInterceptors
} from '@nestjs/common'
import { 
    ApiBearerAuth, 
    ApiOperation, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

// schemas
import { User } from './schemas/user.schema'

// dto
import { UpdateUserDto } from './dto/update-user.dto'

// services
import { UsersService } from './users.service'
import { FilesService } from 'src/files/files.service'

// utils
import { MulterFile } from 'utils/multer-storage'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/api/users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private filesService: FilesService
    ) {}

    @ApiOperation({ summary: 'Получение всех пользователей вашей системы' })
    @ApiResponse({ status: 200, type: [User] })
    @Get()
    async getAll(@Request() req, @Query() query) {
        const studySpaceId = req.user.studySpace._id

        const result = await this.usersService.getAll(studySpaceId, query)

        return {
            result
        }
    }

    @ApiOperation({ summary: 'Получение пользователя по ID' })
    @ApiResponse({ status: 200, type: User })
    @Get('/:id')
    getById(@Request() req, @Param() params) {
        const { id } = params
        const studySpaceId = req.user.studySpace._id

        return this.usersService.getById(id, studySpaceId)
    }

    @ApiOperation({ summary: 'Редактирование своего пользователя' })
    @ApiResponse({ status: 200, type: User })
    @Patch()
    @UseInterceptors(FileInterceptor('photo'))
    async update(@Body() dto: UpdateUserDto, @Request() req, @UploadedFile() file: MulterFile) {
        const { user } = req

        if(file) {
            const photo = await this.filesService.uploadFile(file)

            dto.photo = photo.filename as any
        }

        return this.usersService.update(user.id, dto)
    }
}