import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// schemas
import { User, UserSchema } from './schemas/user.schema'

// controllers
import { UsersController } from './users.controller'

// services
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ]
})
export class UsersModule {}
