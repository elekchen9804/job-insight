import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import got from 'got';
import * as fs from "fs";

import { ICrawlerSetting, IDetailSetting, IJdInfo } from './crawler.model';

@Injectable()
export class CrawlerService {
    /**
     * Trigger crawler
     */
    public async startJdCrawler_JobsDB(): Promise<void> {
        console.log(`Start startJdCrawler_JobsDB`);
        // JOB DB Frontend Tech, Full time, Singapore
        const setting: ICrawlerSetting = {
            siteName: 'jobsdb',
            host: 'https://sg.jobsdb.com',
            search: {
                url: 'https://sg.jobsdb.com/j?a=24h&jt=3&l=Singapore&q=front+end+developer&sp=facet_listed_date',
                linkSelector: '#jobresults .job-container a',
                resultPageCountSelector: '.search-results-count > strong:last',
            },
            detail: {
                title: '.job-view-content h3.job-title',
                location: '#company-location-container .location',
                company: '#company-location-container .company',
                salary: '#job-info-container > div:nth-child(3) > div',
                description: '#job-description-container',
                infoSource: '#job-meta .site',
                postDate: '#job-meta .listed-date',
            }
        };

        try {
            // Define local var
            const jobsUrlList: string[] = [];
            const jobDetailList: IJdInfo[] = [];

            // go to first page and get totalPageCount
            const response = await got(setting.search.url);
            const $ = cheerio.load(response.body);
            const totalPageCount: number = parseInt($(setting.search.resultPageCountSelector).text());
            // const totalPageCount: number = 1;
            // get search results' href list
            for (let page = 1; page <= totalPageCount; page++) {
                // Each Page's URL
                const pageUrl = `${setting.search.url}&p=${page}`
                const response = await got(pageUrl);
                const $ = cheerio.load(response.body);

                $(setting.search.linkSelector).each((i, elem) => {
                    const linkPath = $(elem).attr('href');
                    const host = setting.host;
                    jobsUrlList.push(`${host}${linkPath}`);
                });
            }

            // traverse all links and get detail info
            for (let i = 0; i < jobsUrlList.length; i++) {
                // show progress
                console.log(`${i} / ${jobsUrlList.length}`);
                const jobDetail = await this.getJobDetail(jobsUrlList[i], setting.detail);
                // skip if jobDetail is null
                jobDetail && jobDetailList.push(jobDetail);
            }

            // SHOW INFO
            this.showInfoInConsole(jobDetailList);
            // SAVE data
            this.saveData({ jobsdb: jobDetailList }, setting.siteName);

            return;
        } catch (error) {
            console.log(error);
            return;
        }
    }
    /**
     * Console easy statistic
     */
    public consoleStatistic() {
        const setting = {
            siteName: 'jobsdb',
        };

        const jobList: IJdInfo[] = this.getLocalData<IJdInfo>(setting.siteName);
        this.showInfoInConsole(jobList);
    }

    private async getJobDetail(link: string, detailSetting: IDetailSetting): Promise<IJdInfo | null> {
        let detail: IJdInfo;

        try {
            const response = await got(link);
            const $ = cheerio.load(response.body);

            detail = {
                link: link,
                title: $(detailSetting.title).text(),
                location: $(detailSetting.location).text(),
                company: $(detailSetting.company).text(),
                salary: $(detailSetting.salary).text().includes('$') ? $(detailSetting.salary).text() : '',
                description: $(detailSetting.description).text().replace(/\n/g, ' '),
                infoSource: $(detailSetting.infoSource).text(),
                postDate: $(detailSetting.postDate).text(),
                crawlerCreateDate: Date.now() + '',
            };

            return detail;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    /** Extract description */
    private descriptionExtractor(rawData: string) {
        // Output
        // - 已知技術的比重
        // - 探索出現哪些詞彙
        // - Responsibilities 摘要
        // - Requirement 摘要
    }

    /** Transfer */
    private postDateTransfer(date: string) {

    }

    private showInfoInConsole(list: IJdInfo[]) {
        // 數量
        console.log(`Total Amount: ${list.length}`);

        let salaryList: string[] = [];
        list.forEach((jobDetail) => {
            if (jobDetail?.salary) {
                salaryList.push(jobDetail.salary);
            }
        });
        // 有填寫薪水職缺
        console.log(`Total Salary List: ${salaryList.length}`);
        console.dir(salaryList, { 'maxArrayLength': null });
    }

    // Salary Calculation
    private salaryStatistic() {

    }

    private saveData(data: any, site: string): void {
        const serialData = JSON.stringify(data);
        // write JSON string to a file
        fs.writeFile(`data_${site}.json`, serialData, (err) => {
            if (err) throw err;
            console.log("JSON data is saved.");
        });
    }

    private getLocalData<T>(site: string): Array<T> {
        let list: Array<T>;
        list = JSON.parse(fs.readFileSync(`data_${site}.json`, 'utf8'))[site];
        return list;
    }
}
