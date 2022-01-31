import { ApiProperty } from '@nestjs/swagger'
import { 
    IsDate, 
    IsEmail, 
    IsJWT, 
    IsOptional, 
    IsPhoneNumber, 
    IsString, 
    Length 
} from 'class-validator'

// schemas
import { Role } from 'src/roles/schemas/role.schema'
import { StudySpace } from 'src/study-space/schemas/study-space.schema'

export class CreateUserDto {
    @ApiProperty({ example: 'nazar@admin.com', description: 'Email пользователя' })
    @IsEmail()
    readonly email: string

    @ApiProperty({ example: 'Nazar', description: 'Имя пользователя' })
    @IsString()
    @Length(1, 50)
    readonly firstName: string

    @ApiProperty({ example: 'Saaliev', description: 'Фамилия пользователя' })
    @IsString()
    @Length(1, 50)
    readonly lastName: string

    @ApiProperty({ example: 'Anarilyevich', description: 'Отчество пользователя' })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    readonly middleName?: string

    @ApiProperty({ example: '+996111111111', description: 'Тел. номер пользователя' })
    @IsPhoneNumber()
    readonly phone?: string

    @ApiProperty({ example: '12312312123.png', description: 'Фото пользователя' })
    @IsOptional()
    @IsString()
    readonly photo?: string

    @ApiProperty({ example: '2011-10-05T14:48:00.000Z', description: 'День рождения пользователя' })
    @IsOptional()
    @IsDate()
    readonly birthDay: string

    @ApiProperty({ example: '123123123', description: 'Пароль пользователя' })
    @IsString()
    @Length(9, 50)
    readonly password: string

    readonly role?: string | Role
    readonly studySpace?: string | StudySpace
}

export class CreateUserTokenDto {
    @ApiProperty({ example: 'nazar@admin.com', description: 'Email пользователя' })
    @IsEmail()
    readonly email: string

    @ApiProperty({ example: 'Nazar', description: 'Имя пользователя' })
    @IsString()
    @Length(1, 50)
    readonly firstName: string

    @ApiProperty({ example: 'Saaliev', description: 'Фамилия пользователя' })
    @IsString()
    @Length(1, 50)
    readonly lastName: string

    @ApiProperty({ example: 'Anarilyevich', description: 'Отчество пользователя' })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    readonly middleName?: string

    @ApiProperty({ example: '+996111111111', description: 'Тел. номер пользователя' })
    @IsPhoneNumber()
    readonly phone?: string

    @ApiProperty({ example: '12312312123.png', description: 'Фото пользователя' })
    @IsOptional()
    @IsString()
    readonly photo?: string

    @ApiProperty({ example: '2011-10-05T14:48:00.000Z', description: 'День рождения пользователя' })
    @IsOptional()
    @IsDate()
    readonly birthDay: string

    @ApiProperty({ example: '123123123', description: 'Пароль пользователя' })
    @IsString()
    @Length(9, 50)
    readonly password: string

    @ApiProperty({ example: '123123123', description: 'Токен регистрации' })
    @IsJWT()
    readonly token: string

    readonly role?: string | Role
    readonly studySpace?: string | StudySpace
}