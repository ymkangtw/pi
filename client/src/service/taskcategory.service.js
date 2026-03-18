import axios from "axios";

export default class TaskcategoryService {
    async getAll() {
        let data = await axios
            .get('/api/taskcategory/')
            .then(res => {
                return res.data;
            });
        return data;
    };

    async getBy(param) {
        //for(var key in param) {
        //    console.log(key, param[key]);
        //}
        let data = await axios
            .get('/api/taskcategory/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return data;
    };

    async create(input) {
        let data = await axios
            .post('/api/taskcategory/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
        .put('/api/taskcategory/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async remove(input) {
        let data = await axios
        .delete('/api/taskcategory/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

}
