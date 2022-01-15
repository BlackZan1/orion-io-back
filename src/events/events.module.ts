import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// services
import { EventsService } from './events.service'

// schemas
import { Event, EventSchema } from './schemas/event.schema'

@Module({
  providers: [
    EventsService
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema }
    ])
  ],
  exports: [
    EventsService
  ]
})
export class EventsModule {}