import scrapeIt from 'scrape-it';
import cheerio from 'cheerio';
import { Axios } from 'axios';
import { parseParams, objToParams } from './parse-params';
import { rawToEventVariant } from './event-variant';

function generateCalenderStuff(selector: string) {
    return {
        isAdded: {
            selector,
            attr: "href",
            convert(href: string) {
                return parseParams(href).cmd === "del"
            }
        },
        addToCalenderHref: {
            selector,
            attr: "href",
            convert(href: string) {
                const params = parseParams(href);
                params.cmd = "add";
                return href.slice(0, href.indexOf("?")) + "?" + objToParams(params);
            }
        },
        removeFromCalenderHref: {
            selector,
            attr: "href",
            convert(href: string) {
                const params = parseParams(href);
                params.cmd = "del";
                return href.slice(0, href.indexOf("?")) + "?" + objToParams(params);
            }
        }
    }
}

export default async function getEventDetails(client: Axios, field: string, group: string, gguid: string) {
    const { data: content } = await client.get(`/views/campus/event.asp?field=${field}&group=${group}&gguid=${gguid}`);
    const $ = cheerio.load(content);
    const data = scrapeIt.scrapeHTML($, {
        variant: {
            selector: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > span > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(2)",
            convert(raw) {
                return rawToEventVariant(raw);
            }
        },
        lvCode: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > span > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(4)",
        title: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > span > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(n+2)",
        relatedModules: {
            listItem: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > span > table:nth-child(3) > tbody > tr:nth-child(11) > td > span > table:nth-child(2) > tbody > tr:nth-child(n+1) > td.default",
            data: {
                name: "a",
                href: {
                    selector: "a",
                    attr: "href"
                },
                gguid: {
                    selector: "a",
                    attr: "href",
                    convert(href) {
                        return parseParams(href).gguid;
                    }
                }
            }
        },
        weeklyDates: {
            listItem: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > span > table:nth-child(3) > tbody > tr:nth-child(3) > td > div > table:nth-child(3) > tbody > tr:nth-child(n+1)",
            data: {
                timespan: "td:nth-child(3)",
                location: "td:nth-child(4)",
                begin: "td:nth-child(5)",
                ...generateCalenderStuff("td:nth-child(8) > a")
            }            
        },
        singleDates: {
            listItem: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > span > table:nth-child(3) > tbody > tr:nth-child(3) > td > div > table:nth-child(5) > tbody > tr.hierarchy3",
            data: {
                info: "td:nth-child(2)",
                ...generateCalenderStuff("td:nth-child(3) > a")
            }
        },
        sws: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > span > table:nth-child(10) > tbody > tr:nth-child(4) > td.right",
        credits: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > span > table:nth-child(10) > tbody > tr:nth-child(6) > td.right",
        info: "body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > span > table:nth-child(3) > tbody > tr:nth-child(7) > td > span"
    }) as any;
    return data;
}