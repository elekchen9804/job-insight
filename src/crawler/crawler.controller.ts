import { Controller, Get } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {

    constructor(private crawlerService: CrawlerService) { }

    @Get()
    getJdInfo() {
        this.crawlerService.startJdCrawler_JobsDB();
    }

    @Get('query')
    consoleStatistic() {
        return this.crawlerService.consoleStatistic();
    }
}
