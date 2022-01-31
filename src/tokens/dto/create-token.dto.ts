import { IsString } from 'class-validator'

export class CreateTokenDto {
    @IsString()
    groupId: string
}