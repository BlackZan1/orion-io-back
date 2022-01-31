import { 
    BadRequestException, 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post, 
    Request, 
    UseGuards 
} from '@nestjs/common'
import { 
    ApiBearerAuth, 
    ApiOperation, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger'

// dto
import { CreateEventDto } from 'src/events/dto/create-event.dto'
import { UpdateEventDto } from 'src/events/dto/update-event.dto'

// guards
import { RolesGuard } from 'src/roles/guards/roles.guard'

// decorators
import { Roles } from 'src/roles/roles.decorator'

// enum
import { RoleEnum } from 'src/roles/roles.enum'

// services
import { SchedulesService } from './schedules.service'

// schemas
import { Schedule } from './schemas/schedules.schema'

@ApiTags('Schedules (Расписание на каждую группу)')
@ApiBearerAuth()
@Controller('/api/schedules')
export class SchedulesController {
    constructor(
        private schedulesService: SchedulesService
    ) {}

    @ApiOperation({ summary: 'Получение расписания по ID' })
    @ApiResponse({ status: 200, type: Schedule })
    @Get('/:id')
    async getById(@Param() params, @Request() req) {
        const { id } = params
        const { user } = req
        const studySpaceId = user.studySpace.id

        if(!id.match(/^[0-9a-fA-F]{24}$/)) throw new BadRequestException('ID is not valid!')

        return this.schedulesService.getById(id, studySpaceId)
    }

    @ApiOperation({ summary: 'Добавление события в расписание (нужен ID)' })
    @ApiResponse({ status: 201, type: Schedule })
    @Post('/:id/add-event')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async addEvent(@Body() dto: CreateEventDto, @Param() params, @Request() req) {
        const { id } = params
        const { user } = req
        const studySpaceId = user.studySpace.id

        if(!id.match(/^[0-9a-fA-F]{24}$/)) throw new BadRequestException('ID is not valid!')

        return this.schedulesService.addEvent(id, studySpaceId, dto)
    }

    @ApiOperation({ summary: 'Редактирование события в расписании (нужен ID)' })
    @ApiResponse({ status: 200, type: Schedule })
    @Patch('/:id/update-event/:eventId')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async updateEvent(@Body() dto: UpdateEventDto, @Param() params, @Request() req) {
        const { id, eventId } = params
        const { user } = req
        const studySpaceId = user.studySpace.id

        if(!id.match(/^[0-9a-fA-F]{24}$/)) throw new BadRequestException('ID is not valid!')

        return this.schedulesService.updateEvent(id, eventId, studySpaceId, dto)
    }

    @ApiOperation({ summary: 'Удаление события в расписании (нужен ID)' })
    @ApiResponse({ status: 200, type: Schedule })
    @Delete('/:id/delete-event/:eventId')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async deleteEvent(@Param() params, @Request() req) {
        const { id, eventId } = params
        const { user } = req
        const studySpaceId = user.studySpace.id

        if(!id.match(/^[0-9a-fA-F]{24}$/)) throw new BadRequestException('ID is not valid!')

        return this.schedulesService.deleteEvent(id, eventId, studySpaceId)
    }
}
