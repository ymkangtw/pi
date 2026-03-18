import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class LeaderService {
    async getAll() {
        let data = await axios
            .get('/api/leader/')
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
            .get('/api/leader/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async create(input) {
        let data = await axios
            .post('/api/leader/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
            .put('/api/leader/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;       
    }

    async remove(input) {
        let data = await axios
            .delete('/api/leader/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;       
    }

    async removeAll(input) {
        let data = await axios
            .delete('/api/leader/removeall', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;       
    }

}
