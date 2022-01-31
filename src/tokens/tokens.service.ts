import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

// schemas
import { Token, TokenDocument } from './schemas/token.schema'

// enum
import { TokenActions } from './tokens.enum'

@Injectable()
export class TokensService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument> 
    ) {}

    async generate(studySpaceId: string, groupId: any, action: TokenActions): Promise<TokenDocument> {
        const dto = {
            token: this.jwtService.sign({ studySpaceId, groupId, action }),
            studySpace: studySpaceId,
            group: groupId
        }

        return new this.tokenModel(dto).save()
    }

    async check(token: string) {
        const currentToken = await this.tokenModel
            .findOne({ token })

        if(!currentToken) throw new BadRequestException('Token is not found!')

        try {
            const decodeToken: any = this.jwtService.verify(token)

            return {
                action: decodeToken.action,
                success: true
            }
        }
        catch(err) {
            throw new BadRequestException('Token is already expired!')
        }
    }

    async delete(token: string) {
        return this.tokenModel
            .findOneAndDelete({ token })
    }

    async getAllByGroupId(groupId: any): Promise<TokenDocument[]> {
        return this.tokenModel
            .find({ group: groupId })
            .select('-_id')
    }
}
