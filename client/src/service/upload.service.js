import axios from "axios";
import { trimJSON } from "@/util/utils.js";
import { FormData } from "formdata-node";
//import { iconv } from "iconv-lite";


export default class UploadService {

    async upload(file, jobno) {
        let formData = new FormData();
        //let uploadFile = file;
        //file.name = iconv.encode(file.name, 'utf8');
        formData.append("jobno", jobno);
        formData.append("file", file);
        console.log(file.name);
        //const headers = {"content-type": "multipart/form-data"};
        const headers = {
            "content-type": "multipart/form-data; charset=utf8",
            //"data-type": "Buffer"
        };
        //const headers = {"content-type": "aplication/x-www-form-urlencoded"};
        let data = await axios
            .post('/api/upload/', formData, { headers })
            .then(res => {
                //console.log(formData);
                return res.data;
            });
        return data;
    }

    async removeupload(input) {
        let data = await axios
        .delete('/api/removeupload/', {
            data: input
        })
        .then(res => {
            return res.data;
        });
        return data;       
    }

}
