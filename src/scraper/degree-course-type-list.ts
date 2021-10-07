import scrapeIt from 'scrape-it';
import cheerio from 'cheerio';
import { Axios } from 'axios';
import parseParams from './parse-params';

export default async function getDegreeCourseTypeList(client: Axios) {
    const { data: content } = await client.get("/views/campus/groups.asp");
    // console.log(content);
    const $ = cheerio.load(content);
    const data = scrapeIt.scrapeHTML($, {
        types: {
            listItem: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(n+4) > td",
            data: {
                name: "b > a",
                href: {
                    selector: "b > a",
                    attr: "href"
                },
                group: {
                    selector: "b > a",
                    attr: "href",
                    convert(href: string) {
                        return parseParams(href).group;
                    }
                }
            }
        }
    }) as any;
    return data.types;
}