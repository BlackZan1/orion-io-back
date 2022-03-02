import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

// schemas
import { User } from 'src/users/schemas/user.schema'
import { StudySpace } from 'src/study-space/schemas/study-space.schema'
import { Schedule } from 'src/schedules/schemas/schedules.schema'
import { Group } from './group.schema'
import { Lesson } from 'src/lessons/schemas/lesson.schema'

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
export class GroupLesson {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Lesson' })
    lesson: Lesson
    
    @Prop({ required: true })
    lector: string

    @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
    group: Group
}

export type GroupLessonDocument = GroupLesson & Document
export const GroupLessonSchema = SchemaFactory.createForClass(GroupLesson)

GroupLessonSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})