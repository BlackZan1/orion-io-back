import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

// schemas
import { User } from 'src/users/schemas/user.schema'

@Schema({
    versionKey: false,
    timestamps: false
})
export class Jwt {
    @Prop({ required: true })
    refreshToken: string

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId: User
}

export type JwtDocument = Jwt & Document
export const JwtSchema = SchemaFactory.createForClass(Jwt)