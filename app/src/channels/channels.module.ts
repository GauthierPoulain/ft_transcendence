import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { UsersModule } from 'src/users/users.module';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Channel, Message]), UsersModule],
	controllers: [ChannelsController, MessagesController],
	providers: [ChannelsService]
})
export class ChannelsModule {}
