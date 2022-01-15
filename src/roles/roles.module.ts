import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// services
import { RolesService } from './roles.service'

// controllers
import { RolesController } from './roles.controller'

// schemas
import { Role, RoleSchema } from './schemas/role.schema'

@Module({
  providers: [
    RolesService
  ],
  controllers: [
    RolesController
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema }
    ])
  ],
  exports: [
    RolesService
  ]
})
export class RolesModule {}
