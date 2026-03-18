import axios from "axios";

export default class MonthbyprojectService {
    async getAll() {
        let data = await axios
            .get('/api/monthbyproject/')
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
            .get('/api/monthbyproject/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return data;
    };

    async create(input) {
        let data = await axios
            .post('/api/monthbyproject/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
        .put('/api/monthbyproject/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async remove(input) {
        let data = await axios
        .delete('/api/monthbyproject/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async removeAll(input) {
        let data = await axios
        .delete('/api/monthbyproject/removeall', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

}
