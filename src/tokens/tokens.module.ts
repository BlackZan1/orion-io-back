import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'

// schemas
import { Token, TokenSchema } from './schemas/token.schema'

// controllers
import { TokensController } from './tokens.controller'

// services
import { TokensService } from './tokens.service'

// utils
import config from 'config/configuration'

@Module({
  controllers: [
    TokensController
  ],
  providers: [
    TokensService
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema }
    ]),
    JwtModule.register({
      secret: config().regTokenSecret,
      signOptions: {
        expiresIn: '30d'
      }
    })
  ],
  exports: [
    TokensService
  ]
})
export class TokensModule {}
