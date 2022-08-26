import axios from "axios";
import Result from "../state/result";
import moment from "moment";
import Article from "../state/article";
import Source from "../state/source";

const http = axios.create({
    baseURL: "https://e7e2-94-29-124-51.eu.ngrok.io",
    headers: {
        "Content-type": "application/json"
    }
});

function formatDate(date: Date) {
    return moment(date).format('YYYY-MM-DD');
}

class DataService {
    getByDates(start: Date, end: Date) {
        return http.get<Array<Result>>(`/date?start=${formatDate(start)}&end=${formatDate(end)}`);
    }

    getByDatesAndSource(source: number, start: Date, end: Date) {
        return http.get<Array<Result>>(`/date/${source}?start=${formatDate(start)}&end=${formatDate(end)}`)
    }

    getByEntity(entity: string) {
        return http.get<Array<Article>>(`/entity/${entity}`);
    }

    getSources() {
        return http.get<Array<Source>>(`/sources`);
    }
}

export default new DataService();