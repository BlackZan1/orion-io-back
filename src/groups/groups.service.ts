import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// services
import { StudySpaceService } from 'src/study-space/study-space.service'
import { SchedulesService } from 'src/schedules/schedules.service'

// dto
import { CreateGroupDto } from './dto/create-group.dto'

// schemas
import { Group, GroupDocument } from './schemas/group.schema'

@Injectable()
export class GroupsService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        private studySpaceService: StudySpaceService,
        private schedulesService: SchedulesService
    ) {}

    async create(dto: CreateGroupDto): Promise<GroupDocument> {
        const group = await new this.groupModel(dto).save()

        await this.studySpaceService.addGroupById(dto.studySpace, group.id)
        
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
        const group = this.groupModel
            .findOne({
                _id: id,
                studySpace: studySpaceId
            })
            .populate({ path: 'members', select: '-password' })

        if(!group) throw new BadRequestException('Group is not found!')

        return group
    }

    async addUser(id: string, userId: string, studySpaceId: string): Promise<GroupDocument> {
        const group = await this.getById(id, studySpaceId)

        if(group.members.find((i: any) => i.id === userId)) {
            return group
        }

        await group.updateOne({ $push: { members: userId } })

        return this.getById(id, studySpaceId)
    }

    async addSchedule(id: string, scheduleId: any, studySpaceId: string) {
        const group = await this.getById(id, studySpaceId)

        group.updateOne({ schedule: scheduleId })

        return this.getById(id, studySpaceId)
    }
}
