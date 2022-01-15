import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongoSchema } from 'mongoose'

// schemas
import { Role } from 'src/roles/schemas/role.schema'
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
export class User {
    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true })
    firstName: string

    @Prop({ required: true })
    lastName: string

    @Prop({ default: null })
    middleName: string

    @Prop({ required: true })
    phone: string

    @Prop({ default: null })
    birthDay: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: Role.name })
    role: Role

    @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: StudySpace.name })
    studySpace: StudySpace

    @Prop({ default: null })
    photo: string

    @Prop({ default: false })
    isNew: boolean
}

export type UserDocument = User & Document
export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})