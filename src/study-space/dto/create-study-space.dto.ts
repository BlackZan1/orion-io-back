import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, Length } from 'class-validator'

export class CreateStudySpaceDto {
    @ApiProperty({ example: 'Harvard University', description: 'Название учебного пространства' })
    @IsString()
    @Length(5, 50)
    readonly name: string

    @ApiProperty({ example: '10 из 10 - мы крутые!', description: 'Описание учебного пространства' })
    @IsString()
    @Length(1, 300)
    readonly details: string

    @ApiProperty({ example: 'FILE', description: 'Лого учебного пространства' })
    @IsOptional()
    @IsString()
    image?: string
}