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

// services
import { AuditoriesService } from './auditories.service'

// dto
import { CreateAuditoryDto } from './dto/create-auditory.dto'
import { UpdateAuditoryDto } from './dto/update-auditory.dto'

// schemas
import { Auditory } from './schemas/auditory.schema'

@ApiTags('Auditories')
@ApiBearerAuth()
@Controller('/api/auditories')
export class AuditoriesController {
    constructor(
        private auditoriesService: AuditoriesService
    ) {}

    @ApiOperation({ summary: 'Получение всех аудиторий' })
    @ApiResponse({ status: 200, type: Auditory })
    @Get()
    async getAll(@Request() req, @Query() query) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        const result = await this.auditoriesService.getByStudySpace(studySpaceId, query)

        return {
            isMore: result.length >= (query.limit || 10),
            result
        }
    }

    @ApiOperation({ summary: 'Создание аудитории' })
    @ApiResponse({ status: 201, type: Auditory })
    @Post()
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    @HttpCode(201)
    async create(@Body() dto: CreateAuditoryDto, @Request() req) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.auditoriesService.create({ ...dto, studySpace: studySpaceId })
    }

    @ApiOperation({ summary: 'Редактирование аудитории по ID' })
    @ApiResponse({ status: 200, type: Auditory })
    @Patch(':id')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async update(@Body() dto: UpdateAuditoryDto, @Request() req, @Param() param) {
        const { id } = param
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.auditoriesService.update(id, studySpaceId, dto)
    }

    @ApiOperation({ summary: 'Удаление аудитории по ID' })
    @ApiResponse({ status: 200, type: Auditory })
    @Delete(':id')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async delete(@Request() req, @Param() param) {
        const { id } = param
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.auditoriesService.delete(id, studySpaceId)
    }
}
