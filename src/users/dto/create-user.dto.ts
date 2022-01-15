import { 
    IsDate, 
    IsEmail, 
    IsOptional, 
    IsString, 
    Length 
} from 'class-validator'

// schemas
import { Role } from 'src/roles/schemas/role.schema'
import { StudySpace } from 'src/study-space/schemas/study-space.schema'

export class CreateUserDto {
    @IsEmail()
    readonly email: string

    @IsString()
    @Length(1, 50)
    readonly firstName: string

    @IsString()
    @Length(1, 50)
    readonly lastName: string

    @IsOptional()
    @IsString()
    @Length(1, 50)
    readonly middleName?: string

    @IsOptional()
    @IsString()
    readonly photo?: string

    @IsOptional()
    @IsDate()
    readonly birthDay: string

    @IsString()
    @Length(1, 50)
    readonly password: string

    readonly role?: string | Role
    readonly studySpace?: string | StudySpace
}