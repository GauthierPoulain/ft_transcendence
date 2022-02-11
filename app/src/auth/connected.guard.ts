import { AuthGuard } from "@nestjs/passport"

export const ConnectedGuard = AuthGuard("jwt")

export const MaybeConnectedGuard = AuthGuard(["jwt", "anonymous"])
