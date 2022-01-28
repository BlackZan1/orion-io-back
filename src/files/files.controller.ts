import { 
    Controller, 
    Get, 
    Param, 
    Post, 
    Res, 
    UploadedFile, 
    UseInterceptors 
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import * as https from 'https'
import { 
    ApiBearerAuth, 
    ApiNoContentResponse, 
    ApiOperation, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger'

// services
import { FilesService } from './files.service'

// decoratots
import { Public } from 'src/auth/public.decorator'

@ApiTags('Files')
@ApiBearerAuth()
@Controller('/api/files')
export class FilesController {
    constructor(
        private filesService: FilesService
    ) {}

    @ApiOperation({ summary: 'Загрузить файл (ДЕМО) - Публичный' })
    @ApiResponse({ status: 200, type: '{ fileUrl: string }' })
    @Public()
    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        return this.filesService.uploadFile(file)
    }

    @ApiOperation({ summary: 'Получить файл (ДЕМО) - Публичный' })
    @ApiNoContentResponse()
    @Public()
    @Get(':filename')
    async get(@Param() params, @Res() res) {
        const { filename } = params

        https
        .get(
            `https://firebasestorage.googleapis.com/v0/b/fir-monki-scoring.appspot.com/o/${filename}?alt=media&token=751f5d3f-b41a-40a7-948a-6156f646f57d`, 
            (stream) => stream.pipe(res)
        )
    }
}
