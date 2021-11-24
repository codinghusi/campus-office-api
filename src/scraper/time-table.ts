import cheerio from 'cheerio';
import { Axios } from 'axios';
import {parseParams} from './parse-params';
import ical from 'ical';

export default async function getTimeTable(client: Axios) {
    const { data: content } = await client.get(`/views/calendar/timeTable.asp`);
    const $ = cheerio.load(content);
    const href = $("body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td.content-cell > table:nth-child(11) > tbody > tr > td > a").attr("href") as string;
    
    const { data: icalFile } = await client.get("/views/calendar/" + href);
    const icalData = ical.parseICS(icalFile);

    return icalData;
}