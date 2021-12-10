import { NestFactory } from '@nestjs/core'
import * as helmet from 'helmet'

// modules
import { AppModule } from 'src/app.module'

// utils
import config from 'config/configuration'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  app.use(helmet())

  await app.listen(config().port)
}

bootstrap()
