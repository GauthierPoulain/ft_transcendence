import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class ConnectedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        return context.switchToHttp().getRequest().isAuthenticated();
    }
}
