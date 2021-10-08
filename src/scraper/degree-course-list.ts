import scrapeIt from 'scrape-it';
import cheerio from 'cheerio';
import { Axios } from 'axios';
import {parseParams} from './parse-params';

export default async function getDegreeCourseList(client: Axios, courseType: string) {
    const { data: content } = await client.get("/views/campus/fields.asp?body=False&group=" + courseType);
    const $ = cheerio.load(content);
    const data = scrapeIt.scrapeHTML($, {
        courses: {
            listItem: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(n+3) > td > b > span",
            data: {
                name: "a",
                href: {
                    selector: "a",
                    attr: "href"
                },
                group: {
                    selector: "a",
                    attr: "href",
                    convert(href: string) {
                        return parseParams(href).group;
                    }
                },
                field: {
                    selector: "a",
                    attr: "href",
                    convert(href: string) {
                        return parseParams(href).field;
                    }
                }
            }
        }
    }) as any;
    return data.courses;
}