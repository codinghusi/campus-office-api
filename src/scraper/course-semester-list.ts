import scrapeIt from 'scrape-it';
import cheerio from 'cheerio';
import { Axios } from 'axios';
import parseParams from './parse-params';

export default async function getCourseSemesterList(client: Axios, field: string, group: string, gguid: string) {
    const { data: content } = await client.get(`/views/campus/eventlist.asp?body=False&department=&field=${field}&group=${group}&gguid=${gguid}`);
    const $ = cheerio.load(content);
    const data = scrapeIt.scrapeHTML($, {
        list: {
            listItem: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(n+3) > span",
            data: {
                name: "a",
                href: {
                    selector: "a",
                    attr: "href"
                },
                gguid: {
                    selector: "a",
                    attr: "href",
                    convert(href: string) {
                        return parseParams(href).gguid
                    }
                },
            }
        }
    }) as any;
    return data.list;
}