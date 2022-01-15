import { 
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
import { CreateUserDto } from 'src/users/dto/create-user.dto'

// dto
import { CreateStudySpaceDto } from './dto/create-study-space.dto'

// services
import { StudySpaceService } from './study-space.service'

@Controller('/api/study-space')
export class StudySpaceController {
    constructor(
        private studySpaceService: StudySpaceService
    ) {}

    @Get()
    async get(@Request() req) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.studySpaceService.getById(studySpaceId)
    }

    @Get(':id')
    async getById(@Param() params) {
        const { id } = params

        return this.studySpaceService.getById(id)
    }

    @Post()
    async create(@Body() studySpaceDto: CreateStudySpaceDto) {
        return this.studySpaceService.create(studySpaceDto)
    }

    @Post('/create-user') 
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async createUser(@Request() req, @Body() userDto: CreateUserDto) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.studySpaceService.addUser(studySpaceId, userDto)
    }

    @Post('/demo/add-user/:id') 
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async addUser(@Request() req, @Param() params) {
        const { id } = params
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.studySpaceService.addUserById(studySpaceId, id)
    }

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
