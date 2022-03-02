import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateAuditoryDto {
    @ApiProperty({ example: 'ОК-1-2', description: 'Наименование аудитории' })
    @IsString()
    name: string

    @ApiProperty({ example: '1 корпус', description: 'Название здания, в котором распологается аудитория' })
    @IsOptional()
    @IsString()
    building: string

    studySpace: string
}