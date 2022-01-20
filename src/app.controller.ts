import { 
  BadRequestException,
  Controller, 
  Get, 
  Post, 
  Request, 
  UploadedFile, 
  UseInterceptors 
} from '@nestjs/common'

// services
import { UsersService } from './users/users.service'
import { AppService } from './app.service'
import { FileInterceptor } from '@nestjs/platform-express'

// utils
import { MulterFile } from 'utils/multer-storage'

@Controller('api')
export class AppController {
  constructor(
    private appService: AppService,
    private usersService: UsersService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('photo'))
  async updatePhoto(@Request() req, @UploadedFile() file: MulterFile) {
    const { user } = req

    if(!file) throw new BadRequestException('"photo" field is required!')
    if(!file.filename) throw new BadRequestException('Error with file uploading')

    return this.usersService.updatePhoto(user.id, file)
  }
}
