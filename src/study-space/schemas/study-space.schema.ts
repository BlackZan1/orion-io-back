import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

// schemas
import { User } from 'src/users/schemas/user.schema'
import { Group } from 'src/groups/schemas/group.schema'

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
export class StudySpace {
    @Prop({ required: true })
    name: string

    @Prop({ default: null })
    details: string

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    members: User[]

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Group' }] })
    groups: Group[]

    @Prop({ default: null })
    image: string
}

export type StudySpaceDocument = StudySpace & Document
export const StudySpaceSchema = SchemaFactory.createForClass(StudySpace)

StudySpaceSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})

StudySpaceSchema.virtual('membersCount')
.get(function () {
    return this.members.length
})