import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

// modules
import { UsersModule } from 'src/users/users.module'
import { FilesModule } from 'src/files/files.module'
import { TokensModule } from 'src/tokens/tokens.module'
import { StudySpaceModule } from 'src/study-space/study-space.module'
import { MulterModule } from '@nestjs/platform-express'
import { GroupsModule } from 'src/groups/groups.module'

// services
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategy/local.strategy'

// controllers
import { AuthController } from './auth.controller'

// schemas
import { Jwt, JwtSchema } from './schemas/jwt.schema'

// utils
import config from 'config/configuration'
import { multerStorage } from 'utils/multer-storage'

@Module({
    controllers: [ 
        AuthController 
    ],
    imports: [ 
        UsersModule, 
        PassportModule,
        FilesModule,
        TokensModule,
        StudySpaceModule,
        GroupsModule,
        MongooseModule.forFeature([
            { name: Jwt.name, schema: JwtSchema  }
        ]),
        MulterModule.register({
            storage: multerStorage
        }),
        JwtModule.register({
            secret: config().jwtSecret,
            signOptions: {
                expiresIn: '1y'
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