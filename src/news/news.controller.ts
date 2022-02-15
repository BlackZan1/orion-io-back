import { Body, Controller, HttpCode, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

// services
import { GroupsService } from 'src/groups/groups.service'
import { FilesService } from 'src/files/files.service'

// utils
import { MulterFile } from 'utils/multer-storage'

// dto
import { CreateNewsDto } from './dto/create-news.dto'
import { NewsService } from './news.service'

// schemas
import { News } from './schemas/news.schema'

// decorators
import { Roles } from 'src/roles/roles.decorator'

// guards
import { RolesGuard } from 'src/roles/guards/roles.guard'

// enum
import { RoleEnum } from 'src/roles/roles.enum'

@ApiTags('News')
@ApiBearerAuth()
@Controller('/api/news')
export class NewsController {
    constructor(
        private groupsService: GroupsService,
        private newsService: NewsService,
        private filesService: FilesService
    ) {}

    @ApiOperation({ summary: 'Создание новости' })
    @ApiResponse({ status: 201, type: News })
    @Post()
    @Roles(RoleEnum.Admin, RoleEnum.SuperUser)
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(201)
    async create(@Body() dto: CreateNewsDto, @Request() req, @UploadedFile() file: MulterFile) {
        const { user } = req

        const group = await this.groupsService.getById(dto.group, user.studySpace._id)

        let newDto = { 
            ...dto,
            group: group._id,
            author: user._id
        }

        if(file) {
            const image = await this.filesService.uploadFile(file)

            newDto.image = image.filename as any
        }

        return this.newsService.create(newDto)
    }
}
