import { NestFactory } from '@nestjs/core'
import * as helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

// modules
import { AppModule } from 'src/app.module'

// utils
import config from 'config/configuration'

const whiteList = [
  'http://localhost:3000', 'https://orion-io.web.app', 'http://airi-studio.xyz', 'http://orion.airi-studio.com', 'http://airi-studio.com'
]

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const swagger = new DocumentBuilder()
    .setTitle('OrionIO - Swagger')
    .setDescription('Docs and etc (Rest API)')
    .setVersion('v.1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swagger)

  SwaggerModule.setup('/api/swagger', app, document)

  app.use(helmet())
  app.enableCors({
    origin: function(origin, callback) {
      console.log(!origin || whiteList.indexOf(origin) !== -1)
      
      if (!origin || whiteList.indexOf(origin) !== -1) callback(null, true)
      else callback(new Error('Not allowed by CORS'))
    },
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
  })

  await app.listen(config().port)
}

bootstrap()