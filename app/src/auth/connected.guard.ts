import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class ConnectedGuard extends AuthGuard("jwt") {
    canActivate(context: ExecutionContext) {
        // TODO: Check if the token is an authentication one.

        console.debug("ConnectedGuard#canActivate called")
        return super.canActivate(context)
    }
}
