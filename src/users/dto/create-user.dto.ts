export class CreateUserDto {
    readonly firstName: string
    readonly lastName: string
    readonly middleName?: string
    readonly photo?: string
    readonly birthDay: string
    readonly password: string
    readonly role: string
}