import { ApiProperty } from '@nestjs/swagger'
import { IsHexColor, IsString } from 'class-validator'

export class CreateLessonDto {
    @ApiProperty({ example: 'ООП', description: 'Название дисциплины' })
    @IsString()
    readonly name: string

    @ApiProperty({ example: 'Много практики!', description: 'Описание дисциплины' })
    @IsString()
    readonly details: string

    @ApiProperty({ example: '#000000', description: 'Цвет отображения дисциплины' })
    @IsHexColor()
    readonly color: string
    
    studySpace: any
}