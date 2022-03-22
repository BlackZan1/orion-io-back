import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class UpdateGroupDto {
    @ApiProperty({ example: 'OK-1-2-21', description: 'Название группы' })
    @IsString()
    @Length(1, 50)
    readonly name: string
}