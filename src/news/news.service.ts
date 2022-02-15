import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// dto
import { CreateNewsDto } from './dto/create-news.dto'

// modules
import { NewsModule } from './news.module'

// schemas
import { News } from './schemas/news.schema'

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News.name) private newsModel: Model<NewsModule>
    ) {}

    async getById(id: string) {
        const news = await this.newsModel
            .findById(id)
            .populate({ path: 'author', populate: 'role' })

        if(!news) throw new BadRequestException('News object is not found!')

        return news
    }

    async create(dto: CreateNewsDto) {
        const news = await new this.newsModel(dto).save()

        return this.getById(news.id)
    }

    async getAll(groupId: any, params: { page?: number, limit?: number }) {
        const limit = params.limit || 10
        const page = params.page || 1

        return this.newsModel
            .find({ group: groupId })
            .sort('-createdAt')
            .populate({ path: 'author', populate: 'role' })
            .limit(limit)
            .skip((page * limit) - limit)
    }
}
