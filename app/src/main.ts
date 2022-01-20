import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WsAdapter } from "@nestjs/platform-ws";
import * as session from "express-session";
import * as PGStore from "connect-pg-simple";
import * as passport from "passport";

const port = 3000;
const PGCon = {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "ft_transcendance",
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // To avoid conflict with frontend, move all routes inside /api/.
    app.setGlobalPrefix("api")

    app.useWebSocketAdapter(new WsAdapter(app));
    app.use(
        session({
            secret: "OwO",
            resave: true,
            saveUninitialized: false,
            store: new (PGStore(session))({
                conString: `pg://${PGCon.user}:${PGCon.password}@${PGCon.host}:${PGCon.port}/${PGCon.database}`,
            }),
            cookie: { maxAge: 2592000 }, // 30 days
        }),
    );
    app.use(passport.initialize())
    app.use(passport.session())
    await app.listen(port, () => {
        console.info(`Listening on http://localhost:${port}`);
    });
}
bootstrap();
