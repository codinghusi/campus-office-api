import axios, { Axios } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import getDegreeCourseList from './scraper/degree-course-list';
import FormData from 'form-data';
import getSemesterList from './scraper/semester-list';
import getDegreeCourseTypeList from './scraper/degree-course-type-list';
import getEventList from './scraper/event-list';
import getEventDetails from './scraper/event-details';

export default class Client {
    private constructor(private axios: Axios) { }

    static async login(baseurl: string, auth: {username: string, password: string}) {
        // const data = new FormData();
        // data.append("screensize", "1024");
        // data.append("size", "");
        // data.append("initiallang", "de");
        // data.append("u", "u");
        // data.append("p", "p");
        // data.append("login", "Login");
        const params = {
            screensize: 1024,
            size: "",
            initiallang: "de",
            u: auth.username,
            p: auth.password,
            login: "Login"
        }

        const jar = new CookieJar();
        const client = wrapper(axios.create({
            jar,
            baseURL: baseurl,
            withCredentials: true,
            headers: {
                "Accept":           "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Encoding":  "gzip, deflate, br",
                "Accept-Language":  "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
                "Cache-Control":    "max-age=0",
                "Connection":       "keep-alive",
                "sec-ch-ua":        `"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"`,
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": `"Windows"`,
                "Sec-Fetch-Dest":   "document",
                "Sec-Fetch-Mode":   "navigate",
                "Sec-Fetch-Site":   "same-origin",
                "Sec-Fetch-User":   "?1",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent":       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
            }
        }));

        // set the credentials
        await client.post("/views/campus/search.asp", null, { params })
            .catch(error => {
                // TODO: provide a message e.g. "wrong login credentials"
                throw error;
            })
            .then(response => {
                const content = response.data as unknown as string;
                const worked = content.indexOf("Abmelden") >= 0;
                if (!worked) {
                    throw "wrong login credentials";
                }
            });
        
        return new Client(client);
    }

    async getDegreeCourseTypeList() {
        return getDegreeCourseTypeList(this.axios);
    }

    async getDegreeCourseList(courseType: string) {
        return getDegreeCourseList(this.axios, courseType);
    }

    async getSemesterList() {
        return getSemesterList(this.axios);
    }

    async getEventList(field: string, group: string, gguid: string) {
        return getEventList(this.axios, field, group, gguid);
    }

    async getEventDetails(field: string, group: string, gguid: string) {
        return getEventDetails(this.axios, field, group, gguid);
    }
}