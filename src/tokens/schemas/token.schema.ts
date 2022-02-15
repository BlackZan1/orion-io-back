import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

// schemas
import { StudySpace } from 'src/study-space/schemas/study-space.schema'
import { Group } from 'src/groups/schemas/group.schema'

@Schema({
    timestamps: false,
    versionKey: false
})
export class Token {
    @Prop({ required: true })
    token: string

    @Prop({ required: true, type: Types.ObjectId, ref: StudySpace.name })
    studySpace: StudySpace

    @Prop({ required: true, type: Types.ObjectId, ref: Group.name })
    group: Group

    @Prop({ default: null })
    forRole: string
}

export type TokenDocument = Token & Document
export const TokenSchema = SchemaFactory.createForClass(Token)