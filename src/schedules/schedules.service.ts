import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateEventDto } from 'src/events/dto/create-event.dto'

// services
import { EventsService } from 'src/events/events.service'

// dto
import { CreateScheduleDto } from './dto/create-schedule.dto'

// schemas
import { Schedule, ScheduleDocument } from './schemas/schedules.schema'
import { EventDocument } from 'src/events/schemas/event.schema'
import { UpdateEventDto } from 'src/events/dto/update-event.dto'

@Injectable()
export class SchedulesService {
    constructor(
        @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
        private eventsService: EventsService
    ) {}

    async create(dto: CreateScheduleDto): Promise<ScheduleDocument> {
        return new this.scheduleModel(dto).save()
    }

    async getById(id: string, studySpaceId: any): Promise<ScheduleDocument> {
        const schedule = await this.scheduleModel
            .findById(id)
            .populate('monday')
            .populate('tuesday')
            .populate('wednesday')
            .populate('thursday')
            .populate('friday')
            .populate('saturday')
            .populate('sunday')

        if(!schedule) throw new BadRequestException('Schedule is not found!')
        if(schedule.group.studySpace === studySpaceId) throw new BadRequestException('Can not access to schedule!')
    
        return schedule
    }

    async addEvent(id: string, studySpaceId: string, dto: CreateEventDto): Promise<EventDocument> {
        const schedule = await this.getById(id, studySpaceId)
        const event = await this.eventsService.create({ ...dto, schedule: schedule._id })

        switch(parseFloat(dto.day + '')) {
            case 1:
                await schedule.updateOne({ $push: { monday: event._id } })

                break
            case 2:
                await schedule.updateOne({ $push: { tuesday: event._id } })

                break
            case 3:
                await schedule.updateOne({ $push: { wednesday: event._id } })

                break
            case 4:
                await schedule.updateOne({ $push: { thursday: event._id } })

                break
            case 5:
                await schedule.updateOne({ $push: { friday: event._id } })

                break
            case 6:
                await schedule.updateOne({ $push: { saturday: event._id } })

                break
            case 7:
                await schedule.updateOne({ $push: { sunday: event._id } })

                break
            default:
                throw new BadRequestException('Day must be equal to days of week!')
        }

        return event
    }

    async updateEvent(id: string, eventId: string, studySpaceId: string, dto: UpdateEventDto): Promise<EventDocument> {
        const schedule = await this.getById(id, studySpaceId)
        const event = await this.eventsService.getById(eventId, schedule._id)
        
        const prevEventDay = event.day

        await event.updateOne(dto)

        if(prevEventDay !== dto.day) {
            switch(prevEventDay) {
                case 1:
                    await schedule.updateOne({ $pull: { monday: id } })
    
                    break
                case 2:
                    await schedule.updateOne({ $pull: { tuesday: id } })
    
                    break
                case 3:
                    await schedule.updateOne({ $pull: { wednesday: id } })
    
                    break
                case 4:
                    await schedule.updateOne({ $pull: { thursday: id } })
    
                    break
                case 5:
                    await schedule.updateOne({ $pull: { friday: id } })
    
                    break
                case 6:
                    await schedule.updateOne({ $pull: { saturday: id } })
    
                    break
                case 7:
                    await schedule.updateOne({ $pull: { sunday: id } })
    
                    break
                default:
                    throw new BadRequestException('Day must be equal to days of week!')
            }

            switch(parseFloat(dto.day + '')) {
                case 1:
                    await schedule.updateOne({ $push: { monday: id } })
    
                    break
                case 2:
                    await schedule.updateOne({ $push: { tuesday: id } })
    
                    break
                case 3:
                    await schedule.updateOne({ $push: { wednesday: id } })
    
                    break
                case 4:
                    await schedule.updateOne({ $push: { thursday: id } })
    
                    break
                case 5:
                    await schedule.updateOne({ $push: { friday: id } })
    
                    break
                case 6:
                    await schedule.updateOne({ $push: { saturday: id } })
    
                    break
                case 7:
                    await schedule.updateOne({ $push: { sunday: id } })
    
                    break
                default:
                    throw new BadRequestException('Day must be equal to days of week!')
            }
        }

        return this.eventsService.getById(eventId, schedule._id)
    }

    async deleteEvent(id: string, eventId: string, studySpaceId: string) {
        const schedule = await this.getById(id, studySpaceId)

        return this.eventsService.delete(eventId, schedule._id)
    }
}