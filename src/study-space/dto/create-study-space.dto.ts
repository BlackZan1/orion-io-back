import { IsOptional, IsString, Length } from 'class-validator'

export class CreateStudySpaceDto {
    @IsString()
    @Length(5, 50)
    readonly name: string

    @IsString()
    @Length(1, 300)
    readonly details: string

    @IsOptional()
    @IsString()
    image?: string
}