import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'

// controllers
import { FilesController } from './files.controller'

// services
import { FilesService } from './files.service'

// utils
import { multerStorage } from 'utils/multer-storage'

@Module({
  controllers: [
    FilesController
  ],
  providers: [
    FilesService
  ],
  imports: [
    MulterModule.register({
      storage: multerStorage
    })
  ],
  exports: [
    FilesService
  ]
})
export class FilesModule {}
