import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongoSchema } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

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
    @ApiProperty({ example: 'nazar@admin.com', description: 'Email пользователя' })
    @Prop({ required: true, unique: true })
    email: string

    @ApiProperty({ example: 'Nazar', description: 'Имя пользователя' })
    @Prop({ required: true })
    firstName: string

    @ApiProperty({ example: 'Saaliev', description: 'Фамилия пользователя' })
    @Prop({ required: true })
    lastName: string

    @ApiProperty({ example: 'Anarilyevich', description: 'Отчество пользователя' })
    @Prop({ default: null })
    middleName: string

    @ApiProperty({ example: '+996111111111', description: 'Тел. номер пользователя' })
    @Prop({ required: true })
    phone: string

    @ApiProperty({ example: '2011-10-05T14:48:00.000Z', description: 'День рождения пользователя' })
    @Prop({ default: null })
    birthDay: string

    @ApiProperty({ example: '123123123', description: 'Пароль пользователя' })
    @Prop({ required: true })
    password: string

    @ApiProperty({ 
        example: 'ID роли', 
        description: 'Роль пользователя' 
    })
    @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: Role.name })
    role: Role

    @ApiProperty({ 
        example: 'ID учебного пространства', 
        description: 'Учебное пространство пользователя' 
    })
    @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: StudySpace.name })
    studySpace: StudySpace

    @ApiProperty({ example: '12312312123.png', description: 'Фото пользователя' })
    @Prop({ default: null })
    photo: string

    @ApiProperty({ example: false, description: 'Статус полной регистрации пользователя' })
    @Prop({ default: false })
    isNew: boolean

    @ApiProperty({ example: false, description: 'Пользователь учитель или нет' })
    @Prop({ default: false })
    isTeacher: boolean
}

export type UserDocument = User & Document
export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('id')
.get(function() {
    return this._id.toHexString()
})

UserSchema.virtual('photoUrl')
.get(function() {
    if(!this.photo) return null

    // return configuration().baseUrl + 'files/' + this.photo
    return `https://firebasestorage.googleapis.com/v0/b/fir-monki-scoring.appspot.com/o/${this.photo}?alt=media&token=751f5d3f-b41a-40a7-948a-6156f646f57d`
})