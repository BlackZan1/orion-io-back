import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'

// modules
import { RolesModule } from 'src/roles/roles.module'
import { FilesModule } from 'src/files/files.module'

// schemas
import { User, UserSchema } from './schemas/user.schema'

// controllers
import { UsersController } from './users.controller'

// services
import { UsersService } from './users.service'

// utils
import { multerStorage } from 'utils/multer-storage'

@Module({
  controllers: [ 
    UsersController 
  ],
  providers: [ 
    UsersService
  ],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    RolesModule,
    MulterModule.register({
      storage: multerStorage
    }),
    FilesModule
  ],
  exports: [ 
    UsersService 
  ]
})
export class UsersModule {}