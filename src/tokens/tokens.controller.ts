import { 
    Body, 
    Controller, 
    Get, 
    HttpCode, 
    Post, 
    Request, 
    UseGuards 
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

// services
import { TokensService } from './tokens.service'

// decorators
import { Public } from 'src/auth/public.decorator'
import { Roles } from 'src/roles/roles.decorator'

// guards
import { RolesGuard } from 'src/roles/guards/roles.guard'

// enum
import { RoleEnum } from 'src/roles/roles.enum'
import { TokenActions } from './tokens.enum'

// dto
import { CheckTokenDto } from './dto/check-token.dto'
import { CreateTokenDto } from './dto/create-token.dto'

@ApiTags('Tokens (Взаимодействия с токенами регистрации)')
@Controller('api/tokens')
export class TokensController {
    constructor(
        private tokensService: TokensService
    ) {}

    @ApiOperation({ summary: 'Проверка токена на подлинность - Публичный'  })
    @Public()
    @Post('check')
    check(@Body() dto: CheckTokenDto) {
        return this.tokensService.check(dto.token)
    }

    @ApiOperation({ summary: 'Генерация токена для ссылки'  })
    @Post('generate')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    @HttpCode(201)
    generate(@Request() req, @Body() dto: CreateTokenDto) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.tokensService.generate(studySpaceId, dto.groupId, TokenActions.createUser)
    }
}