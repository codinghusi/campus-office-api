import scrapeIt from 'scrape-it';
import cheerio from 'cheerio';
import { Axios } from 'axios';
import {parseParams} from './parse-params';
import { rawToEventVariant } from './event-variant';

interface Event {
    lvCode: string;
    title: string;
    lecturer: string;
    kind: string;
    info: string;
}

interface Type {
    moduleCode: string;
    title: string;
    creditPoints: number;
    lecturer: string;
    events: Event[];
}

export default async function getEventList(client: Axios, field: string, group: string, gguid: string) {
    const { data: content } = await client.get(`/views/campus/eventlist.asp?body=False&mode=field&department=&field=${field}&group=${group}&gguid=${gguid}`);
    const $ = cheerio.load(content);
    const columns = $('body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td > table.grid > tbody > tr > td > table > tbody > tr:nth-child(n+2)')    

    const types: Type[] = [];
    let currentType = null as any;
    columns.each((i, column) => {
        const className = $(column).attr("class");

        // console.log(cheerio.load($.html(column))("tr > td").map(item => $(item).text()));
        // console.log($(column).);
        // console.log(cheerio.load($.html(column))("tr > td").html());
        const html = `<html><head></head><body><table><tbody>${$.html(column)}</tbody></table></body></html>`;

        if (className?.startsWith("line")) {
            const type = scrapeIt.scrapeHTML(html, {
                moduleCode: "tr > td:nth-child(1)",
                title: "tr > td:nth-child(3)",
                creditPoints: {
                    selector: "tr > td:nth-child(4)",
                    convert(points) {
                        return parseInt(points);
                    }
                },
                lecturer: "tr > td:nth-child(5)",
            }) as Type;
            type.events = [];
            types.push(type);
            currentType = type;
        } else if (className?.startsWith("blue")) {
            const event = scrapeIt.scrapeHTML(html, {
                lvCode: "tr > td:nth-child(1)",
                title: "tr > td:nth-child(2)",
                moreHref: {
                    selector: "tr > td:nth-child(2) > a",
                    attr: "href"
                },
                lecturer: "tr > td:nth-child(3)",
                lecturerHref: {
                    selector: "tr > td:nth-child(3) > a",
                    attr: "href"
                },
                variant: {
                    selector: "tr > td:nth-child(4)",
                    convert(label) {
                        const name = rawToEventVariant(label);
                        const num = parseInt(label.match(/\w+\s*\((\d+)\)/)?.[1] ?? "1");
                        return { name, num }
                    }
                },
                info: "tr > td:nth-child(5)",
                gguid: {
                    selector: "tr > td:nth-child(2) > a",
                    attr: "href",
                    convert(href) {
                        return parseParams(href).gguid;
                    }
                },
                group: {
                    selector: "tr > td:nth-child(2) > a",
                    attr: "href",
                    convert(href) {
                        return parseParams(href).group;
                    }
                },
                field: {
                    selector: "tr > td:nth-child(2) > a",
                    attr: "href",
                    convert(href) {
                        return parseParams(href).gguid;
                    }
                }
            }) as Event;
            currentType?.events.push(event);
            if (currentType) {
                currentType.lvCode = event.lvCode;
            }
        }
    });

    return types;
}