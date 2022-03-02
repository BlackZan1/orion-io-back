import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// controllers
import { AuditoriesController } from './auditories.controller'

// services
import { AuditoriesService } from './auditories.service'

// schemas
import { Auditory, AuditorySchema } from './schemas/auditory.schema'

@Module({
  controllers: [
    AuditoriesController
  ],
  providers: [
    AuditoriesService
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Auditory.name, schema: AuditorySchema }
    ])
  ]
})
export class AuditoriesModule {}
