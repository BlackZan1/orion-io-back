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
import * as fs from 'fs'

// services
import { FilesService } from './files.service'

// decoratots
import { Public } from 'src/auth/public.decorator'

// utils
import { imgBucket } from 'utils/firebase-config'

@Controller('/api/files')
export class FilesController {
    constructor(
        private filesService: FilesService
    ) {}

    @Public()
    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        const uploadedFile = await this.filesService.uploadFile(file)
        
        return uploadedFile
    }

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
