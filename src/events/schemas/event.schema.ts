import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

// schemas
import { Schedule } from 'src/schedules/schemas/schedules.schema'
import { GroupLesson } from 'src/groups/schemas/groupLesson.schema'

@Schema({
    versionKey: false,
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})
export class Event {
    @Prop({ required: true, type: Types.ObjectId, ref: GroupLesson.name })
    lesson: GroupLesson

    @Prop({ required: true })
    description: string

    @Prop({ required: true })
    startDate: string

    @Prop({ required: true })
    endDate: string

    @Prop({ required: true })
    day: number

    @Prop({ required: true, type: Types.ObjectId, ref: Schedule.name })
    schedule: Schedule
}

export type EventDocument = Event & Document
export const EventSchema = SchemaFactory.createForClass(Event)

EventSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})