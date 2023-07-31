import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailService } from './email.service';


@Module({
    imports: [CqrsModule],
    providers: [EmailService,],
    exports: [EmailService],
})
export class EmailModule {}