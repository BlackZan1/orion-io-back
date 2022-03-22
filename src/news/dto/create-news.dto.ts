import { IsOptional, IsString } from 'class-validator'

export class CreateNewsDto {
    @IsString()
    readonly title: string

    @IsString()
    @IsOptional()
    readonly details: string
    
    image: any
    group: string
}