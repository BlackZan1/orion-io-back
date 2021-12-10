import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'

// controllers
import { AppController } from 'src/app.controller'

// services
import { AppService } from 'src/app.service'

// modules
import { UsersModule } from 'src/users/users.module'

// utils
import config from 'config/configuration'

@Module({
  imports: [
    MongooseModule.forRoot(config().database.MONGO_URI),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
