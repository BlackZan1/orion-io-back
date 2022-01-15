import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// schemas
import { Schedule, ScheduleSchema } from './schemas/schedules.schema'

// services
import { SchedulesService } from './schedules.service'

// controllers
import { SchedulesController } from './schedules.controller'

// modules
import { EventsModule } from 'src/events/events.module'

@Module({
    imports: [
        EventsModule,
        MongooseModule.forFeature([
            { name: Schedule.name, schema: ScheduleSchema }
        ])
    ],
    providers: [
        SchedulesService
    ],
    controllers: [
        SchedulesController
    ],
    exports: [
        SchedulesService
    ]
})
export class SchedulesModule {}
