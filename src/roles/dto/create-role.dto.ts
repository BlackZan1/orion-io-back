import { ApiProperty } from '@nestjs/swagger'
import { IsHexColor, IsOptional, IsString } from 'class-validator'

export class CreateRoleDto {
    @ApiProperty({ example: 'Админ', description: 'Название роли' })
    @IsString()
    readonly name: string

    @ApiProperty({ example: '#f2f2f2', description: 'Цвет отображения роли' })
    @IsHexColor()
    readonly color: string

    @ApiProperty({ example: 'Умеет ломать стены и строить мосты', description: 'Про роль (необязательно)' })
    @IsOptional()
    @IsString()
    readonly about: string

    @ApiProperty({ example: 'admin', description: 'Значение роли (необязательно, потому что по default будет user)' })
    @IsOptional()
    @IsString()
    readonly value: 'admin' | 'user' | 'superUser'
}