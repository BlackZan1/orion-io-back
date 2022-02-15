import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'

// modules
import { GroupsModule } from 'src/groups/groups.module'
import { FilesModule } from 'src/files/files.module'

// controllers
import { NewsController } from './news.controller'

// services
import { NewsService } from './news.service'

// schemas
import { News, NewsSchema } from './schemas/news.schema'

// utils
import { multerStorage } from 'utils/multer-storage'

@Module({
  controllers: [
    NewsController
  ],
  providers: [
    NewsService
  ],
  imports: [
    forwardRef(() => GroupsModule),
    FilesModule,
    MulterModule.register({
      storage: multerStorage
    }),
    MongooseModule.forFeature([
      { schema: NewsSchema, name: News.name }
    ])
  ],
  exports: [
    NewsService
  ]
})
export class NewsModule {}
