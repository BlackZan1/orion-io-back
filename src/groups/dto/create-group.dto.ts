import { IsString, Length } from 'class-validator'

export class CreateGroupDto {
    @IsString()
    @Length(1, 50)
    readonly name: string

    @IsString()
    @Length(1, 300)
    readonly details: string
    
    studySpace: string
    members: string[]
}