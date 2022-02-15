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
export class News {
    @Prop({ required: true })
    title: string

    @Prop({ required: true })
    details: string

    @Prop({ default: null })
    image: string

    @Prop({ required: true, type: Types.ObjectId, ref: User.name })
    author: User

    @Prop({ required: true, type: Types.ObjectId, ref: Group.name })
    group: Group
}

export type NewsDocument = News & Document
export const NewsSchema = SchemaFactory.createForClass(News)

NewsSchema.virtual('id')
.get(function () {
    return this._id.toHexString()
})

NewsSchema.virtual('imageUrl')
.get(function() {
    if(!this.image) return null

    return `https://firebasestorage.googleapis.com/v0/b/fir-monki-scoring.appspot.com/o/${this.image}?alt=media&token=751f5d3f-b41a-40a7-948a-6156f646f57d`
})