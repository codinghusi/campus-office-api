import Client from "./client";
import auth from './auth-config'

Client.login("http://www.campusoffice.fh-aachen.de", auth).then(async client => {
    // const courseTypes = await client.getDegreeCourseTypeList();
    // const courses = await client.getDegreeCourseList("Bachelorstudieng%E4nge");
    // const semesters = await client.getSemesterList();
    // console.log(courses);
    // console.log(semesters);
    // console.log(courses);
    const eventList = await client.getEventList("Bachelorstudieng%E4nge", "Informatik+%28B%2ESc%2E%29", "0xDD05C8BF69124AABA13EEA1DD05DC09F");
    console.log(JSON.stringify(eventList, null, 2));
})
