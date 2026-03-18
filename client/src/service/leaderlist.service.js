import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class LeaderlistService {

    async getBy(param) {
        //for(var key in param) {
        //    console.log(key, param[key]);
        //}
        let data = await axios
            .get('/api/leaderlist/getby', {
                params: param
            })
            .then(res => {
                //console.log(res.data);
                return res.data;
            });
        return trimJSON(data);
    };

}
