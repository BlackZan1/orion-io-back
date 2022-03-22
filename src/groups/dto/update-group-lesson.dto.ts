import { IsOptional, IsString } from 'class-validator'

export class UpdateGroupLessonDto {
    @IsString()
    @IsOptional()
    lesson: string

    @IsString()
    @IsOptional()
    lector: any
}