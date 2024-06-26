import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'

// controllers
import { AppController } from 'src/app.controller'

// services
import { AppService } from 'src/app.service'
import { JwtStrategy } from './auth/strategy/jwt.strategy'

// modules
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { GroupsModule } from './groups/groups.module'
import { StudySpaceModule } from './study-space/study-space.module'

// utils
import config from 'config/configuration'

// guards
import { RolesGuard } from './roles/guards/roles.guard'
import { JwtAuthGuard } from './auth/guards/jwt.guard'

// pipes
import { ValidationPipe } from './pipes/validation.pipe'
import { SchedulesModule } from './schedules/schedules.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot(config().database.MONGO_URI),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    StudySpaceModule,
    GroupsModule,
    SchedulesModule,
    EventsModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ],
})
export class AppModule {}