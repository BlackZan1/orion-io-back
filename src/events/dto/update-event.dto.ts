import { 
    IsDateString,
    IsNumber, 
    IsString, 
    Length, 
    IsOptional
} from 'class-validator'
import { Types } from 'mongoose'

export class UpdateEventDto {
    @IsString()
    @IsOptional()
    readonly lesson: string | Types.ObjectId

    @IsString()
    @Length(1, 150)
    @IsOptional()
    readonly description: string

    @IsDateString()
    @IsOptional()
    readonly startDate: string

    @IsDateString()
    @IsOptional()
    readonly endDate: string

    @IsNumber()
    @IsOptional()
    readonly day: number
}