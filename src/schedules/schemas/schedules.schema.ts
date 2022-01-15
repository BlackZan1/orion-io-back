import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Event } from 'src/events/schemas/event.schema'

// schemas
import { Group } from 'src/groups/schemas/group.schema'

@Schema({
    timestamps: true,
    versionKey: false,
    toJSON: { 
        virtuals: true 
    },
    toObject: {
        virtuals: true
    }
})
export class Schedule {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
    group: Group

    @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'Event' }] })
    monday: Event[]

    @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'Event' }] })
    tuesday: Event[]

    @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'Event' }] })
    wednesday: Event[]

    @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'Event' }] })
    thursday: Event[]

    @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'Event' }] })
    friday: Event[]

    @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'Event' }] })
    saturday: Event[]

    @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'Event' }] })
    sunday: Event[]
}

export type ScheduleDocument = Schedule & Document
export const ScheduleSchema = SchemaFactory.createForClass(Schedule)

ScheduleSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})