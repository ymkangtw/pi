import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class WeeklyworkbyprojectService {
    async getAll() {
        let data = await axios
            .get('/api/weeklyworkbyproject/')
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getBy(param) {
        let data = await axios
            .get('/api/weeklyworkbyproject/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async create(input) {
        let data = await axios
            .post('/api/weeklyworkbyproject/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
        .put('/api/weeklyworkbyproject/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async remove(input) {
        let data = await axios
        .delete('/api/weeklyworkbyproject/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async removeAll(input) {
        let data = await axios
        .delete('/api/weeklyworkbyproject/removeall', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }


}
