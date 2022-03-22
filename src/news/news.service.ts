import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// services
import { FilesService } from 'src/files/files.service'

// dto
import { CreateNewsDto } from './dto/create-news.dto'
import { UpdateNewsDto } from './dto/update-news.dto'

// schemas
import { News, NewsDocument } from './schemas/news.schema'

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News.name) private newsModel: Model<NewsDocument>,
        private filesService: FilesService
    ) {}

    async getById(id: string, groupId: any) {
        const news = await this.newsModel
            .findOne({
                _id: id,
                group: groupId
            })
            .populate({ path: 'author', populate: 'role' })

        if(!news) throw new BadRequestException('News object is not found!')

        return news
    }

    async create(dto: CreateNewsDto) {
        return new this.newsModel(dto).save()
    }

    async getAll(groupId: any, params: { page?: number, limit?: number }) {
        const limit = +params.limit || 10
        const page = +params.page || 1

        return this.newsModel
            .find({ group: groupId })
            .sort('-createdAt')
            .populate({ path: 'author', populate: 'role' })
            .limit(limit)
            .skip((page * limit) - limit)
    }

    async update(id: string, groupId: any, dto: UpdateNewsDto) {
        const news = await this.getById(id, groupId)

        if(news.image && dto.image) {
            const oldDeleted = await this.filesService.removeFile(news.image)

            console.log(oldDeleted)
        }

        await news.updateOne(dto)

        return this.getById(id, groupId)
    }

    async delete(id: string, groupId: any) {
        const news = await this.getById(id, groupId)

        await news.remove()

        return {
            success: true
        }
    }
}
