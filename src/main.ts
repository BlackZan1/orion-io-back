import { NestFactory } from '@nestjs/core'
import * as helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

// modules
import { AppModule } from 'src/app.module'

// utils
import config from 'config/configuration'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const swagger = new DocumentBuilder()
    .setTitle('OrionIO - Swagger')
    .setDescription('Docs and etc (Rest API)')
    .setVersion('v.1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swagger)

  SwaggerModule.setup('/api/swagger', app, document)

  app.use(helmet())

  await app.listen(config().port)
}

bootstrap()
