import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// services
import { StudySpaceService } from 'src/study-space/study-space.service'
import { SchedulesService } from 'src/schedules/schedules.service'
import { TokensService } from 'src/tokens/tokens.service'
import { NewsService } from 'src/news/news.service'

// dto
import { CreateGroupDto } from './dto/create-group.dto'

// schemas
import { Group, GroupDocument } from './schemas/group.schema'
import { TokenDocument } from 'src/tokens/schemas/token.schema'

@Injectable()
export class GroupsService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        private studySpaceService: StudySpaceService,
        private schedulesService: SchedulesService,
        private tokensService: TokensService,
        private newsService: NewsService
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
            .populate('members')
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

    async addSchedule(id: string, scheduleId: any, studySpaceId: any): Promise<GroupDocument> {
        const group = await this.getById(id, studySpaceId)

        group.updateOne({ schedule: scheduleId })

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

    async getNews(id: string, studySpaceId: any, query: any) {
        const group = await this.getById(id, studySpaceId)
        
        return this.newsService.getAll(group._id, query)
    }
}