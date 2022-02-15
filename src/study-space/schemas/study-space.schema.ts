import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

// schemas
import { User } from 'src/users/schemas/user.schema'
import { Group } from 'src/groups/schemas/group.schema'

// config
import configuration from 'config/configuration'

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
    @ApiProperty({ example: 'Harvard University', description: 'Название учебного пространства' })
    @Prop({ required: true })
    name: string

    @ApiProperty({ example: '10 из 10 - мы крутые!', description: 'Описание учебного пространства' })
    @Prop({ default: null })
    details: string

    @ApiProperty({ example: [ 'ID пользователя' ], description: 'Пользователи учебного пространства' })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    members: User[]

    @ApiProperty({ example: [ 'ID группы' ], description: 'Группы учебного пространства' })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Group' }] })
    groups: Group[]

    @ApiProperty({ example: '123123123.png', description: 'Лого учебного пространства' })
    @Prop({ default: null })
    image: string
}

export type StudySpaceDocument = StudySpace & Document
export const StudySpaceSchema = SchemaFactory.createForClass(StudySpace)

StudySpaceSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})

StudySpaceSchema.virtual('imageUrl')
.get(function() {
    if(!this.image) return null
    
    return configuration().baseUrl + 'files/' + this.image
})