import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// modules
import { RolesModule } from 'src/roles/roles.module'

// schemas
import { User, UserSchema } from './schemas/user.schema'

// controllers
import { UsersController } from './users.controller'

// services
import { UsersService } from './users.service'

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
    RolesModule
  ],
  exports: [ 
    UsersService 
  ]
})
export class UsersModule {}