import { 
    IsDateString,
    IsNumber, 
    IsString, 
    Length, 
} from 'class-validator'
import { Types } from 'mongoose'

export class CreateEventDto {
    @IsString()
    readonly lesson: string | Types.ObjectId

    @IsString()
    @Length(1, 150)
    readonly description: string

    @IsDateString()
    readonly startDate: string

    @IsDateString()
    readonly endDate: string

    @IsNumber()
    readonly day: number

    schedule?: string
}