import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

// utils
import configuration from 'config/configuration'

// services
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configuration().jwtSecret
        })
    }

    async validate(payload: any) {
        const { userId } = payload

        if(!userId) throw new HttpException('Not valid JWT token', HttpStatus.UNAUTHORIZED)

        const user = await this.usersService.getById(userId)

        if(!user) throw new HttpException('User not found', HttpStatus.UNAUTHORIZED)

        return user
    }
}