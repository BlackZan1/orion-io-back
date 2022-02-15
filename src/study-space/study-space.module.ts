import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'

// modules
import { UsersModule } from 'src/users/users.module'
import { FilesModule } from 'src/files/files.module'

// schema
import { StudySpace, StudySpaceSchema } from './schemas/study-space.schema'

// controllers
import { StudySpaceController } from './study-space.controller'

// services
import { StudySpaceService } from './study-space.service'

// utils
import { multerStorage } from 'utils/multer-storage'

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
        UsersModule,
        FilesModule,
        MulterModule.register({
            storage: multerStorage
        })
    ],
    exports: [
        StudySpaceService
    ]
})
export class StudySpaceModule {}