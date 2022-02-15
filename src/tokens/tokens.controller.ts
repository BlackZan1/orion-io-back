import { 
    Body, 
    Controller, 
    Delete, 
    HttpCode, 
    Param, 
    Post, 
    Request, 
    UseGuards 
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

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

    @ApiOperation({ summary: 'Генерация токена пользователя для ссылки'  })
    @ApiResponse({ status: 201, type: CreateTokenDto })
    @Post('generate')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    @HttpCode(201)
    generate(@Request() req, @Body() dto: CreateTokenDto) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.tokensService.generate(studySpaceId, dto.groupId, TokenActions.createUser)
    }

    @ApiOperation({ summary: 'Генерация токена админа для ссылки'  })
    @ApiResponse({ status: 201, type: CreateTokenDto })
    @Post('generate-admin')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    @HttpCode(201)
    generateAdmin(@Request() req, @Body() dto: CreateTokenDto) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.tokensService.generate(studySpaceId, dto.groupId, TokenActions.createAdmin)
    }

    @ApiOperation({ summary: 'Генерация токена модератора для ссылки'  })
    @ApiResponse({ status: 201, type: CreateTokenDto })
    @Post('generate-superUser')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    @HttpCode(201)
    generateSuperUser(@Request() req, @Body() dto: CreateTokenDto) {
        const { user } = req
        const studySpaceId = user.studySpace._id

        return this.tokensService.generate(studySpaceId, dto.groupId, TokenActions.createSuperUser)
    }

    @ApiOperation({ summary: 'Удаление токена'  })
    @Delete('/:id')
    @Roles(RoleEnum.Admin)
    @UseGuards(RolesGuard)
    delete(@Param() params) {
        const { id } = params

        return this.tokensService.delete(id)
    }
}