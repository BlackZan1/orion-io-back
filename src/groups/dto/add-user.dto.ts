import { ApiProperty } from '@nestjs/swagger'

export class AddUserDto {
    @ApiProperty({ example: '123123123', description: 'ID пользователся для добавления в группу' })
    userId: string
}