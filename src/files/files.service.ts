import { Injectable } from '@nestjs/common'
import * as fs from 'fs'

// utils
import { imgBucket } from 'utils/firebase-config'

@Injectable()
export class FilesService {
    async uploadFile(file: Express.Multer.File) {
        await imgBucket.upload(
            file.path,
            {
                resumable: false, 
                metadata: {
                    metadata: {
                        contentType: file.mimetype
                    }
                }
            }
        )

        await fs.unlinkSync(file.path)
        
        return {
            fileUrl: `https://firebasestorage.googleapis.com/v0/b/fir-monki-scoring.appspot.com/o/${file.filename}?alt=media&token=751f5d3f-b41a-40a7-948a-6156f646f57d`,
            ...file
        }
    }
}
