import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
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

    @ApiProperty({ example: 'admin', description: 'Значение роли' })
    @Prop({ required: true })
    value: RoleEnum.Admin | RoleEnum.SuperUser | RoleEnum.User

    @ApiProperty({ example: '#f2f2f2', description: 'Цвет отображения роли' })
    @Prop({ required: true })
    color: string

    @ApiProperty({ example: 'Админ', description: 'Название роли' })
    @Prop({ required: true })
    name: string

    @ApiProperty({ example: 'Умеет ломать', description: 'Про роль' })
    @Prop({ default: null })
    about: string
}

export type RoleDocument = Role & Document
export const RoleSchema = SchemaFactory.createForClass(Role)

RoleSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})