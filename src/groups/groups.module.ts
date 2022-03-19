import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// modules
import { StudySpaceModule } from 'src/study-space/study-space.module'
import { UsersModule } from 'src/users/users.module'
import { SchedulesModule } from 'src/schedules/schedules.module'
import { NewsModule } from 'src/news/news.module'
import { TokensModule } from 'src/tokens/tokens.module'
import { LessonsModule } from 'src/lessons/lessons.module'

// services
import { GroupsService } from './groups.service'

// controllers
import { GroupsController } from './groups.controller'

// schemas
import { Group, GroupSchema } from './schemas/group.schema'
import { GroupLesson, GroupLessonSchema } from './schemas/groupLesson.schema'

@Module({
  providers: [
    GroupsService
  ],
  controllers: [
    GroupsController
  ],
  imports: [
    StudySpaceModule,
    UsersModule,
    forwardRef(() => NewsModule),
    SchedulesModule,
    TokensModule,
    LessonsModule,
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupLesson.name, schema: GroupLessonSchema }
    ])
  ],
  exports: [
    GroupsService
  ]
})
export class GroupsModule {}
