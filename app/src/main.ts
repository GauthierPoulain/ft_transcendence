import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WsAdapter } from "@nestjs/platform-ws";

const port = 3000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // To avoid conflict with frontend, move all routes inside /api/.
    app.setGlobalPrefix("api")

    app.enableCors();

    app.useWebSocketAdapter(new WsAdapter(app));

    await app.listen(port, () => {
        console.info(`Listening on http://localhost:${port}`);
    });
}
bootstrap();
