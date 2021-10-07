import scrapeIt from 'scrape-it';
import cheerio from 'cheerio';
import { Axios } from 'axios';
import parseParams from './parse-params';

export default async function getSemesterList(client: Axios) {
    const { data: content } = await client.get("/views/campus/selectterm.asp");
    const $ = cheerio.load(content);
    const data = scrapeIt.scrapeHTML($, {
        semesters: {
            listItem: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(n+3) > td",
            data: {
                name: "b > a",
                href: {
                    selector: "b > a",
                    attr: "href"
                },
                term: {
                    selector: "b > a",
                    attr: "href",
                    convert(href: string) {
                        return parseParams(href).term
                    }
                },
            }
        }
    }) as any;
    return data.semesters;
}