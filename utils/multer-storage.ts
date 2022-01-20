import * as multer from 'multer'
import { v4 as uuid4 } from 'uuid'

export const multerStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, './files')
    },
    filename: (_req, file, cb) => {
      const { originalname } = file
  
      cb(null, uuid4().replace('-', '').replace('-', '').replace('-', '').slice(0, 20) + originalname.slice(originalname.lastIndexOf('.')))
    }
})

export type MulterFile = Express.Multer.File