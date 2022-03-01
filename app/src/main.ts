import { NestFactory, Reflector } from "@nestjs/core"
import { AppModule } from "./app.module"
import { WsAdapter } from "@nestjs/platform-ws"
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common"

const port = 3005

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true })

    // To avoid conflict with frontend, move all routes inside /api/.
    app.setGlobalPrefix("api")
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

    app.useWebSocketAdapter(new WsAdapter(app))

    await app.listen(port, () => {
        console.info(`Listening on http://localhost:${port}`)
    })
}
bootstrap()
