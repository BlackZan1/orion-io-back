import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// dto
import { CreateLessonDto } from './dto/create-lesson.dto'
import { UpdateLessonDto } from './dto/update-lesson.dto'

// schemas
import { Lesson, LessonDocument } from './schemas/lesson.schema'

@Injectable()
export class LessonsService {
    constructor (
        @InjectModel(Lesson.name) private lessonsModel: Model<LessonDocument>
    ) {}

    async create(dto: CreateLessonDto) {
        return new this.lessonsModel(dto).save()
    }

    async getById(id: string, studySpaceId: any): Promise<LessonDocument> {
        const lesson = await this.lessonsModel
            .findOne({
                _id: id,
                studySpace: studySpaceId
            })

        if(!lesson) throw new BadRequestException('Lesson not found!')

        return lesson
    }

    async update(id: string, studySpaceId: any, dto: UpdateLessonDto): Promise<LessonDocument> {
        const lesson = await this.getById(id, studySpaceId)

        await lesson.updateOne(dto)

        return this.getById(id, studySpaceId)
    }

    async getByStudySpace(studySpaceId: any, params: { page?: number, limit?: number, q?: string }): Promise<LessonDocument[]> {
        const limit = +params.limit || 10
        const page = +params.page || 1

        let modelProps: any = {
            studySpace: studySpaceId
        }

        if(params.q) {
            modelProps = {
                ...modelProps,
                name: {
                    $regex: params.q,
                    $options: 'i'
                }
            }
        }

        return this.lessonsModel
            .find(modelProps)
            .limit(limit)
            .skip((page * limit) - limit)
    }

    async delete(id: string, studySpaceId: any) {
        const lesson = await this.getById(id, studySpaceId)

        await lesson.remove()

        return {
            success: true
        }
    }
}
