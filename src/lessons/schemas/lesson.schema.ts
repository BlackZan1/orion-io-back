import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Types } from 'mongoose'

// schemas
import { StudySpace } from 'src/study-space/schemas/study-space.schema'

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
export class Lesson {
    @ApiProperty({ example: 'ООП', description: 'Название дисциплины' })
    @Prop({ required: true })
    name: string

    @ApiProperty({ example: 'Много практики!', description: 'Описание дисциплины' })
    @Prop({ required: true })
    details: string

    @ApiProperty({ example: '#000000', description: 'Цвет отображения дисциплины' })
    @Prop({ required: true })
    color: string

    @ApiProperty({ example: 'ID', description: 'ID учебного пространства' })
    @Prop({ required: true, type: Types.ObjectId, ref: 'StudySpace' })
    studySpace: StudySpace
}

export type LessonDocument = Lesson & Document
export const LessonSchema = SchemaFactory.createForClass(Lesson)

LessonSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})

LessonSchema.index({ name: 'text' })