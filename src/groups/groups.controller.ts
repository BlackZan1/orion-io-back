import { 
    BadRequestException,
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
import { CreateGroupDto } from './dto/create-group.dto'
import { AddUserDto } from './dto/add-user.dto'
import { CreateGroupLessonDto } from './dto/create-group-lesson.dto'

// services
import { GroupsService } from './groups.service'
import { UsersService } from 'src/users/users.service'

// schemas
import { Group } from './schemas/group.schema'
import { Token } from 'src/tokens/schemas/token.schema'
import { User } from 'src/users/schemas/user.schema'
import { News } from 'src/news/schemas/news.schema'
import { GroupLesson } from './schemas/groupLesson.schema'

@ApiTags('Groups')
@ApiBearerAuth()
@Controller('/api/groups')
export class GroupsController {
    constructor(
        private groupsService: GroupsService,
        private usersService: UsersService,
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
            members: [user._id],
            studySpace: studySpaceId
        }

        return this.groupsService.create(user._id, newDto)
    }

    @ApiOperation({ summary: 'Удаление группы пользователя через ID' })
    @ApiResponse({ status: 200, type: Group })
    @Delete('/:id')
    async delete(@Param() params, @Request() req) {
        const { user: reqUser } = req
        const { id } = params
        const studySpaceId = reqUser.studySpace._id

        if(!id.match(/^[0-9a-fA-F]{24}$/)) throw new BadRequestException('ID is not valid!')

        return this.groupsService.delete(id, studySpaceId)
    }

    @ApiOperation({ summary: 'Добавление в группу пользователя через ID' })
    @ApiResponse({ status: 200, type: Group })
    @Post('/:id/add-user')
    async addUser(@Body() dto: AddUserDto, @Param() params, @Request() req) {
        const { user: reqUser } = req
        const { id } = params
        const studySpaceId = reqUser.studySpace._id

        if(!id.match(/^[0-9a-fA-F]{24}$/)) throw new BadRequestException('ID is not valid!')

        const user = await this.usersService.getById(dto.userId, studySpaceId)

        return this.groupsService.addUser(id, user._id, studySpaceId)
    }

    @ApiOperation({ summary: 'Получение всех токенов группы через ID' })
    @ApiResponse({ status: 200, type: [Token] })
    @Get('/:id/tokens')
    async getTokens(@Param() params, @Request() req) {
        const { user } = req
        const { id } = params
        const studySpaceId = user.studySpace._id

        const result = await this.groupsService.getTokens(id, studySpaceId)

        return {
            result
        }
    }

    @ApiOperation({ summary: 'Получение всех участников группы через ID' })
    @ApiResponse({ status: 200, type: [User] })
    @Get('/:id/users')
    async getUsers(@Param() params, @Request() req, @Query() query) {
        const { user } = req
        const { id } = params
        const studySpaceId = user.studySpace._id

        const result = await this.groupsService.getUsers(id, studySpaceId, query)

        return {
            ...result
        }
    }

    @ApiOperation({ summary: 'Получение новостей группы через ID' })
    @ApiResponse({ status: 200, type: [News] })
    @Get('/:id/news')
    async getNews(@Param() params, @Request() req, @Query() query) {
        const { user } = req
        const { id } = params
        const studySpaceId = user.studySpace._id

        const result = await this.groupsService.getNews(id, studySpaceId, query)

        return {
            result
        }
    }

    @ApiOperation({ summary: 'Редактирование новости группы через ID' })
    @ApiResponse({ status: 200, type: News })
    @Patch('/:id/news/:newsId')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async updateNews(@Param() params, @Request() req, @Body() dto: any) {
        const { user } = req
        const { id, newsId } = params
        const studySpaceId = user.studySpace._id

        return this.groupsService.updateNews(id, studySpaceId, newsId, dto)
    }

    @ApiOperation({ summary: 'Удаление новости группы через ID' })
    @ApiResponse({ status: 200, type: News })
    @Delete('/:id/news/:newsId')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async deleteNews(@Param() params, @Request() req) {
        const { user } = req
        const { id, newsId } = params
        const studySpaceId = user.studySpace._id

        return this.groupsService.deleteNews(id, studySpaceId, newsId)
    }

    @ApiOperation({ summary: 'Получение всех дисциплин группы через ID' })
    @ApiResponse({ status: 200, type: GroupLesson })
    @Get('/:id/lessons')
    async getLessons(@Param() params, @Request() req) {
        const { user } = req
        const { id } = params
        const studySpaceId = user.studySpace._id

        return this.groupsService.getLessons(id, studySpaceId)
    }

    @ApiOperation({ summary: 'Добавление дисциплины группы через ID' })
    @ApiResponse({ status: 201, type: GroupLesson })
    @Post('/:id/lessons')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    @HttpCode(201)
    async createLesson(@Param() params, @Request() req, @Body() dto: CreateGroupLessonDto) {
        const { user } = req
        const { id } = params
        const studySpaceId = user.studySpace._id

        return this.groupsService.createLesson(id, studySpaceId, dto)
    }

    @ApiOperation({ summary: 'Удаление дисциплины группы через ID' })
    @ApiResponse({ status: 200, type: GroupLesson })
    @Delete('/:id/lessons/:lessonId')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    async deleteLesson(@Param() params, @Request() req) {
        const { user } = req
        const { id, lessonId } = params
        const studySpaceId = user.studySpace._id

        return this.groupsService.deleteLesson(id, studySpaceId, lessonId)
    }
}