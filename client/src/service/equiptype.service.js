import axios from "axios";

export default class EquiptypeService {
    async getAll() {
        let data = await axios
            .get('/api/equiptype/')
            .then(res => {
                return res.data;
            });
        return data;
    };
    async getBy(param) {
        //console.log('in: ' + param);
        for(var key in param) {
            console.log(key, param[key]);
        }
        let data = await axios
            .get('/api/equiptype/getby', {
                //params: { typeid: param }
                params: param
                //data: param
            })
            .then(res => {
                return res.data;
            });
        return data;
    };

    async create(input) {
        let data = await axios
            .post('/api/equiptype/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
        .put('/api/equiptype/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

    async remove(input) {
        let data = await axios
        .delete('/api/equiptype/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

}
