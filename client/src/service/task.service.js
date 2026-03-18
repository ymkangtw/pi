import axios from "axios";

export default class TaskService {
    async getAll() {
        let data = await axios
            .get('/api/task/')
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
            .get('/api/task/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return data;
    };

    async create(input) {
        let data = await axios
            .post('/api/task/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
            .put('/api/task/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;       
    }

    async remove(input) {
        let data = await axios
            .delete('/api/task/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;       
    }

}
