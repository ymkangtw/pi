import axios from "axios";
import { trimJSON } from "@/util/utils.js";

export default class CommonService {

    async getKPIByUser(param) {
        //for(var key in param) {
        //    console.log(key, param[key]);
        //}
        let data = await axios
            .get('/api/common/getkpibyuser', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getPrjinprogress(param) {
        let data = await axios
            .get('/api/common/getprjinprogress', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getPersonalJobs(param) {
        let data = await axios
            .get('/api/common/getpersonaljobs', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getEstimateamount(param) {
        let data = await axios
            .get('/api/common/getestimateamount', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getPurchaseEsti(param) {
        let data = await axios
            .get('/api/common/getpurchaseesti', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getPurchase(param) {
        let data = await axios
            .get('/api/common/getpurchase', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getOrderEsti(param) {
        let data = await axios
            .get('/api/common/getorderesti', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getOrder(param) {
        let data = await axios
            .get('/api/common/getorder', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getDeliveryEsti(param) {
        let data = await axios
            .get('/api/common/getdeliveryesti', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getDelivery(param) {
        let data = await axios
            .get('/api/common/getdelivery', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getReceiveCheckEsti(param) {
        let data = await axios
            .get('/api/common/getreceivecheckesti', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getReceiveCheck(param) {
        let data = await axios
            .get('/api/common/getreceivecheck', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getOTSumByTeam(param) {
        let data = await axios
            .get('/api/common/getotsumbyteam', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getOTSumByUser(param) {
        let data = await axios
            .get('/api/common/getotsumbyuser', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getOTListByUser(param) {
        let data = await axios
            .get('/api/common/getotlistbyuser', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async getOTList(param) {
        let data = await axios
            .get('/api/common/getotlist', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async llmMessage(input) {

        let headers = { 
            responseType: 'stream',
            //'Accept': 'application/json',
            //'Content-Type': 'multipart/form-data',            
            'Content-type': 'application/json', 
        };
        let data = await axios
            .post('http://localhost:8000/message/', 
                input
            , {
                headers: headers
            })
            .then(res => {
                //res.data.pipe
                //res.data.on('data', (chunk) => {
                //    console.log(chunk);
                //});
                //console.log(res.data);
                //return res.data.pipe(res);
                //res.data.on('data', chunk => {
                //    console.log(chunk.toString('utf-8'));
                //});
                const stream = res.body;
                // Get the reader from the stream
                const reader = stream.getReader();
                // Define a function to read each chunk
                const readChunk = () => {
                    // Read a chunk from the reader
                    reader.read()
                        .then(({
                            value,
                            done
                        }) => {
                            // Check if the stream is done
                            if (done) {
                                // Log a message
                                console.log('Stream finished');
                                // Return from the function
                                return;
                            }
                            // Convert the chunk value to a string
                            const chunkString = new TextDecoder().decode(value);
                            // Log the chunk string
                            console.log(chunkString);
                            // Read the next chunk
                            readChunk();
                        })
                        .catch(error => {
                            // Log the error
                            console.error(error);
                        });
                };
                // Start reading the first chunk
                readChunk();

                //return res.data;
            });
        /*
            let data = await axios
            .post('http://localhost:8000/message/', {
                data: input
            }, {
                headers: headers
            })
            .then(res => {
                //res.data.pipe
                return res.data;
            });
        */            
        return data;
    }

}
