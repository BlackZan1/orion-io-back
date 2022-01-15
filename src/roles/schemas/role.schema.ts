import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

// enum
import { RoleEnum } from '../roles.enum'

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
export class Role {
    @Prop({ auto: true, type: Types.ObjectId })
    _id: string

    @Prop({ required: true })
    value: RoleEnum.Admin | RoleEnum.SuperUser | RoleEnum.User

    @Prop({ required: true })
    color: string

    @Prop({ required: true })
    name: string
}

export type RoleDocument = Role & Document
export const RoleSchema = SchemaFactory.createForClass(Role)

RoleSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})