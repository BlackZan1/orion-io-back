import { IsHexColor, IsOptional, IsString } from 'class-validator'

export class CreateRoleDto {
    @IsString()
    readonly name: string

    @IsHexColor()
    readonly color: string

    @IsOptional()
    @IsString()
    readonly about: string

    @IsOptional()
    @IsString()
    readonly value: 'admin' | 'user' | 'superUser'
}