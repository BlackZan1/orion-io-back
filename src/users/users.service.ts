import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema, Types } from 'mongoose'
import {} from 'mongodb'
import { RolesService } from 'src/roles/roles.service'
import * as bcrypt from 'bcryptjs'

// services
import { FilesService } from 'src/files/files.service'

// dto
import { CreateUserDto } from './dto/create-user.dto'

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

    async createUser(dto: CreateUserDto) {
        const userRole = await this.rolesService.getUser()
        const user = {
            ...dto,
            role: userRole._id
        }

        return this.create(user)
    }

    async getAll(): Promise<UserDocument[]> {
        return this.userModel
            .find({})
            .populate('role')
    }

    async getByEmail(email: string): Promise<UserDocument> {
        return this.userModel
            .findOne({ email })
            .populate('role')
    }

    async getById(userId: any, studySpaceId: any): Promise<UserDocument> {
        const user = await this.userModel
            .findOne({
                _id: userId,
                studySpace: studySpaceId
            })
            .select('-password')
            .populate('role')
        
        if(!user) throw new BadRequestException('User is not found!')

        return user
    }

    async getByStudySpace(name: string): Promise<UserDocument[]> {
        return this.userModel.find({ 'studySpace.name': name })
    }

    async updatePhoto(id: string, file: MulterFile): Promise<any> {
        const uploadedFile = await this.filesService.uploadFile(file)

        await this.userModel
            .findByIdAndUpdate(id, { photo: uploadedFile.filename })

        return {
            success: true
        }
    }
}