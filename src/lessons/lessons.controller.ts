import { 
    Body,
    Controller, 
    Delete, 
    Get, 
    HttpCode, 
    Param, 
    Patch, 
    Post, 
    Query, 
    Request,
    UseGuards 
} from '@nestjs/common'
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

// dto
import { CreateLessonDto } from './dto/create-lesson.dto'
import { UpdateLessonDto } from './dto/update-lesson.dto'

// services
import { LessonsService } from './lessons.service'

// schemas
import { Lesson } from './schemas/lesson.schema'

@ApiTags('Lessons')
@ApiBearerAuth()
@Controller('/api/lessons')
export class LessonsController {
    constructor(
        private lessonsService: LessonsService
    ) {}

    @ApiOperation({ summary: 'Получение всех дисциплин (уроков)' })
    @ApiResponse({ status: 200, type: Lesson })
    @Get()
    @HttpCode(200)
    async getAll(@Request() req, @Query() query) {
        const { q } = query
        const { user } = req
        const studySpaceId = user.studySpace._id

        const result = await this.lessonsService.getByStudySpace(studySpaceId, q)

        return {
            result
        }
    }

    @ApiOperation({ summary: 'Создание дисциплины (урока)' })
    @ApiResponse({ status: 201, type: Lesson })
    @Post()
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    @HttpCode(201)
    async create(@Body() dto: CreateLessonDto, @Request() req) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.lessonsService.create({ ...dto, studySpace: studySpaceId })
    }

    @ApiOperation({ summary: 'Редактирование дисциплины по ID (урока)' })
    @ApiResponse({ status: 200, type: Lesson })
    @Patch(':id')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async update(@Body() dto: UpdateLessonDto, @Request() req, @Param() param) {
        const { id } = param
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.lessonsService.update(id, studySpaceId, dto)
    }

    @ApiOperation({ summary: 'Удаление дисциплины по ID (урока)' })
    @ApiResponse({ status: 200, type: Lesson })
    @Delete(':id')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async delete(@Request() req, @Param() param) {
        const { id } = param
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.lessonsService.delete(id, studySpaceId)
    }
}
