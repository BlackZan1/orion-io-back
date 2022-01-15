import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// dto
import { CreateEventDto } from './dto/create-event.dto'

// schemas
import { Event, EventDocument } from './schemas/event.schema'

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>
    ) {}

    async create(dto: CreateEventDto): Promise<EventDocument> {
        return new this.eventModel(dto).save()
    }
}