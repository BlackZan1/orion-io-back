import { 
  BadRequestException,
  Controller, 
  Get, 
  Post, 
  Request, 
  UploadedFile, 
  UseInterceptors 
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

// services
import { UsersService } from './users/users.service'
import { AppService } from './app.service'

// schemas
import { User } from './users/schemas/user.schema'

// utils
import { MulterFile } from 'utils/multer-storage'

@ApiTags('Common')
@Controller('api')
export class AppController {
  constructor(
    private appService: AppService,
    private usersService: UsersService
  ) {}

  @ApiOperation({ summary: 'Загрузка нового фото для пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('photo'))
  async updatePhoto(@Request() req, @UploadedFile() file: MulterFile) {
    const { user } = req

    if(!file) throw new BadRequestException('"photo" field is required!')
    if(!file.filename) throw new BadRequestException('Error with file uploading')

    return this.usersService.updatePhoto(user.id, file)
  }
}
