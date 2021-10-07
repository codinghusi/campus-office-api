import scrapeIt from 'scrape-it';
import cheerio from 'cheerio';
import { Axios } from 'axios';
import parseParams from './parse-params';

export default async function getExaminationRegulationList(client: Axios, field: string, group: string) {
    const { data: content } = await client.get(`/views/campus/subfields.asp?body=False&department=&field=${field}&group=${group}`);
    const $ = cheerio.load(content);
    const data = scrapeIt.scrapeHTML($, {
        list: {
            listItem: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table.grid > tbody > tr > td > table > tbody > tr.hierarchy3 > td > table > tbody > tr > td:nth-child(n+3) > span",
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