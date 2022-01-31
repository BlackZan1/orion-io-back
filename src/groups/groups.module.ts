import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// modules
import { StudySpaceModule } from 'src/study-space/study-space.module'
import { UsersModule } from 'src/users/users.module'
import { SchedulesModule } from 'src/schedules/schedules.module'

// services
import { GroupsService } from './groups.service'

// controllers
import { GroupsController } from './groups.controller'

// schemas
import { Group, GroupSchema } from './schemas/group.schema'
import { TokensModule } from 'src/tokens/tokens.module'

@Module({
  providers: [GroupsService],
  controllers: [GroupsController],
  imports: [
    StudySpaceModule,
    UsersModule,
    SchedulesModule,
    TokensModule,
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema }
    ])
  ]
})
export class GroupsModule {}
