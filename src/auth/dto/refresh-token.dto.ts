import { ApiProperty } from '@nestjs/swagger'
import { IsJWT } from 'class-validator'

export class RefreshTokenDto {
    @ApiProperty({ example: 'asdasdasd12312kl3jaslek', description: 'Токен' })
    @IsJWT()
    refreshToken: string
}