import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// dto
import { CreateAuditoryDto } from './dto/create-auditory.dto'
import { UpdateAuditoryDto } from './dto/update-auditory.dto'

// schemas
import { Auditory, AuditoryDocument } from './schemas/auditory.schema'

@Injectable()
export class AuditoriesService {
    constructor(
        @InjectModel(Auditory.name) private auditoryModel: Model<AuditoryDocument>
    ) {}

    async create(dto: CreateAuditoryDto) {
        return new this.auditoryModel(dto).save()
    }

    async getById(id: string, studySpaceId: any): Promise<AuditoryDocument> {
        const auditory = await this.auditoryModel
            .findOne({
                _id: id,
                studySpace: studySpaceId
            })

        if(!auditory) throw new BadRequestException('auditory not found!')

        return auditory
    }

    async update(id: string, studySpaceId: any, dto: UpdateAuditoryDto): Promise<AuditoryDocument> {
        const auditory = await this.getById(id, studySpaceId)

        await auditory.updateOne(dto)

        return this.getById(id, studySpaceId)
    }

    async getByStudySpace(studySpaceId: any, q: string): Promise<AuditoryDocument[]> {
        let modelProps: any = {
            studySpace: studySpaceId
        }

        if(q) {
            modelProps = {
                ...modelProps,
                name: {
                    $regex: q,
                    $options: 'i'
                }
            }
        }

        return this.auditoryModel
            .find(modelProps)
            .limit(100)
    }

    async delete(id: string, studySpaceId: any) {
        const auditory = await this.getById(id, studySpaceId)

        await auditory.remove()

        return {
            success: true
        }
    }
}
