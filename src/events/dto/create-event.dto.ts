import { 
    IsDateString,
    IsHexColor, 
    IsNumber, 
    IsString, 
    Length, 
} from 'class-validator'

export class CreateEventDto {
    @IsString()
    @Length(1, 30)
    readonly title: string

    @IsString()
    @Length(1, 150)
    readonly description: string

    @IsHexColor()
    readonly color: string

    @IsDateString()
    readonly startDate: string

    @IsDateString()
    readonly endDate: string

    @IsNumber()
    readonly day: number

    schedule?: string
}