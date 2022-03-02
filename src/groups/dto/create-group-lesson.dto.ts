import { IsString } from 'class-validator'

export class CreateGroupLessonDto {
    @IsString()
    lesson: string

    @IsString()
    lector: any

    group: any
}