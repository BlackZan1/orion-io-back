import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Model } from 'mongoose'

// services
import { UsersService } from 'src/users/users.service'

// dto
import { SignInDto } from './dto/sign-in.dto'

// schemas
import { Jwt, JwtDocument } from './schemas/jwt.schema'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(Jwt.name) private jwtModel: Model<JwtDocument>
    ) {}

    async validateUser(signInDto: SignInDto) {
        const {
            email,
            password
        } = signInDto

        const user = await this.usersService.getByEmail(email)

        if(!user) return null

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) return null

        return user
    }

    async getToken(payload: any) {
        const { userId } = payload

        const tokenModel = await this.jwtModel.findOne({ userId })
        const newToken = {
            userId,
            refreshToken: this.jwtService.sign(payload, { expiresIn: '30d', secret: this.configService.get('jwtRefreshSecret') })
        }

        if(!tokenModel) {
            await new this.jwtModel(newToken).save()

            return {
                accessToken: this.jwtService.sign(payload),
                refreshToken: newToken.refreshToken
            }
        }

        tokenModel.updateOne({
            refreshToken: newToken.refreshToken
        })

        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: newToken.refreshToken
        }
    }

    async refreshToken(refreshToken: string) {
        const tokenModel = await this.jwtModel.findOne({ refreshToken })

        if(!tokenModel) throw new BadRequestException('Refresh token is not valid')

        const user: any = await this.usersService.getById(tokenModel.userId)
    
        if(!user) throw new BadRequestException('User is not found')

        const payload = { 
            userId: user._id,
            studySpaceId: user.studySpace._id,
            role: user.role.value
        }

        const newToken = this.jwtService.sign(payload, { expiresIn: '30d', secret: this.configService.get('jwtRefreshSecret') })

        tokenModel.updateOne({
            refreshToken: newToken
        })

        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: newToken
        }
    }
}
