import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from 'src/users/dto/create-user.dto'

// services
import { UsersService } from 'src/users/users.service'

// dto
import { CreateStudySpaceDto } from './dto/create-study-space.dto'

// schema
import { StudySpace, StudySpaceDocument } from './schemas/study-space.schema'

@Injectable()
export class StudySpaceService {
    constructor(
        @InjectModel(StudySpace.name) private studySpaceModel: Model<StudySpaceDocument>,
        private usersService: UsersService
    ) {}

    async create(dto: CreateStudySpaceDto): Promise<StudySpace> {
        return new this.studySpaceModel(dto).save()
    }

    async getAll(): Promise<StudySpace[]> {
        return this.studySpaceModel
            .find({})
            // .populate('members')
    }

    async getById(id: string, userId: any): Promise<StudySpaceDocument> {
        const spaceStudy = await this.studySpaceModel
            .findById(id)
            .populate({
                path: 'groups',
                match: {
                    members: { $in: userId }
                }
            })

        return spaceStudy
    }

    async addUser(id: string, userId: any, userDto: CreateUserDto): Promise<StudySpaceDocument> {
        const studySpace = await this.studySpaceModel.findById(id)
        const newUser = await this.usersService.createUser({ ...userDto, studySpace: studySpace._id  })

        const members = [ ...studySpace.members, newUser._id ]

        await studySpace.updateOne({ members })

        return this.getById(studySpace._id, userId)
    }

    async addUserById(id: string, currentUserId: any, userId: string) {
        const studySpace = await this.studySpaceModel.findById(id)
        const user = await this.usersService.getById(userId, studySpace._id)

        if(!user) throw new BadRequestException('User is not found')

        if(studySpace.members.find((i: any) => i.id === user._id)) {
            return studySpace
        }

        await studySpace.updateOne({ $push: { members: user._id } })

        return this.getById(studySpace._id, currentUserId)
    }

    async addGroupById(id: any, userId: any, groupId: any) {
        const studySpace = await this.getById(id, userId)

        if(studySpace.groups.find((i: any) => i.id === groupId)) {
            return studySpace
        }

        await studySpace.updateOne({ $push: { groups: groupId } })

        return this.getById(studySpace._id, userId)
    }
}