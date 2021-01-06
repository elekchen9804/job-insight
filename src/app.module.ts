import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { CrawlerModule } from './crawler/crawler.module';

@Module({
  imports: [TasksModule, CrawlerModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
