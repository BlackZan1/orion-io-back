import { 
    IsDateString,
    IsHexColor, 
    IsNumber, 
    IsString, 
    Length, 
    IsOptional
} from 'class-validator'

export class UpdateEventDto {
    @IsString()
    @Length(1, 30)
    @IsOptional()
    readonly title: string

    @IsString()
    @Length(1, 150)
    @IsOptional()
    readonly description: string

    @IsHexColor()
    @IsOptional()
    readonly color: string

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