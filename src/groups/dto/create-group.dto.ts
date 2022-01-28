import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class CreateGroupDto {
    @ApiProperty({ example: 'OK-1-2-21', description: 'Название группы' })
    @IsString()
    @Length(1, 50)
    readonly name: string

    @ApiProperty({ example: 'Умеют ломать стены и строить мосты', description: 'Описание группы' })
    @IsString()
    @Length(1, 300)
    readonly details: string
    
    studySpace: string
    members: string[]
}