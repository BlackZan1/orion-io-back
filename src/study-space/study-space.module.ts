import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// modules
import { UsersModule } from 'src/users/users.module'

// schema
import { StudySpace, StudySpaceSchema } from './schemas/study-space.schema'

// controllers
import { StudySpaceController } from './study-space.controller'

// services
import { StudySpaceService } from './study-space.service'

@Module({
    controllers: [
        StudySpaceController
    ],
    providers: [
        StudySpaceService
    ],
    imports: [
        MongooseModule.forFeature([
            { name: StudySpace.name, schema: StudySpaceSchema }
        ]),
        UsersModule
    ],
    exports: [
        StudySpaceService
    ]
})
export class StudySpaceModule {}
