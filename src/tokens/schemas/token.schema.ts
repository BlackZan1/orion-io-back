import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

// schemas
import { StudySpace } from 'src/study-space/schemas/study-space.schema'

@Schema({
    timestamps: true,
    versionKey: false
})
export class Token {
    @Prop({ required: true })
    token: string

    @Prop({ required: true, type: Types.ObjectId, ref: StudySpace.name })
    studySpace: StudySpace
}

export type TokenDocument = Token & Document
export const TokenSchema = SchemaFactory.createForClass(Token)