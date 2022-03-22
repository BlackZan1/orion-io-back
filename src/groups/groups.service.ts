import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// services
import { StudySpaceService } from 'src/study-space/study-space.service'
import { SchedulesService } from 'src/schedules/schedules.service'
import { TokensService } from 'src/tokens/tokens.service'
import { NewsService } from 'src/news/news.service'
import { LessonsService } from 'src/lessons/lessons.service'

// dto
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { CreateGroupLessonDto } from './dto/create-group-lesson.dto'

// schemas
import { Group, GroupDocument } from './schemas/group.schema'
import { TokenDocument } from 'src/tokens/schemas/token.schema'
import { GroupLesson, GroupLessonDocument } from './schemas/groupLesson.schema'
import { NewsDocument } from 'src/news/schemas/news.schema'
import { UpdateGroupLessonDto } from './dto/update-group-lesson.dto'

@Injectable()
export class GroupsService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        @InjectModel(GroupLesson.name) private groupLessonModel: Model<GroupLessonDocument>,
        private studySpaceService: StudySpaceService,
        private schedulesService: SchedulesService,
        private tokensService: TokensService,
        private newsService: NewsService,
        private lessonsService: LessonsService
    ) {}

    async create(userId: any, dto: CreateGroupDto): Promise<GroupDocument> {
        const group = await new this.groupModel(dto).save()

        await this.studySpaceService.addGroupById(dto.studySpace, userId, group.id)
        
        const schedule = await this.schedulesService.create({ group: group.id })

        await group.updateOne({ schedule: schedule._id })

        return this.getById(group.id, dto.studySpace)
    }

    async getAll(studySpaceId: any): Promise<GroupDocument[]> {
        return this.groupModel
            .find({ studySpace: studySpaceId })
            .populate({ 
                path: 'members', 
                select: '-password',
                populate: {
                    path: 'role'
                }
            })
            .populate('schedule')
    }

    async getById(id: string, studySpaceId: any): Promise<GroupDocument> {
        const group = await this.groupModel
            .findOne({
                _id: id,
                studySpace: studySpaceId
            })
            .populate({ 
                path: 'members', 
                select: '-password',
                populate: {
                    path: 'role'
                }
            })

        if(!group) throw new BadRequestException('Group is not found!')

        return group
    }

    async update(id: string, studySpaceId: any, dto: UpdateGroupDto) {
        const group = await this.getById(id, studySpaceId)

        return group.updateOne(dto)
    }

    async delete(id: string, studySpaceId: any) {
        const group = await this.getById(id, studySpaceId)

        await group.deleteOne()

        return {
            success: true
        }
    }

    async addUser(id: string, userId: string, studySpaceId: any): Promise<GroupDocument> {
        const group = await this.getById(id, studySpaceId)

        if(group.members.find((i: any) => i.id === userId)) {
            return group
        }

        await group.updateOne({ $push: { members: userId } })

        return this.getById(id, studySpaceId)
    }

    async addSuperUser(userId: string, studySpaceId: any) {
        return this.groupModel
            .find({ studySpace: studySpaceId })
            .update({ $push: { members: userId } })
            .populate({ 
                path: 'members', 
                select: '-password'
            })
            .populate('schedule')
    }

    async addSchedule(id: string, scheduleId: any, studySpaceId: any): Promise<GroupDocument> {
        const group = await this.getById(id, studySpaceId)

        await group.updateOne({ schedule: scheduleId })

        return this.getById(id, studySpaceId)
    }

    async getTokens(id: string, studySpaceId: any ): Promise<TokenDocument[]> {
        const group = await this.getById(id, studySpaceId)

        return this.tokensService.getAllByGroupId(group.id)
    }

    async getUsers(id: string, studySpaceId: any, query: any) {
        const group = await this.getById(id, studySpaceId)

        let limit = 10, page = 1

        if(query.page) page = +query.page
        if(query.limit) limit = +query.limit

        let all = limit * page

        const result = group.members.slice(all - limit, all)

        return {
            result,
            allCount: group.members.length,
            userCount: group.members.filter((i) => i.role.value === 'user').length,
            superUserCount: group.members.filter((i) => i.role.value === 'superUser').length,
            adminCount: group.members.filter((i) => i.role.value === 'admin').length
        }
    }

    async getNews(id: string, studySpaceId: any, query: any): Promise<NewsDocument[]> {
        const group = await this.getById(id, studySpaceId)
        
        return this.newsService.getAll(group._id, query)
    }

    async updateNews(id: string, studySpaceId: any, newsId: string, dto: any): Promise<NewsDocument> {
        const group = await this.getById(id, studySpaceId)

        return this.newsService.update(newsId, group._id, dto)
    }

    async deleteNews(id: string, studySpaceId: any, newsId: string) {
        const group = await this.getById(id, studySpaceId)

        return this.newsService.delete(newsId, group._id)
    }

    async getLessonById(id: string, groupId: any): Promise<GroupLessonDocument> {
        const lesson = await this.groupLessonModel
            .findOne({
                _id: id,
                group: groupId
            })
            .populate('lesson')

        if(!lesson) throw new BadRequestException('Group lesson is not found!')
        
        return lesson
    }

    async getLessons(id: string, studySpaceId: any, q: string): Promise<GroupLessonDocument[]>  {
        const group = await this.getById(id, studySpaceId)

        let modelProps: any = {
            group: group._id
        }

        if(q) {
            modelProps = {
                ...modelProps,
                name: {
                    $regex: q,
                    $options: 'i'
                }
            }
        }

        const count = await this.groupLessonModel
            .find(modelProps)
            .count()

        return this.groupLessonModel
            .find(modelProps)
            .populate('lesson')
            .populate('lector')
            .limit(count)
    }

    async createLesson(id: string, studySpaceId: any, dto: CreateGroupLessonDto): Promise<GroupLessonDocument> {
        const group = await this.getById(id, studySpaceId)
        const lesson = await this.lessonsService.getById(dto.lesson, studySpaceId)

        const groupLesson = await new this.groupLessonModel({ 
            ...dto,  
            group: group._id,
            name: lesson.name
        }).save()

        return this.groupLessonModel
            .findOne({
                group: group._id,
                _id: groupLesson._id
            })
            .populate('lesson')
            .populate('lector')
    }

    async updateLesson(id: string, lessonId: string, studySpaceId: any, dto: UpdateGroupLessonDto): Promise<GroupLessonDocument> {
        const group = await this.getById(id, studySpaceId)
        const groupLesson = await this.getLessonById(lessonId, group._id)

        const newDto: any = { ...dto }

        if(dto.lesson) {
            const lesson = await this.lessonsService.getById(dto.lesson, studySpaceId)

            newDto.lesson = lesson._id
        }

        await groupLesson.updateOne(newDto)

        return this.getLessonById(lessonId, group._id)
    }

    async deleteLesson(id: string,studySpaceId: any, lessonId: string) {
        const group = await this.getById(id, studySpaceId)
        const lesson = await this.getLessonById(lessonId, group._id)

        await lesson.remove()

        return {
            success: true
        }
    }
}