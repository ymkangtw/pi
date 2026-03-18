import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class ServicevalueService {
    async getAll() {
        let data = await axios
            .get('/api/servicevalue/')
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
            .get('/api/servicevalue/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async create(input) {
        let data = await axios
            .post('/api/servicevalue/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
            .put('/api/servicevalue/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;       
    }

    async remove(input) {
        let data = await axios
            .delete('/api/servicevalue/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;       
    }

}
