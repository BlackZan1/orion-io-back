import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class AddUserDto {
    @ApiProperty({ example: '123123123', description: 'ID пользователся для добавления в группу' })
    @IsString()
    userId: string

    @ApiProperty({ example: true, description: 'Будет ли удален пользователь в предыдущих группах' })
    @IsOptional()
    @IsBoolean()
    deletePrev?: boolean
}