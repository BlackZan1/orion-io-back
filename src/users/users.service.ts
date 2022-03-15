import { BadRequestException, HttpException, HttpStatus, Injectable, Query } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema, Types } from 'mongoose'
import {} from 'mongodb'
import { RolesService } from 'src/roles/roles.service'
import * as bcrypt from 'bcryptjs'

// services
import { FilesService } from 'src/files/files.service'

// dto
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

// schema
import { User, UserDocument } from './schemas/user.schema'

// config
import { ConfigService } from '@nestjs/config'

// utils
import { MulterFile } from 'utils/multer-storage'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private rolesService: RolesService,
        private configService: ConfigService,
        private filesService: FilesService
    ) {}

    async create(dto: CreateUserDto): Promise<UserDocument> {
        const existUser = await this.getByEmail(dto.email)

        if(existUser) throw new HttpException('User with provided Email is already exist!', HttpStatus.BAD_REQUEST)

        const user = { ...dto }

        if(!dto.password) throw new HttpException('Password is required!', HttpStatus.BAD_REQUEST)

        const genSalt = await bcrypt.genSalt(this.configService.get('salt'))
        const hashPassword = await bcrypt.hash(user.password, genSalt)

        user.password = hashPassword

        return new this.userModel(user).save()
    }

    async createAdmin(dto: CreateUserDto) {
        const adminRole = await this.rolesService.getAdmin()
        const admin = {
            ...dto,
            role: adminRole._id
        }

        return this.create(admin)
    }

    async createSuperUser(dto: CreateUserDto) {
        const suRole = await this.rolesService.getSuperUser()
        const superUser = {
            ...dto,
            role: suRole._id
        }

        return this.create(superUser)
    }

    async createTeacher(dto: CreateUserDto) {
        const userRole = await this.rolesService.getUser()
        const teacher = {
            ...dto,
            isTeacher: true,
            role: userRole._id
        }

        return this.create(teacher)
    }

    async createUser(dto: CreateUserDto) {
        const userRole = await this.rolesService.getUser()
        const user = {
            ...dto,
            role: userRole._id
        }

        return this.create(user)
    }

    async getAll(studySpaceId: any, query: any): Promise<UserDocument[]> {
        const props: any = {
            studySpace: studySpaceId
        }

        if(query.teacher === '1') props.isTeacher = true
        
        if(query.q) {
            const matchProps: any = {
                fullname: new RegExp(query.q, 'i'),
                ...props
            }

            return this.userModel
                .aggregate([
                    { 
                        $project: { 
                            firstName: '$firstName',
                            lastName: '$lastName',
                            studySpace: '$studySpace',
                            isTeacher: '$isTeacher',
                            fullname: { $concat: [ '$firstName', ' ', '$lastName' ] },
                            doc: '$$ROOT'
                        } 
                    },
                    { 
                        $match: matchProps
                    }
                ])
                .limit(20)
        }

        return this.userModel
            .find(props)
            .populate('role')
            .limit(100)
    }

    async getTeachers(studySpaceId: any, params: { page?: number, limit?: number }) {
        const limit = params.limit || 10
        const page = params.page || 1

        const allCount = await this.userModel
            .find({
                studySpace: studySpaceId,
                isTeacher: true
            })
            .count()

        const result = await this.userModel
            .find({
                studySpace: studySpaceId,
                isTeacher: true
            })
            .populate('role')
            .limit(limit)
            .skip((page * limit) - limit)

        return {
            allCount,
            result
        }
    }

    async getAdmins(studySpaceId: any, params?: { page?: number, limit?: number }) {
        const limit = params.limit || 10
        const page = params.page || 1

        const adminRole: any = await this.rolesService.getAdmin()
        
        const allCount = await this.userModel
            .find({
                studySpace: studySpaceId,
                role: adminRole._id
            })
            .count()

        const result = await this.userModel
            .find({
                studySpace: studySpaceId,
                role: adminRole._id
            })
            .populate('role')
            .limit(limit)
            .skip((page * limit) - limit)

        return {
            allCount,
            result
        }
    }

    async getAllAdmins(studySpaceId: any) {
        const adminRole: any = await this.rolesService.getAdmin()

        const count = await this.userModel
            .find({
                studySpace: studySpaceId,
                role: adminRole._id
            })
            .count()

        return await this.userModel
            .find({
                studySpace: studySpaceId,
                role: adminRole._id
            })
            .limit(count)
    }

    async getByEmail(email: string): Promise<UserDocument> {
        return this.userModel
            .findOne({ email })
            .populate('role')
    }

    async getById(userId: any, studySpaceId?: any): Promise<UserDocument> {
        const findParams = {
            _id: userId
        }

        if(studySpaceId) findParams['studySpace'] = studySpaceId

        const user = await this.userModel
            .findOne(findParams)
            .select('-password')
            .populate('role')
            .populate({ path: 'studySpace', select: 'name' })
        
        if(!user) throw new BadRequestException('User is not found!')

        return user
    }

    async updatePhoto(id: string, file: MulterFile): Promise<any> {
        const uploadedFile = await this.filesService.uploadFile(file)

        await this.userModel
            .findByIdAndUpdate(id, { photo: uploadedFile.filename })

        return {
            success: true
        }
    }

    async update(id: string, dto: UpdateUserDto) {
        await this.userModel.findByIdAndUpdate(id, dto)

        return {
            success: true
        }
    }
}