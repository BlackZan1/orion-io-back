import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// dto
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'

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

    async getById(id: string, scheduleId: any): Promise<EventDocument> {
        const event = await this.eventModel
            .findOne({
                _id: id,
                schedule: scheduleId
            })

        if(!event) throw new BadRequestException('Event is not found!')

        return event
    }

    async update(id: string, scheduleId: any, dto: UpdateEventDto): Promise<EventDocument> {
        const event = await this.getById(id, scheduleId)
        
        await event.updateOne(dto)

        return this.getById(id, scheduleId)
    }

    async delete(id: string, scheduleId: any) {
        const event = await this.getById(id, scheduleId)

        await event.delete()

        return {
            message: 'OK'
        }
    }   
}