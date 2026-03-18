import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class WeeklyreportbyprjService {
    async getAll() {
        let data = await axios
            .get('/api/weeklyreportbyprj/')
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
            .get('/api/weeklyreportbyprj/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async create(input) {
        let data = await axios
            .post('/api/weeklyreportbyprj/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
        .put('/api/weeklyreportbyprj/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async remove(input) {
        let data = await axios
        .delete('/api/weeklyreportbyprj/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async getWeekworkByGroup(param) {
        let data = await axios
            .get('/api/weeklyreportbyprj/getweekworkbygroup', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };    

    async getWeekworkByPrj(param) {
        let data = await axios
            .get('/api/weeklyreportbyprj/getweekworkbyprj', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getWeekreportByGroup(param) {
        let data = await axios
            .get('/api/weeklyreportbyprj/getweekreportbygroup', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };
}
