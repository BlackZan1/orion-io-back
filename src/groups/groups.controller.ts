import { 
    BadRequestException,
    Body, 
    Controller, 
    Get, 
    HttpCode, 
    Param, 
    Post, 
    Request,
    UseGuards
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

// guards
import { RolesGuard } from 'src/roles/guards/roles.guard'

// decorators
import { Roles } from 'src/roles/roles.decorator'

// enum
import { RoleEnum } from 'src/roles/roles.enum'

// dto
import { CreateGroupDto } from './dto/create-group.dto'
import { AddUserDto } from './dto/add-user.dto'

// services
import { GroupsService } from './groups.service'
import { UsersService } from 'src/users/users.service'

// schemas
import { Group } from './schemas/group.schema'

@ApiTags('Groups')
@Controller('/api/groups')
export class GroupsController {
    constructor(
        private groupsService: GroupsService,
        private usersService: UsersService
    ) {}

    @ApiOperation({ summary: 'Получение всех групп в учебном пространстве' })
    @ApiResponse({ status: 200, type: [Group] })
    @Get()
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async getAll(@Request() req) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        const results = await this.groupsService.getAll(studySpaceId)

        return {
            results
        }
    }

    @ApiOperation({ summary: 'Создание группы в учебном пространстве' })
    @ApiResponse({ status: 201, type: Group })
    @Post()
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    @HttpCode(201)
    async create(@Body() dto: CreateGroupDto, @Request() req) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        const newDto = {
            ...dto,
            studySpace: studySpaceId
        }

        return this.groupsService.create(newDto)
    }

    @ApiOperation({ summary: 'Добавление в группу пользователя через ID' })
    @ApiResponse({ status: 200, type: Group })
    @Post('/:id/add-user')
    async addUser(@Body() dto: AddUserDto, @Param() params, @Request() req) {
        const { user: reqUser } = req
        const { id } = params
        const studySpaceId = reqUser.studySpace._id

        if(!id.match(/^[0-9a-fA-F]{24}$/)) throw new BadRequestException('ID is not valid!')

        const user = await this.usersService.getById(dto.userId)
        const userStudySpace: any = user.studySpace || {}

        if(!user) throw new BadRequestException('User is not found!')
        if(userStudySpace.id !== reqUser.studySpace.id) throw new BadRequestException('Can not access to user!')

        return this.groupsService.addUser(id, user._id, studySpaceId)
    }
}
