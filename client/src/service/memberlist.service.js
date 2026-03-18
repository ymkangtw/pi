import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class MemberlistService {

    async getBy(param) {
        //for(var key in param) {
        //    console.log(key, param[key]);
        //}
        let data = await axios
            .get('/api/memberlist/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

}
