import { Controller, Get, Param, Query, Redirect, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";

const api42Config = {
  uid: "fa0f13e6daf52c3590217ebadc4c2cd9e757fac12b997d6abf3ac7d089af7254",
  redirect_uri: "http://localhost:3000/",
};

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("redirect")
  redirect(@Res() res) {
    return res.redirect(
      `https://api.intra.42.fr/oauth/authorize?client_id=${api42Config.uid}&redirect_uri=${api42Config.redirect_uri}&response_type=code`,
    );
  }

  @Get("callback")
  callback(@Query("code") code): string {
    console.log(code);

    return "ok";
  }
}
