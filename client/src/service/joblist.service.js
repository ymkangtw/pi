import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class JoblistService {
    async getAll() {
        let data = await axios
            .get('/api/joblist/')
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
            .get('/api/joblist/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getByTeam(param) {
        let data = await axios
            .get('/api/joblist/getbyteam', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getByLeader(param) {
        let data = await axios
            .get('/api/joblist/getbyleader', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getByMember(param) {
        let data = await axios
            .get('/api/joblist/getbymember', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };


    async getByAllTeamMember(param) {
        let data = await axios
            .get('/api/joblist/getbyallteammember', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getByIdreport(param) {
        let data = await axios
            .get('/api/joblist/getByIdreport', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getByFnreport(param) {
        let data = await axios
            .get('/api/joblist/getByFnreport', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

}
