import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length } from 'class-validator'

export class SignInDto {
    @ApiProperty({ example: 'nazar@admin.com', description: 'Email пользователя' })
    @IsEmail()
    readonly email: string

    @ApiProperty({ example: '123123123', description: 'Пароль пользователя' })
    @IsString()
    @Length(9, 50)
    readonly password: string
}