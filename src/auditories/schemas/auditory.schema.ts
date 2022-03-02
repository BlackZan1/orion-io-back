import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Types } from 'mongoose'

// schemas
import { StudySpace } from 'src/study-space/schemas/study-space.schema'

@Schema({
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true
    }
})
export class Auditory {
    @Prop({ required: true })
    name: string

    @Prop({ default: null })
    building: string

    @ApiProperty({ example: 'ID', description: 'ID учебного пространства' })
    @Prop({ required: true, type: Types.ObjectId, ref: 'StudySpace' })
    studySpace: StudySpace
}

export type AuditoryDocument = Auditory & Document
export const AuditorySchema = SchemaFactory.createForClass(Auditory)

AuditorySchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})

AuditorySchema.index({ name: 'text' })