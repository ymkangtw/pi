import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class MonthreportbyprjService {
    async getAll() {
        let data = await axios
            .get('/api/monthreportbyprj/')
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
            .get('/api/monthreportbyprj/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async create(input) {
        let data = await axios
            .post('/api/monthreportbyprj/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
        .put('/api/monthreportbyprj/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async remove(input) {
        let data = await axios
        .delete('/api/monthreportbyprj/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async getMonthworkByGroup(param) {
        let data = await axios
            .get('/api/monthreportbyprj/getmonthworkbygroup', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };    

    async getMonthworkByPrj(param) {
        let data = await axios
            .get('/api/monthreportbyprj/getmonthworkbyprj', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };    

}
