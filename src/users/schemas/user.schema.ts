import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ versionKey: false, timestamps: true })
export class User {
    @Prop({ auto: true, type: Types.ObjectId })
    id: string

    @Prop({ required: true })
    firstName: string

    @Prop({ required: true })
    lastName: string

    @Prop()
    middleName: string

    @Prop()
    birthDay: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true })
    role: string    

    @Prop()
    photo: string
}

export type UserDocument = User & Document
export const UserSchema = SchemaFactory.createForClass(User)