import axios from "axios";

export default class ProductService {

    getProductsSmall() {
        return fetch('products-small.json').then(res => res.json()).then(d => d.data);
    }

    async getProducts() {
        //data = fetch('products.json').then(res => res.json()).then(d => d.data);
        //console.log('test!');
        //return data;
        //return fetch('products.json').then(res => res.json()).then(d => d.data);
        
        let  data1 = await axios.get('products.json')
                    .then(res => {
                        let data = res.data.data;
                        //console.log(data);
                        return data;
                    });
        return data1;
    }

    getProductsWithOrdersSmall() {
        return fetch('products-orders-small.json').then(res => res.json()).then(d => d.data);
    }
}
