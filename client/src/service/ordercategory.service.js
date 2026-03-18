import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class OrdercategoryService {
    async getAll() {
        let data = await axios
            .get('/api/ordercategory/')
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getBy(param) {
        let data = await axios
            .get('/api/ordercategory/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async create(input) {
        let data = await axios
            .post('/api/ordercategory/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
        .put('/api/ordercategory/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async remove(input) {
        let data = await axios
        .delete('/api/ordercategory/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

}
