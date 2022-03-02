import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsEmail, IsOptional, IsString, Length } from 'class-validator'

export class UpdateUserDto {
    @ApiProperty({ example: 'nazar@admin.com', description: 'Email пользователя' })
    @IsOptional()
    @IsEmail()
    readonly email: string

    @ApiProperty({ example: 'Nazar', description: 'Имя пользователя' })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    readonly firstName: string

    @ApiProperty({ example: 'Saaliev', description: 'Фамилия пользователя' })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    readonly lastName: string

    @ApiProperty({ example: 'Anarilyevich', description: 'Отчество пользователя' })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    readonly middleName?: string

    @ApiProperty({ example: '+996111111111', description: 'Тел. номер пользователя' })
    @IsOptional()
    @IsString()
    readonly phone?: string

    @ApiProperty({ example: '12312312123.png', description: 'Фото пользователя' })
    @IsOptional()
    photo?: any

    @ApiProperty({ example: '2011-10-05T14:48:00.000Z', description: 'День рождения пользователя' })
    @IsOptional()
    @IsDateString()
    readonly birthDay: string

    @ApiProperty({ example: '123123123', description: 'Пароль пользователя' })
    @IsOptional()
    @IsString()
    @Length(9, 50)
    readonly password: string
}