import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

// modules
import { UsersModule } from 'src/users/users.module'

// services
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategy/local.strategy'

// controllers
import { AuthController } from './auth.controller'

// schemas
import { Jwt, JwtSchema } from './schemas/jwt.schema'

// utils
import config from 'config/configuration'

@Module({
    controllers: [ 
        AuthController 
    ],
    imports: [ 
        UsersModule, 
        PassportModule,
        MongooseModule.forFeature([
            { name: Jwt.name, schema: JwtSchema  }
        ]),
        JwtModule.register({
            secret: config().jwtSecret,
            signOptions: {
                expiresIn: '1d'
            }
        })
    ],
    providers: [ 
        ConfigService, 
        AuthService,
        LocalStrategy
    ],
    exports: [
        AuthService
    ]
})
export class AuthModule {}