import { 
    ArgumentMetadata, 
    BadRequestException, 
    Injectable, 
    PipeTransform 
} from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if(!metatype || !this.typesValidate(metatype)) {
            return value
        }

        const obj = plainToClass(metatype, value)
        const errors = await validate(obj)

        if(errors.length) {
            let messages = errors.map((err) => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`
            })

            throw new BadRequestException(messages)
        }

        return value
    }

    private typesValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object]

        return !types.includes(metatype)
    }
}