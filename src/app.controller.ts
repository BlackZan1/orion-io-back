import { 
  BadRequestException,
  Body,
  Controller, 
  Post, 
  Request, 
  UploadedFile, 
  UseInterceptors 
} from '@nestjs/common'
import { 
  ApiBearerAuth, 
  ApiBody, 
  ApiOperation, 
  ApiResponse, 
  ApiTags 
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

// dto
import { CheckEmailDto } from './users/dto/check-email.dto'

// services
import { UsersService } from './users/users.service'

// decorators
import { Public } from './auth/public.decorator'

// schemas
import { User } from './users/schemas/user.schema'

// utils
import { MulterFile } from 'utils/multer-storage'

@ApiTags('Common')
@ApiBearerAuth()
@Controller('api')
export class AppController {
  constructor(
    private usersService: UsersService
  ) {}

  @ApiOperation({ summary: 'Загрузка нового фото для пользователя' })
  @ApiResponse({ status: 200, type: User })
  @ApiBody({
    schema: {
      properties: {
        file: {
          type: 'string',
          format: 'file'
        }
      }
    }
  })
  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('photo'))
  async updatePhoto(@Request() req, @UploadedFile() file: MulterFile) {
    const { user } = req

    if(!file) throw new BadRequestException('"photo" field is required!')
    if(!file.filename) throw new BadRequestException('Error with file uploading')

    return this.usersService.updatePhoto(user.id, file)
  }

  @ApiOperation({ summary: 'Проверка на наличие зарегистрированного email - Публичный' })
  @Public()
  @Post('check-email')
  async checkEmail(@Body() dto: CheckEmailDto) {
    const { email } = dto

    const user = await this.usersService.getByEmail(email)

    if(!user) {
      return {
        success: true
      }
    }

    return {
      success: false
    }
  }
}
