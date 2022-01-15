import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

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
    @Prop({ required: true })
    title: string

    @Prop({ required: true })
    description: string

    @Prop({ required: true })
    color: string

    @Prop({ required: true })
    startDate: string

    @Prop({ required: true })
    endDate: string
}

export type EventDocument = Event & Document
export const EventSchema = SchemaFactory.createForClass(Event)

EventSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})