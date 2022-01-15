import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

// schemas
import { User } from 'src/users/schemas/user.schema'
import { StudySpace } from 'src/study-space/schemas/study-space.schema'
import { Schedule } from 'src/schedules/schemas/schedules.schema'

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
export class Group {
    @Prop({ required: true })
    name: string

    @Prop({ default: null })
    details: string

    @Prop({ type: Types.ObjectId, ref: 'Schedule', default: null })
    schedule: Schedule

    @Prop({ required: true, type: Types.ObjectId, ref: 'StudySpace' })
    studySpace: StudySpace

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    members: User[]
}

export type GroupDocument = Group & Document
export const GroupSchema = SchemaFactory.createForClass(Group)

GroupSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})