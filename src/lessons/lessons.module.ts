import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// controllers
import { LessonsController } from './lessons.controller'

// services
import { LessonsService } from './lessons.service'

// schemas
import { Lesson, LessonSchema } from './schemas/lesson.schema'

@Module({
    controllers: [
        LessonsController
    ],
    providers: [
        LessonsService
    ],
    imports: [
        MongooseModule.forFeature([
            { name: Lesson.name, schema: LessonSchema }
        ])
    ],
    exports: [
        LessonsService
    ]
})
export class LessonsModule {}
