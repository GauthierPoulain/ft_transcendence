require("dotenv").config();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WsAdapter } from "@nestjs/platform-ws";
import * as session from "express-session";
import * as PGStore from "connect-pg-simple";

const port = 3000;
const sessionStored = false;
const PGCon = {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "ft_transcendance",
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useWebSocketAdapter(new WsAdapter(app));

    const sessionSecret = "OwO";
    if (sessionStored) {
        app.use(
            session({
                secret: sessionSecret,
                resave: true,
                saveUninitialized: false,
                store: new (PGStore(session))({
                    conString: `pg://${PGCon.user}:${PGCon.password}@${PGCon.host}:${PGCon.port}/${PGCon.database}`,
                }),
                cookie: { maxAge: 2592000 }, // 30 days
            }),
        );
    } else {
        app.use(
            session({
                secret: sessionSecret,
                resave: false,
                saveUninitialized: false,
            }),
        );
    }

    await app.listen(port, () => {
        console.info(`Listening on http://localhost:${port}`);
    });
}
bootstrap();
