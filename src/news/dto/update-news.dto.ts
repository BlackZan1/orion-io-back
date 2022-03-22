import { IsOptional, IsString } from 'class-validator'

export class UpdateNewsDto {
    @IsString()
    @IsOptional()
    readonly title: string

    @IsString()
    @IsOptional()
    readonly details: string
    
    image: any
    group: string
}