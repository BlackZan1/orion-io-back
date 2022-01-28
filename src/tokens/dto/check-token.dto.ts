import { IsJWT } from 'class-validator'

export class CheckTokenDto {
    @IsJWT()
    token: string
}