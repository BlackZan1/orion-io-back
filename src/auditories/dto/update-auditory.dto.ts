import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateAuditoryDto {
    @ApiProperty({ example: 'ОК-1-2', description: 'Наименование аудитории' })
    @IsOptional()
    @IsString()
    name: string

    @ApiProperty({ example: '1 корпус', description: 'Название здания, в котором распологается аудитория' })
    @IsOptional()
    @IsString()
    building: string
}