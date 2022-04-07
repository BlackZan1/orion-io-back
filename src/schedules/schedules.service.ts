import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateEventDto } from 'src/events/dto/create-event.dto'

// services
import { EventsService } from 'src/events/events.service'
import { GroupsService } from 'src/groups/groups.service'

// dto
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { UpdateEventDto } from 'src/events/dto/update-event.dto'

// schemas
import { Schedule, ScheduleDocument } from './schemas/schedules.schema'
import { EventDocument } from 'src/events/schemas/event.schema'
import { GroupLesson, GroupLessonDocument } from 'src/groups/schemas/groupLesson.schema'

@Injectable()
export class SchedulesService {
    constructor(
        @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
        @InjectModel(GroupLesson.name) private groupLessonModel: Model<GroupLessonDocument>,
        private eventsService: EventsService
    ) {}

    async create(dto: CreateScheduleDto): Promise<ScheduleDocument> {
        return new this.scheduleModel(dto).save()
    }

    async getById(id: string, studySpaceId: any): Promise<ScheduleDocument> {
        const schedule = await this.scheduleModel
            .findById(id)
            .populate({ path: 'monday', populate: { path: 'lesson', populate: 'lesson' } })
            .populate({ path: 'tuesday', populate: { path: 'lesson', populate: 'lesson' } })
            .populate({ path: 'wednesday', populate: { path: 'lesson', populate: 'lesson' } })
            .populate({ path: 'thursday', populate: { path: 'lesson', populate: 'lesson' } })
            .populate({ path: 'friday', populate: { path: 'lesson', populate: 'lesson' } })
            .populate({ path: 'saturday', populate: { path: 'lesson', populate: 'lesson' } })
            .populate({ path: 'sunday', populate: { path: 'lesson', populate: 'lesson' } })
        
        if(!schedule) throw new BadRequestException('Schedule is not found!')
        if(schedule.group.studySpace === studySpaceId) throw new BadRequestException('Can not access to schedule!')
    
        return schedule
    }

    async addEvent(id: string, studySpaceId: any, dto: CreateEventDto): Promise<EventDocument> {
        const schedule = await this.getById(id, studySpaceId)
        const event = await this.eventsService.create({ 
            ...dto, 
            schedule: schedule._id,
            studySpace: studySpaceId,
            lesson: new Types.ObjectId(dto.lesson)
        })

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