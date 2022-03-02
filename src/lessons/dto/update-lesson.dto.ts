import { ApiProperty } from '@nestjs/swagger'
import { IsHexColor, IsOptional, IsString } from 'class-validator'

export class UpdateLessonDto {
    @ApiProperty({ example: 'ООП', description: 'Название дисциплины' })
    @IsOptional()
    @IsString()
    readonly name: string

    @ApiProperty({ example: 'Много практики!', description: 'Описание дисциплины' })
    @IsOptional()
    @IsString()
    readonly details: string

    @ApiProperty({ example: '#000000', description: 'Цвет отображения дисциплины' })
    @IsOptional()
    @IsHexColor()
    readonly color: string

    studySpace: any
}