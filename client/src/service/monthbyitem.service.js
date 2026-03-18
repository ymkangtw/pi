import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class MonthbyitemService {
    async getAll() {
        let data = await axios
            .get('/api/monthbyitem/')
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getBy(param) {
        //for(var key in param) {
        //    console.log(key, param[key]);
        //}
        let data = await axios
            .get('/api/monthbyitem/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getYearMonth(param) {
        let data = await axios
            .get('/api/monthbyitem/getyearmonth', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };


    async create(input) {
        let data = await axios
            .post('/api/monthbyitem/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
        .put('/api/monthbyitem/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async remove(input) {
        let data = await axios
        .delete('/api/monthbyitem/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async removeAll(input) {
        let data = await axios
        .delete('/api/monthbyitem/removeall', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

}
