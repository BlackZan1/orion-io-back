import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

// enum
import { TokenActions } from './tokens.enum'

@Injectable()
export class TokensService {
    constructor(
        private jwtService: JwtService
    ) {}

    async generate(studySpaceId: string, action: TokenActions) {
        return this.jwtService.sign({ studySpaceId, action })
    }

    async check(token: string) {
        try {
            console.log(this.jwtService.verify(token))
            console.log(this.jwtService.decode(token))

            return {
                result: this.jwtService.verify(token),
                success: true
            }
        }
        catch(err) {
            console.log(err)
            
            return {
                message: 'JWT is already expired',
                success: false
            }
        }
    }
}
