import { 
    BadRequestException,
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    Request,
    UseGuards
} from '@nestjs/common'

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

@Controller('/api/groups')
export class GroupsController {
    constructor(
        private groupsService: GroupsService,
        private usersService: UsersService
    ) {}

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

    @Post()
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async create(@Body() dto: CreateGroupDto, @Request() req) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        const newDto = {
            ...dto,
            studySpace: studySpaceId
        }

        return this.groupsService.create(newDto)
    }

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
