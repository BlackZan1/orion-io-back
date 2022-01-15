import { 
    ExecutionContext, 
    Injectable, 
    UnauthorizedException 
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

// decorators
import { IS_PUBLIC_KEY } from '../public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if(isPublic) return true

        return super.canActivate(context)
    }

    handleRequest(err, user) {
        if (err || !user) {
          throw err || new UnauthorizedException({ error: 'JWT is not valid' })
        }

        return user
    }
}