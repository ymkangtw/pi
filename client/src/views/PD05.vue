<script setup>
import { ref, onMounted } from 'vue';

import BasicSvc from '@/service/basic.service.js';
import MemberSvc from '@/service/member.service.js';
import LeaderSvc from '@/service/leader.service.js';
import EstiItemSvc from '@/service/estibyitem.service.js';
import MonthbyitemSvc from '@/service/monthbyitem.service.js';
import MonthlyworkSvc from '@/service/monthbyproject.service.js';

import TaskCategorySvc from '@/service/taskcategory.service.js';
import EstiProjectSvc from '@/service/estibyproject.service.js';
import TaskSvc from '@/service/task.service.js';
import OrdersSvc from '@/service/orders.service.js';
import OrderitemsSvc from '@/service/orderitems.service.js';
import UtilSvc from '@/service/util.service.js';
import CommonSvc from '@/service/common.service.js';
import ContentSvc from '@/service/contents.service.js';
import MonthprgbyprojecttotalSvc from '@/service/monthprgbyprojecttotal.service.js';

import * as dayjs from 'dayjs';
import { jsPDF } from "jspdf";
//import { saveObj, loadObj, rNum, fv, pv, StrToInt } from '@/util/utils.js';
//import { fv, pv } from '@/util/utils.js';
import * as util from '@/util/utils.js';


import _ from 'lodash';
import { ccode } from '@/assets/colorcode.js';
import { ElMessage } from 'element-plus';
//import '@/assets/kaiu-normal.js';
//import '@/assets/NotoSansTC-normal.js';


const fv = util.fv;
const pv = util.pv;

//--------------------------------
// Local Variable
//--------------------------------
var user = util.loadObj('user');

//const doc = new jsPDF();
/*
const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
});
*/

const date1 = dayjs(new Date()).format('YYYY-MM-DD');
const date2 = dayjs(new Date()).add(1, 'month').format('YYYY-MM-DD');

const pdate = dayjs(new Date()).add(1, 'month').format('YYYY-MM-DD');   // 預定請購日期
const odate = dayjs(new Date()).add(2, 'month').format('YYYY-MM-DD');   // 預定訂購日期
const ddate = dayjs(new Date()).add(8, 'month').format('YYYY-MM-DD');   // 預定交貨日期
const rdate = dayjs(new Date()).add(9, 'month').format('YYYY-MM-DD');   // 預定驗收日期

//Basic
const basicSvc = new BasicSvc();
const b = ref();
//Utility
const utilSvc = new UtilSvc();

// Project Member
const sSubjobno = ref();    // selected subjobno
const sCategory = ref();    // selected category, Tabs
const m = ref();            // member
const memberSvc = new MemberSvc();
const leaderSvc = new LeaderSvc();

// Year Month
const monthbyitemSvc = new MonthbyitemSvc();
const mi = ref();           // all monthbyitem
const smi = ref();          // selected monthbyitem
const YM = ref();           // all yearmonth
const YMOptions = ref();    // yearmonth value of Select Component
const sYM = ref();          // selected yearmonth
const currYM = ref();       // current yearmonth

const monthlyworkSvc = new MonthlyworkSvc();

const commonSvc = new CommonSvc();
const contentSvc = new ContentSvc();
const monthprgbyprojecttotalSvc = new MonthprgbyprojecttotalSvc();

// Task Category
const taskcategorySvc = new TaskCategorySvc();
const jobtype = ref();
const taskSvc = new TaskSvc();
const estiitemSvc = new EstiItemSvc();
const tc = ref();           // All Task Categories
const ptc = ref();          // Personal Task Categories, include task counts
const t = ref();            // All Tasks
const st = ref();           // Personal Selected Tasks
const es = ref();           // Esti Item
//const ces = ref();        // Esti Item classify by Category
const cmi = ref();          // Monthly Item classify by Category
const summary = ref();      // Summary data
var summaryTeam = [];       // All summary data

const estiprgall = ref();
const actprgall = ref();
const estiprgprj = ref();
const actprgprj = ref();

// Esti by Project
const estiprojectSvc = new EstiProjectSvc();
const tcr = ref();

// monthitem
const updateMonthItemDlg = ref();
const updatemi = ref();

// print monthwork
const showDialogMonthwork = ref();
const checkContent = ref(true);

// Orders & Orderitems
const ordersSvc = new OrdersSvc();
const orderitemsSvc = new OrderitemsSvc();
const updateOrdersDlg = ref();
const addOrdersDlg = ref();
const addOrderitemsDlg = ref();
const orders = ref();               // all personal orders
const orderitems = ref();           // all personal orderitems
const sorderitems = ref();          // all personal orderitems by orders, for el-table :data
const selectedOrderitems = ref();   // select personal orderitems by orders, for delete
const selectedOrders = ref();       // select personal orders, for delete
const sorder = ref();               // selected order
const ordersTableRef = ref();       // ordersTableRef
const currentOrder = ref();
const pData = ref({
    estimateamount: 0,
    purchaseesti: 0,
    purchase: 0,
    orderesti: 0,
    order: 0,
    deliveryesti: 0,
    delivery: 0,
    receivecheckesti: 0,
    receivecheck: 0
});                                 // purchase data

const memberInfo = ref();

const ctype = ref([
    { label: '一般請購', value: 1 },
    { label: '小額請購', value: 2 },
    { label: '緊急請購', value: 3 },
    { label: '長期合約', value: 4 },
    { label: 'Y61外包', value: 5 },
    { label: 'W61外包', value: 6 }
]);

const currencytype = ref([
    { label: 'NT', value: "NT" },
    { label: 'US', value: "US" },
    { label: 'YEN', value: "YEN" },   
    { label: 'EUR', value: "EUR" },
    { label: 'DM', value: "DM" },
    { label: 'FR', value: "FR" },
    { label: 'LB', value: "LB" }    
]);

const neworder = ref({
    jobno: '',
    subjobno: 0,
    item: 0,
    orderno: '',
    purchase_esti_issue_date: '',
    purchase_issue_date: '',
    c1_issue_date: '',
    c1_query_date: '',
    c1_order_esti_date: '',
    c1_order_date: '',
    delivery_esti_date: '',
    delivery_date: '',
    receivecheck_esti_date: '',
    receivecheck_date: '',
    c1_member: '',
    y6tserialno: '',
    content: '',
    category: 1,
    jobid: '',
    note: '',
    isturnkey: false,
    budgetno: '',
    estimateamount: 0,
    amount: 0,
    formalorderno: '',
    currency: 'NT',
    jobcommandno: '',
    supplier_id: '',
    supplier_name: '',
    autoupdate: '',
    latedelivery2y61: ''
});

const neworderitem = ref({
    jobno: '',
    subjobno: 0,
    serialno: 0,
    orderno: '',
    item: 0,
    name: '',
    materialcode: '',
    quality: '',
    main_specification: '',
    specification_code: '',
    unit_price: 0,
    unit: '',
    quantity: 0,
    supplierid: '',
    esti_unit_price: 0,
    specification_path: '',
    receivecheck_esti_date: '',
    receivecheck_date: '',
    delivery_esti_date: '',
    delivery_date: '',
    currency: '',
    exchangerate: 1,
    category: '',
    estiexchangerate: 1,
    receivecheckratio: 100,
    checkquantity: 0,
    name_q: '',
    wage: 0
});

const newmonthbyproject = ref({
    jobno: '',
    subjobno: '',
    yearmonth: '',
    id_lmn_mh: 0, id_lmn_dwg: 0, id_accu_mh: 0, id_accu_dwg: 0, id_esti_prg: 0, id_prg: 0, 
    bd_lmn_mh: 0, bd_lmn_dwg: 0, bd_accu_mh: 0, bd_accu_dwg: 0, bd_esti_prg: 0, bd_prg: 0,
    dd_lmn_mh: 0, dd_lmn_dwg: 0, dd_accu_mh: 0, dd_accu_dwg: 0, dd_esti_prg: 0, dd_prg: 0, 
    cnt_lmn_mh: 0, cnt_lmn_dwg: 0, cnt_accu_mh: 0, cnt_accu_dwg: 0, cnt_esti_prg: 0, cnt_prg: 0, 
    buy_lmn_mh: 0, buy_lmn_dwg: 0, buy_accu_mh: 0, buy_accu_dwg: 0, buy_esti_prg: 0, buy_prg: 0, 
    con_lmn_mh: 0, con_accu_mh: 0, con_esti_prg: 0, con_prg: 0,
    com_lmn_mh: 0, com_accu_mh: 0, com_esti_prg: 0, com_prg: 0,  
    dcs_lmn_mh: 0, dcs_lmn_dwg: 0, dcs_accu_mh: 0, dcs_accu_dwg: 0, dcs_esti_prg: 0, dcs_prg: 0, 
    plc_lmn_mh: 0, plc_lmn_dwg: 0, plc_accu_mh: 0, plc_accu_dwg: 0, plc_esti_prg: 0, plc_prg: 0, 
    rpt_lmn_mh: 0, rpt_lmn_dwg: 0, rpt_accu_mh: 0, rpt_accu_dwg: 0, rpt_esti_prg: 0, rpt_prg: 0, 
    prg_esti: 0, prg: 0, prg_design_esti: 0, prg_design: 0, ifupdated: false, monthwork: '' 
});

const newmonthprgbyprojecttotal = ref({
    jobno: '', 
    yearmonth: '', 
    prg_esti: 0, 
    prg: 0, 
    prg_design_esti: 0, 
    prg_design: 0,
    y6ncntestiprg: 0, 
    y6ncntprg: 0, 
    y6nconestiprg: 0, 
    y6nconprg: 0,
    y69estiprg: 0, 
    y69prg: 0, 
    worksummaried: '', 
    worksummariednext: '',
    tracesummaried: '', 
    isoprogressdescription: '', 
    y6nwork: '', 
    y6nrequest: ''
});

const joblist = ref();
const ptask = ref();     // Peraonal Purchase Task: Pxx, jobid, content
const mptotal = ref();

//--------------------------------
// Local Function
//--------------------------------
onMounted(async () => {
    await getBasic();
    await getMember();
    await getDefMember();
    await getTaskCategory();    // all Task Category
    await getTask();            // akk Task
    await OnMemberClick(user.sJobno, sSubjobno.value);

});

const getBasic = async () => {
    b.value = await basicSvc
        .getBy({ jobno: user.sJobno })
        .then((data) => {
            return data[0];
        });
    //console.log(b.value);
};

const getMember = async () => {
    /*
    await memberSvc
        .getBy({ jobno: user.sJobno })
        .then((data) => {
            m.value = data;
        });
    */
    m.value = await memberSvc.getBy({ jobno: user.sJobno });
    //m.value.push({subjobno: 'all', employeeno: 'all', name: '全案'});
};

const getDefMember = () => {
    if (user.sSubjobno > 0) {
        sSubjobno.value = user.sSubjobno;
    } else {
        const sm = m.value.find(obj => { return obj.employeeno == user.employeeno });
        if (sm == undefined) {
            let fm = m.value.reduce((p, c) => p.subjobno < c.subjobno ? p : c);
            sSubjobno.value = fm.subjobno;
        } else {
            sSubjobno.value = sm.subjobno;
        }
    }
};

const getTaskCategory = async () => {
    tc.value = await taskcategorySvc.getAll();
    //console.log('tc:', tc.value);
};

const getTask = async () => {
    t.value = await taskSvc.getAll();
};

const OnMemberClick = async (jobno, subjobno) => {
    //console.log(jobno, subjobno);
    //YM.value = await monthbyitemSvc.getYearMonth({ jobno: user.sJobno, subjobno: sSubjobno.value });
    sSubjobno.value = subjobno;
    user.sSubjobno = subjobno;
    util.saveObj('user', user);

    if (typeof subjobno == 'number') {
        YM.value = await monthbyitemSvc.getYearMonth({ jobno: jobno, subjobno: subjobno });
    } else {
        YM.value = await monthbyitemSvc.getYearMonth({ jobno: user.sJobno });
    }
    //console.log(YM.value);
    YMOptions.value = [];
    for (let it of YM.value) {
        YMOptions.value.push({ label: it.yearmonth, value: it.yearmonth });
    }
    //console.log(YMOptions.value.length);
    currYM.value = dayjs().subtract(8, 'day').format('YYYYMM');

    if (YMOptions.value.length < 1 || YMOptions.value[0].value != currYM.value) {
        YMOptions.value.unshift({ label: currYM.value, value: currYM.value });
    }
    //if (YMOptions.value[0].value != currYM.value) {
    //    YMOptions.value.unshift({ label: currYM.value, value: currYM.value });
    //}

    sYM.value = YMOptions.value[0].value;
    //console.log(sYM.value);
    sCategory.value = 'SUMMARY';
    /*
    if (typeof subjobno === 'number') {
        await getMonthItem(jobno, subjobno);
    } else {
        await _getMonthItem(jobno);
    }
    */
    getMptotal(jobno, sYM.value);
    getMonthItem(jobno, subjobno);
    getPurchaseData(jobno, subjobno);
    
    // find first taskcategory (count > 0) 
    //let obj = _.find(ptc.value, (o) => { return o.count > 0; });
    //sCategory.value = obj.jobtype;
    
    //getSummary();

    //console.log(sSubjobno.value);
    //sCategory.value = 'SUMMARY';
    
};
/*
const OnAllClick = async () => {
    //console.log('all');
    YM.value = await monthbyitemSvc.getYearMonth({ jobno: user.sJobno });
    YMOptions.value = [];
    for (let it of YM.value) {
        YMOptions.value.push({ label: it.yearmonth, value: it.yearmonth });
    }
    //console.log(YMOptions.value.length);
    currYM.value = dayjs().subtract(8, 'day').format('YYYYMM');

    if (YMOptions.value.length < 1 || YMOptions.value[0].value != currYM.value) {
        YMOptions.value.unshift({ label: currYM.value, value: currYM.value });
    }

    sYM.value = YMOptions.value[0].value;

    //console.log(m.value);
    await _getMonthItem(user.sJobno);
    sCategory.value = 'SUMMARY';
    //getSummary();
    //console.log(sSubjobno.value);

};
*/
const OnCategoryClick = async (category) => {
    //refc.value.selectCategory ? jobtype.value = refc.value.selectCategory : jobtype.value = 'I';
    //console.log(category);
    //console.log(summary.value);
    //summary.value = _.map(ptc.value, o => { return { ...o } });
    //getSummary();
};

const OnMonthItemDlgClick = (item) => {
    updatemi.value = { ...item };
};

const OnYMChange = async () => {
    //console.log(sYM.value);
    await getMonthItem(user.sJobno, sSubjobno.value);
    await getMptotal(user.sJobno, sYM.value);
    //getSummary();
};

const getMptotal = async (jobno, yearmonth) => {
    //console.log(jobno, yearmonth);
    mptotal.value = await monthprgbyprojecttotalSvc
        .getBy({jobno: jobno, yearmonth: yearmonth})
        .then((data) => {
            if (util.isEmpty(data)) {
                //newmonthprgbyprojecttotal.jobno = jobno;
                //newmonthprgbyprojecttotal.yearmonth = yearmonth;
                //newmonthprgbyprojecttotal = '';
                let curMptotal = Object.assign({}, newmonthprgbyprojecttotal.value);
                curMptotal.jobno = jobno;
                //curMptotal.yearmonth = yearmonth;
                return curMptotal;
            } else {
                return data[0];
            }
            
        });
    //console.log(mptotal.value);
};

const saveMptotal = async (jobno) => {
    //console.log('save mptotal: ', mptotal.value, mptotal.value.isoprogressdescription.length);
    let error = 0;
    mptotal.value.isoprogressdescription = _.replace(mptotal.value.isoprogressdescription, /\n/g, '\r\n')
    mptotal.value.jobno = jobno;

    if (mptotal.value.yearmonth == '' || mptotal.value.yearmonth == null) {
        mptotal.value.yearmonth = sYM.value;
        await monthprgbyprojecttotalSvc.create(mptotal.value).then((data) => { data == 'created' ? error = error : error = error + 1 });
    } else {
        await monthprgbyprojecttotalSvc.update(mptotal.value).then((data) => { data == 'updated' ? error = error : error = error + 1 });
    }
    error == 0 ? ElMessage({ message: '儲存成功', type: 'success' }) : ElMessage({ message: '儲存失敗', type: 'error' });    
};


const getDTColor = (designtype) => {
    let color = '';
    switch (designtype) {
        case '自行設計':
            color = ccode.gray1;
            break;
        case '委外設計':
            color = ccode.green1;
            break;
        case '委外統包':
            color = ccode.blue1;
            break;
        default:
            color = ccode.red1;
            break;
    }
    return color;
};

const getSummary = async () => {
    //let psummary;
    //if (sCategory.value == 'SUMMARY') {
        summary.value = _.filter(ptc.value, (o) => {
            return o.count > 0;
        });
        //console.log('summary: ', summary.value);
        //console.log('tcr: ', tcr.value[0]);
        //let wt = tcr.value[0];
        //let mw = _.map(m.value, o => { return { ...o } });
        let mw = [...m.value];
        //console.log(mw);
        /*
        let mw;
        if (m.value.length > 1) {
            mw = [...m.value];
        } else {
            mw = m.value[0];
        }
        */

        //console.log('mw:', mw.weight);
        let wt;
        if (tcr.value.length > 1) {
            wt = tcr.value;
        } else {
            wt = tcr.value[0];
        }
        //console.log(wt);
        //console.log('m: ', m.value);
        //console.log('tcr.length:', tcr.value.length);

        _.map(summary.value, (o) => {
            o.esti_sdate = util.esti_sdate_byjt(o.jobtype, es.value);
            o.esti_fdate = util.esti_fdate_byjt(o.jobtype, es.value);
            o.act_sdate = util.act_sdate_byjt(o.jobtype, es.value);
            o.act_fdate = util.act_fdate_byjt(o.jobtype, es.value);
            o.estidwg = util.estidwg_byjt(o.jobtype, es.value);
            o.estimh = util.estimh_byjt(o.jobtype, es.value);
            o.curym_accumh = util.curym_accumh_byjt(sYM.value, o.jobtype, mi.value);
            o.curym_accudwg = util.curym_accudwg_byjt(sYM.value, o.jobtype, mi.value);
            o.accudwg = util.accudwg_byjt(sYM.value, o.jobtype, mi.value);
            o.accumh = util.accumh_byjt(sYM.value, o.jobtype, mi.value);
            o.estiprg = util.estiprg_byjt(o.jobtype, es.value, smi.value, orders.value, 1);
            o.actprg = util.actprg_byjt(o.jobtype, es.value, smi.value, orders.value, 1);

            //let rdata = _.filter(raw, (item) => {
            //    return item.count > 0;
            //});
            
            //console.log('rdata: ', rdata);
            //_.map(rdata, (item) => {
            //console.log('o: ', o);
            //console.log(tcr.value.length);
            //console.log(tcr.value);
            if (tcr.value.length > 1) {
                //console.log(m.value[0].weight);
                //let s = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.id_wt * mwi.weight)) / 100).toFixed(1);
                //console.log(s);
                //_.zipWith(wt, mw, (wti, mwi) => {console.log(wti, mwi.weight)});
                
                //console.log('o: ', o);
                switch (o.jobtype) {
                case 'I': 
                    o.ratio = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.id_wt * mwi.weight)) / 100).toFixed(1);
                    //o.ratio = (wt.reduce((acc, wti, index) => acc + wti.id_wt * mw[index].weight, 0) / 100).toFixed(1);
                    //o.ratio = wt.id_wt;
                    o.design_type = wt[0].id_type;
                    break;
                case 'B': 
                    o.ratio = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.bd_wt * mwi.weight)) / 100).toFixed(1);
                    //o.ratio = (wt.reduce((acc, wti, index) => acc + wti.bd_wt * mw[index].weight, 0) / 100).toFixed(1);
                    //o.ratio = wt.bd_wt;
                    o.design_type = wt.bd_type;
                    break;
                case 'D': 
                    o.ratio = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.dd_wt * mwi.weight)) / 100).toFixed(1);
                    //o.ratio = (wt.reduce((acc, wti, index) => acc + wti.dd_wt * mw[index].weight, 0) / 100).toFixed(1);
                    //o.ratio = wt.dd_wt; 
                    o.design_type = wt.dd_type;
                    break;
                case 'E':
                    o.ratio = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.dcs_wt * mwi.weight)) / 100).toFixed(1);
                    //o.ratio = (wt.reduce((acc, wti, index) => acc + wti.dcs_wt * mw[index].weight, 0) / 100).toFixed(1);
                    //o.ratio = wt.dcs_wt; 
                    o.design_type = wt.dcs_type;
                    break;
                case 'F': 
                    o.ratio = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.plc_wt * mwi.weight)) / 100).toFixed(1);
                    //o.ratio = (wt.reduce((acc, wti, index) => acc + wti.plc_wt * mw[index].weight, 0) / 100).toFixed(1);
                    //o.ratio = wt.plc_wt;
                    o.design_type = wt.plc_type;
                    break;
                case 'C': 
                    o.ratio = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.cnt_wt * mwi.weight)) / 100).toFixed(1);
                    //o.ratio = (wt.reduce((acc, wti, index) => acc + wti.cnt_wt * mw[index].weight, 0) / 100).toFixed(1);
                    //o.ratio = wt.cnt_wt; 
                    o.design_type = wt.cnt_type;
                    break;
                case 'P': 
                    o.ratio = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.buy_wt * mwi.weight)) / 100).toFixed(1);
                    //o.ratio = (wt.reduce((acc, wti, index) => acc + wti.buy_wt * mw[index].weight, 0) / 100).toFixed(1);
                    //o.ratio = wt.buy_wt;
                    o.design_type = wt.buy_type;
                    break;
                case 'K':
                    o.ratio = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.con_wt * mwi.weight)) / 100).toFixed(1);
                    //o.ratio = (wt.reduce((acc, wti, index) => acc + wti.con_wt * mw[index].weight, 0) / 100).toFixed(1);
                    //o.ratio = wt.con_wt; 
                    o.design_type = wt.con_type;
                    break;
                case 'T': 
                    o.ratio = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.com_wt * mwi.weight)) / 100).toFixed(1);
                    //o.ratio = (wt.reduce((acc, wti, index) => acc + wti.com_wt * mw[index].weight, 0) / 100).toFixed(1);
                    //o.ratio = wt.com_wt; 
                    o.design_type = wt.com_type;
                    break;
                case 'R': 
                    o.ratio = (_.sum(_.zipWith(wt, mw, (wti, mwi) => wti.rpt_wt * mwi.weight)) / 100).toFixed(1);
                    //o.ratio = (wt.reduce((acc, wti, index) => acc + wti.rpt_wt * mw[index].weight, 0) / 100).toFixed(1);
                    //o.ratio = wt.rpt_wt; 
                    o.design_type = wt.rpt_type;
                    break;
                }
                    
            } else {
                switch (o.jobtype) {
                case 'I': 
                    o.ratio = wt.id_wt;
                    o.design_type = wt.id_type;
                    break;
                case 'B': 
                    o.ratio = wt.bd_wt;
                    o.design_type = wt.bd_type;
                    break;
                case 'D': 
                    o.ratio = wt.dd_wt; 
                    o.design_type = wt.dd_type;
                    break;
                case 'E': 
                    o.ratio = wt.dcs_wt; 
                    o.design_type = wt.dcs_type;
                    break;
                case 'F': 
                    o.ratio = wt.plc_wt;
                    o.design_type = wt.plc_type;
                    break;
                case 'C': 
                    o.ratio = wt.cnt_wt; 
                    o.design_type = wt.cnt_type;
                    break;
                case 'P': 
                    o.ratio = wt.buy_wt;
                    o.design_type = wt.buy_type;
                    break;
                case 'K':
                    o.ratio = wt.con_wt; 
                    o.design_type = wt.con_type;
                    break;
                case 'T': 
                    o.ratio = wt.com_wt; 
                    o.design_type = wt.com_type;
                    break;
                case 'R': 
                    o.ratio = wt.rpt_wt; 
                    o.design_type = wt.rpt_type;
                    break;
                }
            }

            //});            

        });
    //}
};

const showSummary = (param) => {
    let { columns, data } = param
    let sums = [];
    //console.log(data);
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '合計';
            return
        }
        if (index === 1) {  // 預定開始日期
            let dates = [];
            _.map(data, (item) => { dates.push(item.esti_sdate); });
            dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
            sums[index] = util.getFirstDate(dates);
        }
        if (index === 2) {  // 預定結束日期
            let dates = [];
            _.map(data, (item) => { dates.push(item.esti_fdate); });
            dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
            sums[index] = util.getLastDate(dates);
        }
        if (index === 3) {  // 實際開始日期
            let dates = [];
            _.map(data, (item) => { dates.push(item.act_sdate); });
            dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
            sums[index] = util.getFirstDate(dates);
        }
        if (index === 4) {  // 實際結束日期
            let dates = [];
            _.map(data, (item) => { dates.push(item.act_fdate); });
            dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
            sums[index] = util.getLastDate(dates);
        }
        if (index === 5) {  // 當月圖數
            let sumdwg = _.reduce(data, (sum, item) => {
                return sum + item.curym_accudwg;
            }, 0);
            sums[index] = sumdwg;
        }
        if (index === 6) {  // 預定圖數
            let sumdwg = _.reduce(data, (sum, item) => {
                return sum + item.estidwg;
            }, 0);
            sums[index] = sumdwg;
        }
        if (index === 7) {  // 累計圖數
            let sumdwg = _.reduce(data, (sum, item) => {
                return sum + item.accudwg;
            }, 0);
            sums[index] = sumdwg;
        }
        if (index === 8) {  // 當月工時
            let summh = _.reduce(data, (sum, item) => {
                return sum + item.curym_accumh;
            }, 0);
            sums[index] = summh;
        }
        if (index === 9) {  // 預定工時
            let summh = _.reduce(data, (sum, item) => {
                return sum + item.estimh;
            }, 0);
            sums[index] = summh;
        }
        if (index === 10) {  // 累計工時
            let summh = _.reduce(data, (sum, item) => {
                return sum + item.accumh;
            }, 0);
            sums[index] = summh;
        }
        if (index === 11) {  // 比重
            let sumw = _.reduce(data, (sum, item) => {
                return sum + parseFloat(item.ratio);
            }, 0.0);
            sums[index] = parseFloat(sumw).toFixed(0);
        }
        if (index === 12) {  // 預定總進度
            if (sSubjobno.value != 'all') {
                estiprgall.value = util.estiprg_all(ptc.value, tcr.value, es.value, smi.value, orders.value, 1);
                sums[index] = estiprgall.value;
            } else {
                estiprgprj.value = util.estiprg_prj(summary.value);
                sums[index] = estiprgprj.value;
            }
        }
        if (index === 13) {  // 實際總進度
            if (sSubjobno.value != 'all') {
                actprgall.value = util.actprg_all(ptc.value, tcr.value, es.value, smi.value, orders.value, 1);
                sums[index] = actprgall.value;
            } else {
                actprgprj.value = util.actprg_prj(summary.value);
                sums[index] = actprgprj.value;
            }
        }
    });

    return sums;
};
/*
const _getSummary = (sYM, subjobno, weight, ptc, tcr, es, mi, smi, orders) => {
    //console.log('call _summary: ', ptc);
    let _summary;
    if (sCategory.value == 'SUMMARY') {
        _summary = _.filter(ptc, (o) => {
            return o.count > 0;
        });
        //_summary = ptc.filter((o) => {
        //    return o.count > 0;
        //});

        //console.log('summary: ', _summary);
        //console.log('tcr: ', tcr.value[0]);
        let wt = tcr[0];
        //console.log('tcr:', tcr);
        //let mw = _.map(m.value, o => { return { ...o } });

        //console.log('m: ', m.value);

        _.map(_summary, (o) => {
            o.subjobno = subjobno,
            o.weight = weight,
            o.esti_sdate = esti_sdate_byjt(o.jobtype, es);
            o.esti_fdate = esti_fdate_byjt(o.jobtype, es);
            o.act_sdate = act_sdate_byjt(o.jobtype, es);
            o.act_fdate = act_fdate_byjt(o.jobtype, es);
            o.estidwg = estidwg_byjt(o.jobtype, es);
            o.estimh = estimh_byjt(o.jobtype, es);
            o.curym_accumh = curym_accumh_byjt(sYM, o.jobtype, mi);
            o.curym_accudwg = curym_accudwg_byjt(sYM, o.jobtype, mi);
            o.accudwg = accudwg_byjt(sYM, o.jobtype, mi);
            o.accumh = accumh_byjt(sYM, o.jobtype, mi);
            o.estiprg = estiprg_byjt(o.jobtype, es, smi, orders, 1);
            o.actprg = actprg_byjt(o.jobtype, es, smi, orders, 1);

            switch (o.jobtype) {
            case 'I': 
                o.ratio = wt.id_wt;
                o.design_type = wt.id_type;
                break;
            case 'B': 
                o.ratio = wt.bd_wt;
                o.design_type = wt.bd_type;
                break;
            case 'D': 
                o.ratio = wt.dd_wt; 
                o.design_type = wt.dd_type;
                break;
            case 'E': 
                o.ratio = wt.dcs_wt; 
                o.design_type = wt.dcs_type;
                break;
            case 'F': 
                o.ratio = wt.plc_wt;
                o.design_type = wt.plc_type;
                break;
            case 'C': 
                o.ratio = wt.cnt_wt; 
                o.design_type = wt.cnt_type;
                break;
            case 'P': 
                o.ratio = wt.buy_wt;
                o.design_type = wt.buy_type;
                break;
            case 'K':
                o.ratio = wt.con_wt; 
                o.design_type = wt.con_type;
                break;
            case 'T': 
                o.ratio = wt.com_wt; 
                o.design_type = wt.com_type;
                break;
            case 'R': 
                o.ratio = wt.rpt_wt; 
                o.design_type = wt.rpt_type;
                break;
            }
            //console.log('o: ', o);  
        });
        //console.log('_summary: ', _summary);
    }
    return _summary;
};
*/
/*
const _getMonthItem = async (jobno) => {
    let _mi, _smi, _es, _tcr, _ptc, _orders, _orderitems;
    let _sYM = sYM.value;
    let _summary;
    summaryTeam = [];
    for (let it of m.value) {
        _mi = await monthbyitemSvc.getBy({ jobno: jobno, subjobno: it.subjobno });
        _es = await estiitemSvc.getBy({ jobno: jobno, subjobno: it.subjobno });
        _tcr = await estiprojectSvc.getBy({ jobno: jobno, subjobno: it.subjobno });
        _ptc = _.map(tc.value, o => { return { ...o } });
        _orders = await ordersSvc.getBy({ jobno: jobno, subjobno: it.subjobno });
        _orderitems = await orderitemsSvc.getBy({ jobno: jobno, subjobno: it.subjobno });
        for (let taskc of _ptc) {
            let count = 0;
            for (let item of _es) {
                if (item.jobid[0] === taskc.jobtype) {
                    count = count + 1;
                }
            }
            taskc.count = count.toString();
        }
        _smi = _.filter(_mi, (item) => {
            return item.yearmonth == _sYM;
        });
        let obj1 = [];
        for (let o of _es) {
            obj1.push({ ...o });
        }
        for (let item of obj1) {
            let eitem = _.find(_smi, (it) => {
                return item.jobid == it.jobid;
            });
            if (eitem == undefined) {
                //console.log(item);
                item.yearmonth = _sYM;
                item.lmn_mh = 0;
                item.lmn_dwg = 0;
                item.accu_mh = 0;
                item.accu_dwg = 0;
                item.esti_prg = 0;
                item.act_prg = 0;
            } else {
                item = _.merge(item, eitem);
            }
        }
        _smi = obj1;
        for (let item of _smi) {
            item.accu_mh = await accumh(_sYM, item.jobid, _mi);
            item.accu_dwg = await accudwg(_sYM, item.jobid, _mi);
            
            if (item.jobid[0] == 'P') {
                item.esti_prg = await p_estiprg(item.jobid, _orders, _orderitems, _sYM, 1);
                item.act_prg = await p_actprg(item.jobid, _orders, _orderitems, _sYM, 1);    
                //console.log('item of smi', item);
            } else {
                item.esti_prg = await estiprg(_sYM, item.esti_start_date, item.esti_fin_date, 1);
                item.act_prg = await actprg(_sYM, item.jobid, _es, _mi, 1);
            }        
        }
        _summary = _getSummary(_sYM, it.subjobno, it.weight, _ptc, _tcr, _es, _mi, _smi, _orders);
        summaryTeam.push(_summary);
        //console.log(`${it.subjobno} : `, _summary);
        //calculate summary data
    }
    //console.log('summaryTeam: ', summaryTeam);
    const categorizedData = _.groupBy(_.flatten(summaryTeam), 'jobtype');
    //console.log('categorizedData:', categorizedData);

    const result = _.map(categorizedData, (jobs) => {
        const estidwg = _.sumBy(jobs, 'estidwg');
        const estimh = _.sumBy(jobs, 'estimh');
        const accudwg = _.sumBy(jobs, 'accudwg');
        const accumh = _.sumBy(jobs, 'accumh');
        const curym_accudwg = _.sumBy(jobs, 'curym_accudwg');
        const curym_accumh = _.sumBy(jobs, 'curym_accumh');

        const valides = jobs.filter(job => job.esti_sdate !== '');
        const esti_sdate = valides.length > 0 ? dayjs(_.minBy(valides, 'esti_sdate').esti_sdate).format('YYYY-MM-DD') : '';
        //const esti_sdate = dayjs(_.minBy(jobs, 'esti_sdate').esti_sdate).format('YYYY-MM-DD');
        const validef = jobs.filter(job => job.esti_fdate !== '');
        const esti_fdate = validef.length > 0 ? dayjs(_.maxBy(validef, 'esti_fdate').esti_fdate).format('YYYY-MM-DD') : '';
        //const esti_fdate = dayjs(_.maxBy(jobs, 'esti_fdate').esti_fdate).format('YYYY-MM-DD');
        const validas = jobs.filter(job => job.act_sdate !== '');
        const act_sdate = validas.length > 0 ? dayjs(_.minBy(validas, 'act_sdate').act_sdate).format('YYYY-MM-DD') : '';
        //const act_sdate = dayjs(_.minBy(jobs, 'act_sdate').act_sdate).format('YYYY-MM-DD');
        const validaf = jobs.filter(job => job.act_fdate !== '');
        const act_fdate = jobs.length == validaf.length ? dayjs(_.maxBy(validaf, 'act_fdate').act_fdate).format('YYYY-MM-DD') : '';
        //const act_fdate = dayjs(_.maxBy(jobs, 'act_fdate').act_fdate).format('YYYY-MM-DD');
        const ratio = (_.sum(_.zipWith(jobs, (it) => it.ratio * parseFloat(it.weight))) / 100).toFixed(1);
        const estiprg = (_.sum(_.zipWith(jobs, (it) => it.estimh * parseFloat(it.estiprg))) / _.sumBy(jobs, 'estimh')).toFixed(1); 
        const actprg = (_.sum(_.zipWith(jobs, (it) => it.estimh * parseFloat(it.actprg))) / _.sumBy(jobs, 'estimh')).toFixed(1);
        //const estiprg = (_.sum(_.zipWith(jobs, (it) => it.ratio * parseFloat(it.estiprg))) / _.sumBy(jobs, 'ratio')).toFixed(1); 
        //const actprg = (_.sum(_.zipWith(jobs, (it) => it.ratio * parseFloat(it.actprg))) / _.sumBy(jobs, 'ratio')).toFixed(1);

        //console.log(jobs);

        return {
            jobtype: jobs[0].jobtype,
            category: jobs[0].category,
            taskindex: jobs[0].taskindex,
            estidwg: estidwg,
            estimh: estimh,
            accudwg: accudwg,
            accumh: accumh,
            curym_accudwg: curym_accudwg,
            curym_accumh: curym_accumh,
            esti_sdate: esti_sdate,
            esti_fdate: esti_fdate,
            act_sdate: act_sdate,
            act_fdate: act_fdate,
            ratio: ratio,
            estiprg: estiprg,
            actprg: actprg,
        };
    });
    //console.log(result);
    summary.value = _.sortBy(result, 'taskindex');
    
};
*/
const getMonthItem = async (jobno, subjobno) => {

    if (typeof subjobno === 'number') {
        mi.value = await monthbyitemSvc.getBy({ jobno: jobno, subjobno: subjobno });
        es.value = await estiitemSvc.getBy({ jobno: jobno, subjobno: subjobno });
        tcr.value = await estiprojectSvc.getBy({ jobno: jobno, subjobno: subjobno });
        await getOrders(jobno, subjobno);
        await getOrderItems(jobno, subjobno);
    } else {
        mi.value = await monthbyitemSvc.getBy({ jobno: jobno });
        es.value = await estiitemSvc.getBy({ jobno: jobno });
        tcr.value = await estiprojectSvc.getBy({ jobno: jobno });
        orders.value = await ordersSvc.getBy({ jobno: jobno });
        orderitems.value = await orderitemsSvc.getBy({ jobno: jobno });
    }
    //console.log(orders.value);
    //mi.value = await monthbyitemSvc.getBy({ jobno: jobno, subjobno: subjobno });
    //es.value = await estiitemSvc.getBy({ jobno: jobno, subjobno: subjobno });
    //tcr.value = await estiprojectSvc.getBy({ jobno: jobno, subjobno: subjobno });
    ptc.value = _.map(tc.value, o => { return { ...o } });

    //console.log('mi:', mi.value);
    //console.log('es:', es.value);
    //console.log('tcr:', tcr.value);
    //console.log('ptc:', ptc.value);

    //orders.value = await ordersSvc.getBy({ jobno: user.sJobno, subjobno: sSubjobno.value });
    //orderitems.value = await orderitemsSvc.getBy({ jobno: user.sJobno, subjobno: sSubjobno.value });
    //console.log(orders.value);


    //ptc.value = tc.value;
    for (let taskc of ptc.value) {
        let count = 0;
        for (let item of es.value) {
            if (item.jobid[0] === taskc.jobtype) {
                count = count + 1;
            }
        }
        taskc.count = count.toString();
    }
    //console.log('ptc:', ptc.value);
    // add summary tabs
    // ptc.value.unshift({ jobtype: 'SUMMARY', category: '進度摘要', taskindex: 0, count: 1 });

    //smi.value = _.filter(mi.value, (item) => {
    //    return item.yearmonth == sYM.value;
    //});
    smi.value = mi.value.filter((item) => { return item.yearmonth == sYM.value; });

    //for (let it of smi.value) {
    //    if (it.subjobno == 3 || it.subjobno == 6) { console.log('it', it); }
    //}

    //console.log('smi:', smi.value);

    let obj1 = [...es.value];
    //for (let o of es.value) {
    //    obj1.push({ ...o });
    //}

    //for (let it of obj1) {
    //    if (it.subjobno == 3 || it.subjobno == 6) { console.log('es obj1: ', it); }
    //}
    //for (let it of es.value) {
    //    if (it.subjobno == 3 || it.subjobno == 6) { console.log('es: ', it); }
    //}

    //console.log('obj1:', obj1);
    for (let item of obj1) {
        //let eitem = _.find(smi.value, (it) => {
        //    return item.jobid == it.jobid;
        //});
        let eitem = smi.value.find((it) => { return item.jobid == it.jobid && item.subjobno == it.subjobno; });    
        //if (item.subjobno == 3 || item.subjobno == 6) { console.log('smi:', eitem); } 
        //if (item.subjobno == 3 || item.subjobno == 6) { console.log('es:', item); } 

        if (eitem == undefined) {
            //console.log(item);
            item.yearmonth = sYM.value;
            item.lmn_mh = 0;
            item.lmn_dwg = 0;
            item.accu_mh = 0;
            item.accu_dwg = 0;
            item.esti_prg = 0;
            item.act_prg = 0;
        } else {
            if (item.subjobno == eitem.subjobno && item.jobid == eitem.jobid) {
                item = _.merge(item, eitem);
                //item.lmn_mh = eitem.lmn_mh;
                //item.lmn_dwg = eitem.lmn_dwg;
                //item.accu_mh = eitem.accu_mh;
                //item.accu_dwg = eitem.accu_dwg;
                //item.esti_prg = eitem.esti_prg;
                //item.act_prg = eitem.act_prg;
                
            }
            
        }
        //if (item.subjobno == 3 || item.subjobno == 6) { console.log('item:', item); }
    }
    smi.value = obj1;

    for (let item of smi.value) {
        item.accu_mh = await util.accumh(sYM.value, item.subjobno, item.jobid, mi.value);
        item.accu_dwg = await util.accudwg(sYM.value, item.subjobno, item.jobid, mi.value);
        
        if (item.jobid[0] == 'P') {
            //item.esti_prg = await p_estiprg(item.jobid, orders.value, orderitems.value, sYM.value, 1);
            //item.act_prg = await p_actprg(item.jobid, orders.value, orderitems.value, sYM.value, 1);
            item.esti_prg = await util.p_estiprg(item.subjobno, item.jobid, orders.value, orderitems.value, sYM.value, 1);
            item.act_prg = await util.p_actprg(item.subjobno, item.jobid, orders.value, orderitems.value, sYM.value, 1);
        } else {
            //item.esti_prg = await estiprg(sYM.value, item.esti_start_date, item.esti_fin_date, 1);
            //item.act_prg = await actprg(sYM.value, item.jobid, es.value, mi.value, 1);
            item.esti_prg = await util.estiprg(sYM.value, item.subjobno, item.esti_start_date, item.esti_fin_date, 1);
            item.act_prg = await util.actprg(sYM.value, item.subjobno, item.jobid, es.value, mi.value, 1);
            //if (item.jobid[0] == 'I') {
            //    console.log(`${item.subjobno}, ${item.jobid}, ${item.esti_prg} ${item.act_prg}`);
            //}
            
        }

        //if (item.jobid[0] == 'P') {
        //    console.log(item);
        //}
        
    }
    //console.log(mi.value);
    //console.log('smi: ', smi.value);
    //console.log('es: ', es.value);
    //console.log('tcr: ', tcr.value);
    //console.log('ptc: ', ptc.value);
    await getSummary();
};

const updateMonthItem = async (item) => {
    let idx = _.findIndex(smi.value, (o) => {
        return o.jobid == item.jobid;
    });
    smi.value[idx] = item;
    //console.log('update: ', smi.value[idx]);
    //console.log(smi.value);
    let error = 0;
    for (let it of smi.value) {
        //console.log(it);
        //await monthbyitemSvc.update(it);
        //console.log(it);
        it.esti_prg = parseInt(it.esti_prg);
        it.act_prg = parseInt(it.act_prg);
        it.esti_start_date = it.esti_start_date == '' ? null : it.esti_start_date;
        it.esti_fin_date = it.esti_fin_date == '' ? null : it.esti_fin_date;
        it.start_date = it.start_date == '' ? null : it.start_date;
        it.fin_date = it.fin_date == '' ? null : it.fin_date;
        let obj = await monthbyitemSvc
            .getBy({
                jobno: it.jobno,
                subjobno: it.subjobno,
                yearmonth: it.yearmonth,
                jobid: it.jobid
            });
        //console.log(obj);

        if (obj.length > 0) {
            await monthbyitemSvc.update(it).then((data) => { data == 'updated' ? error = error : error = error + 1 });
            await estiitemSvc.update(it).then((data) => { data == 'updated' ? error = error : error = error + 1 });
        } else {
            await monthbyitemSvc.create(it).then((data) => { data == 'created' ? error = error : error = error + 1 });
            await estiitemSvc.update(it).then((data) => { data == 'updated' ? error = error : error = error + 1 });
        }
        
    }

    //console.log(tcr.value);
    //update estibyproject
    //let smiObj = Object.assign({}, smi.value);
    //let smiObj = _.map(smi.value, o => { return { ...o } });
    let uObj = Object.assign({}, tcr.value[0]);
    //console.log(uObj);
    //console.log(smiObj);
    let ptcObj = _.filter(ptc.value, (o) => { return o.count > 0; });


    for (let o of ptcObj) {
        //console.log(o);
        o.esti_sdate = util.esti_sdate_byjt(o.jobtype, smi.value);
        o.esti_fdate = util.esti_fdate_byjt(o.jobtype, smi.value);
        o.act_sdate = util.act_sdate_byjt(o.jobtype, smi.value);
        o.act_fdate = util.act_fdate_byjt(o.jobtype, smi.value);
        o.estidwg = util.estidwg_byjt(o.jobtype, smi.value);
        o.estimh = util.estimh_byjt(o.jobtype, smi.value);

        switch(o.jobtype) {
            case 'I':
                uObj.id_esti_mh = o.estimh;
                uObj.id_esti_dwg = o.estidwg;
                uObj.id_esti_start_date = o.esti_sdate;
                uObj.id_start_date = o.act_sdate;
                uObj.id_esti_fin_date = o.esti_fdate;
                uObj.id_fin_date = o.act_fdate;                
                break;
            case 'B':
                uObj.bd_esti_mh = o.estimh;
                uObj.bd_esti_dwg = o.estidwg;
                uObj.bd_esti_start_date = o.esti_sdate;
                uObj.bd_start_date = o.act_sdate;
                uObj.bd_esti_fin_date = o.esti_fdate;
                uObj.bd_fin_date = o.act_fdate;                
                break;
            case 'D':
                uObj.dd_esti_mh = o.estimh;
                uObj.dd_esti_dwg = o.estidwg;
                uObj.dd_esti_start_date = o.esti_sdate;
                uObj.dd_start_date = o.act_sdate;
                uObj.dd_esti_fin_date = o.esti_fdate;
                uObj.dd_fin_date = o.act_fdate;
                break;
            case 'E':
                uObj.dcs_esti_mh = o.estimh;
                uObj.dcs_esti_dwg = o.estidwg;
                uObj.dcs_esti_start_date = o.esti_sdate;
                uObj.dcs_start_date = o.act_sdate;
                uObj.dcs_esti_fin_date = o.esti_fdate;
                uObj.dcs_fin_date = o.act_fdate;                
                break;
            case 'F':
                uObj.plc_esti_mh = o.estimh;
                uObj.plc_esti_dwg = o.estidwg;
                uObj.plc_esti_start_date = o.esti_sdate;
                uObj.plc_start_date = o.act_sdate;
                uObj.plc_esti_fin_date = o.esti_fdate;
                uObj.plc_fin_date = o.act_fdate;                
                break;
            case 'C':
                uObj.cnt_esti_mh = o.estimh;
                uObj.cnt_esti_dwg = o.estidwg;
                uObj.cnt_esti_start_date = o.esti_sdate;
                uObj.cnt_start_date = o.act_sdate;
                uObj.cnt_esti_fin_date = o.esti_fdate;
                uObj.cnt_fin_date = o.act_fdate;                
                break;
            case 'P':
                uObj.buy_esti_mh = o.estimh;
                uObj.buy_esti_dwg = o.estidwg;
                uObj.buy_esti_start_date = o.esti_sdate;
                uObj.buy_start_date = o.act_sdate;
                uObj.buy_esti_fin_date = o.esti_fdate;
                uObj.buy_fin_date = o.act_fdate;                
                break;
            case 'K':
                uObj.con_esti_mh = o.estimh;
                //updateObj.con_esti_dwg = o.estidwg;
                uObj.con_esti_start_date = o.esti_sdate;
                uObj.con_start_date = o.act_sdate;
                uObj.con_esti_fin_date = o.esti_fdate;
                uObj.con_fin_date = o.act_fdate;                
                break;
            case 'T':
                uObj.com_esti_mh = o.estimh;
                //updateObj.com_esti_dwg = o.estidwg;
                uObj.com_esti_start_date = o.esti_sdate;
                uObj.com_start_date = o.act_sdate;
                uObj.com_esti_fin_date = o.esti_fdate;
                uObj.com_fin_date = o.act_fdate;
                break;
            case 'R':
                uObj.rpt_esti_mh = o.estimh;
                uObj.rpt_esti_dwg = o.estidwg;
                uObj.rpt_esti_start_date = o.esti_sdate;
                uObj.rpt_start_date = o.act_sdate;
                uObj.rpt_esti_fin_date = o.esti_fdate;
                uObj.rpt_fin_date = o.act_fdate;
                break;
        }
    }

    //console.log(uObj);
    await estiprojectSvc.update(uObj).then((data) => { data == 'updated' ? error = error : error = error + 1 });
    //console.log('smi: ', smi.value);
    //console.log('es: ', es.value);
    //console.log('user: ', user);

    //update monthbyproject
    
    
    //let updateObj = _.map(newmonthbyproject, o => { return { ...o } });
    
    //console.log({ jobno: user.sJobno, subjobno: sSubjobno.value, yearmonth: sYM.value });
    let data = await monthlyworkSvc.getBy({ jobno: user.sJobno, subjobno: sSubjobno.value, yearmonth: sYM.value });
    let updateObj;
    if (data.length > 0) {
        //updateObj = _.map(newmonthbyproject, o => { return { ...o } });
        updateObj = data[0];
    } else {
        updateObj = Object.assign({}, newmonthbyproject);
    }
    //console.log('2: ', updateObj);    

    let summary = _.filter(ptc.value, (o) => { return o.count > 0; });
    for (let o of summary) {
        o.esti_sdate = util.esti_sdate_byjt(o.jobtype, es.value);
        o.esti_fdate = util.esti_fdate_byjt(o.jobtype, es.value);
        o.act_sdate = util.act_sdate_byjt(o.jobtype, es.value);
        o.act_fdate = util.act_fdate_byjt(o.jobtype, es.value);
        o.estidwg = util.estidwg_byjt(o.jobtype, es.value);
        o.estimh = util.estimh_byjt(o.jobtype, es.value);
        o.curym_accumh = util.curym_accumh_byjt(sYM.value, o.jobtype, mi.value);
        o.curym_accudwg = util.curym_accudwg_byjt(sYM.value, o.jobtype, mi.value);
        o.accudwg = util.accudwg_byjt(sYM, o.jobtype, mi.value);
        o.accumh = util.accumh_byjt(sYM, o.jobtype, mi.value);
        o.estiprg = util.estiprg_byjt(o.jobtype, es.value, smi.value, orders.value, 1);
        o.actprg = util.actprg_byjt(o.jobtype, es.value, smi.value, orders.value, 1);

        switch (o.jobtype) {
            case 'I': 
                //o.ratio = wt.id_wt;
                //o.design_type = wt.id_type;
                updateObj.id_lmn_mh = o.curym_accumh;
                updateObj.id_lmn_dwg = o.curym_accudwg;
                updateObj.id_accu_mh = o.accumh;
                updateObj.id_accu_dwg = o.accudwg;
                updateObj.id_esti_prg = parseFloat(o.estiprg);
                updateObj.id_prg = parseFloat(o.actprg);
                break;
            case 'B': 
                //o.ratio = wt.bd_wt;
                //o.design_type = wt.bd_type;
                updateObj.bd_lmn_mh = o.curym_accumh;
                updateObj.bd_lmn_dwg = o.curym_accudwg;
                updateObj.bd_accu_mh = o.accumh;
                updateObj.bd_accu_dwg = o.accudwg;
                updateObj.bd_esti_prg = parseFloat(o.estiprg);
                updateObj.bd_prg = parseFloat(o.actprg);
                break;
            case 'D': 
                //o.ratio = wt.dd_wt; 
                //o.design_type = wt.dd_type;
                updateObj.dd_lmn_mh = o.curym_accumh;
                updateObj.dd_lmn_dwg = o.curym_accudwg;
                updateObj.dd_accu_mh = o.accumh;
                updateObj.dd_accu_dwg = o.accudwg;
                updateObj.dd_esti_prg = parseFloat(o.estiprg);
                updateObj.dd_prg = parseFloat(o.actprg);
                break;
            case 'E': 
                //o.ratio = wt.dcs_wt; 
                //o.design_type = wt.dcs_type;
                updateObj.dcs_lmn_mh = o.curym_accumh;
                updateObj.dcs_lmn_dwg = o.curym_accudwg;
                updateObj.dcs_accu_mh = o.accumh;
                updateObj.dcs_accu_dwg = o.accudwg;
                updateObj.dcs_esti_prg = parseFloat(o.estiprg);
                updateObj.dcs_prg = parseFloat(o.actprg);            
                break;
            case 'F': 
                //o.ratio = wt.plc_wt;
                //o.design_type = wt.plc_type;
                updateObj.plc_lmn_mh = o.curym_accumh;
                updateObj.plc_lmn_dwg = o.curym_accudwg;
                updateObj.plc_accu_mh = o.accumh;
                updateObj.plc_accu_dwg = o.accudwg;
                updateObj.plc_esti_prg = parseFloat(o.estiprg);
                updateObj.plc_prg = parseFloat(o.actprg);            
                break;
            case 'C': 
                //o.ratio = wt.cnt_wt; 
                //o.design_type = wt.cnt_type;
                updateObj.cnt_lmn_mh = o.curym_accumh;
                updateObj.cnt_lmn_dwg = o.curym_accudwg;
                updateObj.cnt_accu_mh = o.accumh;
                updateObj.cnt_accu_dwg = o.accudwg;
                updateObj.cnt_esti_prg = parseFloat(o.estiprg);
                updateObj.cnt_prg = parseFloat(o.actprg);
                break;
            case 'P': 
                //o.ratio = wt.buy_wt;
                //o.design_type = wt.buy_type;
                updateObj.buy_lmn_mh = o.curym_accumh;
                updateObj.buy_lmn_dwg = o.curym_accudwg;
                updateObj.buy_accu_mh = o.accumh;
                updateObj.buy_accu_dwg = o.accudwg;
                updateObj.buy_esti_prg = parseFloat(o.estiprg);
                updateObj.buy_prg = parseFloat(o.actprg);
                break;
            case 'K':
                //o.ratio = wt.con_wt; 
                //o.design_type = wt.con_type;
                updateObj.con_lmn_mh = o.curym_accumh;
                updateObj.con_accu_mh = o.accumh;
                updateObj.con_esti_prg = parseFloat(o.estiprg);
                updateObj.con_prg = parseFloat(o.actprg);
                break;
            case 'T': 
                //o.ratio = wt.com_wt; 
                //o.design_type = wt.com_type;
                updateObj.com_lmn_mh = o.curym_accumh;
                updateObj.com_accu_mh = o.accumh;
                updateObj.com_esti_prg = parseFloat(o.estiprg);
                updateObj.com_prg = parseFloat(o.actprg);
                break;
            case 'R': 
                //o.ratio = wt.rpt_wt; 
                //o.design_type = wt.rpt_type;
                updateObj.rpt_lmn_mh = o.curym_accumh;
                updateObj.rpt_lmn_dwg = o.curym_accudwg;
                updateObj.rpt_accu_mh = o.accumh;
                updateObj.rpt_accu_dwg = o.accudwg;
                updateObj.rpt_esti_prg = parseFloat(o.estiprg);
                updateObj.rpt_prg = parseFloat(o.actprg);    
                break;
        }

    }
    
    updateObj.prg_esti = parseFloat(util.estiprg_all(ptc.value, tcr.value, es.value, smi.value, orders.value, 1));
    updateObj.prg = parseFloat(util.actprg_all(ptc.value, tcr.value, es.value, smi.value, orders.value, 1));


    //console.log('summary: ', summary);
    if ( _.isEmpty(updateObj.jobno) ) {
        updateObj.jobno = user.sJobno;
        updateObj.subjobno = sSubjobno.value;
        updateObj.yearmonth = sYM.value;
        //monthlyworkSvc.create(up);
        await monthlyworkSvc.create(updateObj).then((data) => { data == 'created' ? error = error : error = error + 1 });
    } else {
        await monthlyworkSvc.update(updateObj).then((data) => { data == 'updated' ? error = error : error = error + 1 });
    }

    //console.log('updateObj:', updateObj);

    error == 0 ? ElMessage({ message: '更新成功', type: 'success' }) : ElMessage({ message: '更新失敗', type: 'error' });
    await getMonthItem(user.sJobno, sSubjobno.value);
};

const getPurchaseTask = async () => {
    ptask.value = [];
    for (let it of es.value) {
        if (it.jobid[0] == 'P') {
            //console.log(it.jobid, it.content);
            ptask.value.push({value: it.jobid, label: it.content});
        }
    }    
};

const getNewSerailNo = async (ordercategory) => {
    
    //let group = user.ofgroup1.slice(-1);
    let team = user.ofgroup1.slice(0, 3);
    let code = ''
    // MW0A二級單位代碼 Y61: A, Y62: B, Y63: S, Y64: D, Y65: E, Y6N: N, Y6P: P, Y6T: T
    switch (team) {
        case 'Y62':
            code = 'B';
            break;
        case 'Y63':
            code = 'S';
            break;
        case 'Y65':
            code = 'E';
            break;
        default:
            code = 'A';
            break;
    }

    let year = dayjs().year() - 1911;
    //let querystr = `${year}${group}${'%'}`;
    let querystr = `${year}${code}${'%'}`;
    //console.log(querystr);
    //let torders = await ordersSvc.getBy({ category: ordercategory, y6tserialno: querystr });
    let torders = await ordersSvc.getBy({ y6tserialno: querystr });

    let newno = 0;
    let newserialno = '';
    if (torders.length > 0) {
        let lastOrder = torders.reduce((p, c) => p.y6tserialno > c.y6tserialno ? p : c);
        newno = parseInt(lastOrder.y6tserialno.slice(-3)) + 1; 
    } else {
        newno = 1;
    }
    
    /*
    if (ordercategory == 1) {
        //C1請購序號
        newserialno = `${year}${code}${String(newno).padStart(3, '0')}`;
    } else if (ordercategory > 1 && ordercategory < 6) {
        //其他購案: 小額,緊急,長約,Y61外包,W61外包
        newserialno = `${String(newno).padStart(3, '0')}`
    } else {
        newserialno = "";
    }
    */
    newserialno = `${year}${code}${String(newno).padStart(3, '0')}`;


    console.log(newserialno); 
    //console.log(torders);
    return newserialno;
};

const getOrders = async (jobno, subjobno) => {
    //console.log('get orders:');
    orders.value = await ordersSvc.getBy({ jobno: jobno, subjobno: subjobno });
    //console.log(subjobno);
    //console.log('orders: ', orders.value);
    getPurchaseTask();
    if (orders.value.length > 0) {
        currentOrder.value = orders.value[0];        
    }
    //console.log('orders:', orders.value);
    //console.log(typeof orders.value[0].estimateamount)
};

const addOrders = async (jobno, subjobno) => {
    neworder.value.jobno = jobno;
    neworder.value.subjobno = subjobno;
    neworder.value.purchase_esti_issue_date = neworder.value.purchase_esti_issue_date != "" ? neworder.value.purchase_esti_issue_date : date1;
    neworder.value.purchase_issue_date = neworder.value.purchase_issue_date != "" ? neworder.value.purchase_issue_date : null;
    neworder.value.c1_order_esti_date = neworder.value.c1_order_esti_date != "" ? neworder.value.c1_order_esti_date : date2;
    neworder.value.c1_order_date = neworder.value.c1_order_date != "" ? neworder.value.c1_order_date : null;
    neworder.value.c1_issue_date = neworder.value.c1_issue_date != "" ? neworder.value.c1_issue_date : null;
    neworder.value.c1_query_date = neworder.value.c1_query_date != "" ? neworder.value.c1_query_date : null;
    neworder.value.delivery_esti_date = neworder.value.delivery_esti_date != "" ? neworder.value.delivery_esti_date : null;
    neworder.value.delivery_date = neworder.value.delivery_date != "" ? neworder.value.delivery_date : null;
    neworder.value.receivecheck_esti_date = neworder.value.receivecheck_esti_date != "" ? neworder.value.receivecheck_esti_date : null;
    neworder.value.receivecheck_date = neworder.value.receivecheck_date != "" ? neworder.value.receivecheck_date : null;
    neworder.value.y6tserialno = await getNewSerailNo(neworder.value.category);
    neworder.value.estimateamount = pv(neworder.value.estimateamount);
    neworder.value.amount = pv(neworder.value.amount);
    neworder.value.latedelivery2y61 = null;
    //console.log(await getNewSerailNo(neworder.value.category));
    if (orders.value.length > 0) {
        let lastOrder = orders.value.reduce((p, c) => p.item > c.item ? p : c);
        neworder.value.item = lastOrder.item + 1;
    } else {
        neworder.value.item = 1;
    }
    let error = 0;
    await ordersSvc.create(neworder.value).then((data) => { data == 'created' ? error = error : error = error + 1 });
    error == 0 ? ElMessage({ message: '新增成功', type: 'success' }) : ElMessage({ message: '新增失敗', type: 'error' });
    
    //console.log(neworder.value);
    await getOrders(jobno, subjobno);
    await getOrderItems(jobno, subjobno);
    //ordersTableRef.value.setCurrentRow(neworder.value);
    ordersTableRef.value.setCurrentRow(orders.value[orders.value.length-1]);
    ordersClick();

};

const updateOrders = async () => {
    //console.log('update orders:', orders.value);
    if (!_.isEmpty(orders.value)) {
        let error = 0;
        let updateobj = _.map(orders.value, o => { return { ...o } });

        console.log(updateobj);

        for (let it of updateobj) {
            //console.log('it:', it);
            it.estimateamount = pv(it.estimateamount);
            it.amount = pv(it.amount);
            await ordersSvc.update(it).then((data) => { data == 'updated' ? error = error : error = error + 1 });
        }
        error == 0 ? ElMessage({ message: '更新成功', type: 'success' }) : ElMessage({ message: '更新失敗', type: 'error' });
    }

};

const removeOrders = async () => {

    if (selectedOrders.value) {
        let idx;
        let error = 0;
        for (let it of selectedOrders.value) {
            idx = orders.value.findIndex(obj => { return obj.jobno == it.jobno && obj.subjobno == it.subjobno && obj.item == it.item });
            orders.value.splice(idx, 1);
            await ordersSvc.remove(it).then((data) => { data == 'removed' ? error = error : error = error + 1 });
        }
        error == 0 ? ElMessage({ message: '刪除成功', type: 'success' }) : ElMessage({ message: '刪除失敗', type: 'error' });
        await getOrders(user.sJobno, sSubjobno.value);
        //sorder.value = {};  // clear selected order
        currentOrder.value = {};
    }

};

const handleSelectionOrders = (val) => {
    selectedOrders.value = val;
};

const handleOrdersChange = (val) => {
    currentOrder.value = val;
    //console.log(currentOrder.value);
};

const ordersClick = (row, column, event) => {
    //console.log('click row: ', row);
    //sorder.value = row;
    //getOrderItems();
    sorderitems.value = [];

    for (let it of orderitems.value) {
        if (it.jobno == user.sJobno && it.subjobno == sSubjobno.value && it.serialno == currentOrder.value.item) {
            sorderitems.value.push(it);
        }
    }

    //_.filter is slower than for of loop
    //sorderitems.value = _.filter(orderitems.value, (o) => { return o.jobno == user.sJobno && o.subjobno == sSubjobno.value && o.serialno == currentOrder.value.item; });
    //sorderitems.value = _.filter(orderitems.value, (o) => {
    //    return o.jobno == user.sJobno && o.subjobno == sSubjobno.value && o.serialno == sorder.value.item;
    //});
    //console.log(orderitems.value);

};

const getOrderItems = async (jobno, subjobno) => {
    orderitems.value = await orderitemsSvc.getBy({ jobno: jobno, subjobno: subjobno });
    //console.log('orderitems: ', orderitems.value);
};

const getOrdersSummary = (param) => {
    let { columns, data } = param;
    let sums = [];
    columns.forEach((column, index) => {
        if (index === 1) {
            sums[index] = '合計';
            return
        }
        
        if (index == 14) {
            let estiTotal = _.reduce(data, (sum, item) => {
                return sum + parseInt(pv(item.estimateamount));
            }, 0);
            //console.log(estiTotal);            
            sums[index] = fv(estiTotal);
        }
        
        if (index == 15) {
            let actTotal = _.reduce(data, (sum, item) => {
                return sum + parseInt(pv(item.amount));
            }, 0);            
            sums[index] = fv(actTotal);
        }

    })

    return sums;
};

const getOrderItemsSummary = (param) => {
    let { columns, data } = param;
    let sums = [];
    columns.forEach((column, index) => {
        if (index === 1) {
            sums[index] = '小計';
            return
        }
        if (index == 7) {
            let estiSubTotal = _.reduce(data, (sum, item) => {
                return sum + pv(item.esti_unit_price) * item.exchangerate * item.quantity;
            }, 0);            
            sums[index] = fv(estiSubTotal.toFixed(0));
        }
        if (index == 8) {
            let actSubTotal = _.reduce(data, (sum, item) => {
                return sum + pv(item.unit_price) * item.exchangerate * item.quantity;
            }, 0);            
            sums[index] = fv(actSubTotal.toFixed(0));
        }

        /*
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => Number.isNaN(value))) {
            sums[index] = `$ ${values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!Number.isNaN(value)) {
                    return prev + curr;
                } else {
                    return prev;
                }
            }, 0)}`
        } else {
            sums[index] = 'N/A'
        }*/
    })

    return sums;
};

const addOrderitems = async () => {
    //console.log(currentOrder.value, orders.value);
    //console.log('neworderitem: ', neworderitem.value);
    if (!(_.isEmpty(currentOrder.value) || _.isEmpty(orders.value))) {
        neworderitem.value.jobno = user.sJobno;
        neworderitem.value.subjobno = sSubjobno.value;
        neworderitem.value.serialno = currentOrder.value.item;
        neworderitem.value.purchase_esti_issue_date = neworderitem.value.purchase_esti_issue_date != "" ? neworderitem.value.purchase_esti_issue_date : pdate;
        neworderitem.value.purchase_esti_date = neworderitem.value.purchase_esti_date != "" ? neworderitem.value.purchase_esti_date : null;
        neworderitem.value.c1_order_esti_date = neworderitem.value.c1_order_esti_date != "" ? neworderitem.value.c1_order_esti_date : odate;
        neworderitem.value.c1_order_date = neworderitem.value.c1_order_date != "" ? neworderitem.value.c1_order_date : null;
        neworderitem.value.delivery_esti_date = neworderitem.value.delivery_esti_date != "" ? neworderitem.value.delivery_esti_date : ddate;
        neworderitem.value.delivery_date = neworderitem.value.delivery_date != "" ? neworderitem.value.delivery_date : null;
        neworderitem.value.receivecheck_esti_date = neworderitem.value.receivecheck_esti_date != "" ? neworderitem.value.receivecheck_esti_date : rdate;
        neworderitem.value.receivecheck_date = neworderitem.value.receivecheck_date != "" ? neworderitem.value.receivecheck_date : null;
        if (sorderitems.value.length > 0) {
            let lastOrderitem = sorderitems.value.reduce((p, c) => p.item > c.item ? p : c);
            neworderitem.value.item = lastOrderitem.item + 1;
        } else {
            neworderitem.value.item = 1;
        }
        let error = 0;
        await orderitemsSvc.create(neworderitem.value).then((data) => { data == 'created' ? error = error : error = error + 1 });
        error == 0 ? ElMessage({ message: '新增成功', type: 'success' }) : ElMessage({ message: '新增失敗', type: 'error' });
        //sorderitems.value.push(neworderitem.value);
        await getOrderItems(user.sJobno, sSubjobno.value);
        ordersClick();       
    }

};

const updateOrderitems = async () => {
    //console.log('update orderitems:', sorderitems.value);
    if (!_.isEmpty(sorderitems.value)) {
        let error = 0;
        let updateObj = _.map(sorderitems.value, o => { return { ...o } });
        //console.log('updateObj:', updateObj);
        for (let it of updateObj) {
            it.esti_unit_price = pv(it.esti_unit_price);
            it.unit_price = pv(it.unit_price);
            //if (it.receivecheck_date == null || it.receivecheck_date == '' || dayjs(it.receivecheck_date).isBefore('1900-01-01')) {
            //    it.receivecheck_date = null;
            //}            
            await orderitemsSvc.update(it).then((data) => { data == 'updated' ? error = error : error = error + 1 });
        }

        let estimateamount = _.reduce(updateObj, (sum, item) => {
            return sum + item.esti_unit_price * item.estiexchangerate * item.quantity;
        }, 0);        
        let amount = _.reduce(updateObj, (sum, item) => {
            return sum + item.unit_price * item.exchangerate * item.quantity;
        }, 0);        

        let delivery_esti_date = (_.minBy(sorderitems.value, item => dayjs(item.delivery_esti_date))).delivery_esti_date;
        let delivery_date = (_.minBy(sorderitems.value, item => dayjs(item.delivery_date))).delivery_date;
        let receivecheck_esti_date = (_.minBy(sorderitems.value, item => dayjs(item.receivecheck_esti_date))).receivecheck_esti_date;
        let receivecheck_date = (_.minBy(sorderitems.value, item => dayjs(item.receivecheck_date))).receivecheck_date;
        //console.log('receivecheck_date: ', receivecheck_date)
        //let receivecheck_date;

        //let rd = _.map(sorderitems.value, 'receivecheck_date');
        //let z = _.min(rd);
/*
        const data = [
            { item: 1, d_date: '2023-05-01' },
            { item: 2, d_date: '' },
            { item: 3, d_date: '1899-12-31' },
            { item: 4, d_date: '2023-12-01' },
        ];
*/

        _.map(sorderitems.value, item => {
            if (item.receivecheck_date == null || item.receivecheck_date == '' || dayjs(item.receivecheck_date).isBefore('1900-01-01')) {
                receivecheck_date = null;
            }
        });

        //let rd = _.filter(sorderitems.value, (item) => item.receivecheck_date != '');

        //let receivecheck_date = (_.minBy(sorderitems.value, item => dayjs(item.receivecheck_date))).receivecheck_date;

        //console.log('rd: ', rd);
        //console.log('z: ', z);
/*
        const data = [
            { item: 1, d_date: '2023-05-01' },
            { item: 2, d_date: '' },
            { item: 3, d_date: '2023-02-01' },
            { item: 4, d_date: '2023-12-01' },
        ];

        const validDates = data
            .filter(item => item.d_date !== '') // Filter out empty dates
            .map(item => dayjs(item.d_date)); // Convert to dayjs objects

        const latestDate = _.max(validDates);
        const result = latestDate ? latestDate.format('YYYY-MM-DD') : '';
        console.log(result);
*/

        //let updateObj2 = _.map([currentOrder.value], o => { return { ...o } });
        //updateObj2.estimateamount = estimateamount;
        let updateOrderObj = { ...currentOrder.value };
        updateOrderObj.estimateamount = estimateamount;
        updateOrderObj.amount = amount;
        updateOrderObj.delivery_esti_date = delivery_esti_date;
        updateOrderObj.delivery_date = delivery_date;
        updateOrderObj.receivecheck_esti_date = receivecheck_esti_date;
        updateOrderObj.receivecheck_date = receivecheck_date;
        //console.log('updateOrderObj:', updateOrderObj);
        //console.log('update error:', error);
        //console.log('s_total:', estimateamount);
        //console.log('oi rec_chk_d: ', get_lastdate_bycol('receivecheck_esti_date', sorderitems.value));
        //console.log('updateOrderObj', updateOrderObj);

        await ordersSvc.update(updateOrderObj).then((data) => { data == 'updated' ? error = error : error = error + 1 });
        //let idx = _.findIndex(orders.value, (o) => {
        //    return o.jobid == item.jobid;
        //});
        //_.find
        //orders.value
        //ordersTableRef.value.setCurrentRow(orders.value[orders.value.length-1]);

        error == 0 ? ElMessage({ message: '更新成功', type: 'success' }) : ElMessage({ message: '更新失敗', type: 'error' });
    }

};

const removeOrderitems = async () => {

    if (selectedOrderitems.value) {
        let idx;
        let error = 0;
        for (let it of selectedOrderitems.value) {
            idx = sorderitems.value.findIndex(obj => { return obj.jobno == it.jobno && obj.subjobno == it.subjobno && obj.serialno == it.serialno && obj.item == it.item });
            sorderitems.value.splice(idx, 1);
            await orderitemsSvc.remove(it).then((data) => { data == 'removed' ? error = error : error = error + 1 });
        }
        error == 0 ? ElMessage({ message: '刪除成功', type: 'success' }) : ElMessage({ message: '刪除失敗', type: 'error' });
        await getOrderItems(user.sJobno, sSubjobno.value);
    }

};


const handleSelectionOrderitems = (val) => {
    //console.log(val);
    selectedOrderitems.value = val;
};

const orderreportExport = async(jobno, subjobno) => {

    //console.log(jobno, subjobno);
    
    await utilSvc
        .orderreport({jobno: jobno, subjobno: subjobno})
        .then((data) => {
            console.log('data:', data);
            //if (data) {
            //    utilSvc.downloadFile({ file: data, group: refGroup.value.sGroup });
            //}
            
        });

};

const getPurchaseData = async(jobno, subjobno) => {
    let date_st = dayjs('1901-01-01').format('YYYY-MM-DD');
	let date_sp = dayjs(sYM.value, 'YYYYMM').endOf('month').format('YYYY-MM-DD');
    let result; 
    
    // 計畫請購金額
    await commonSvc
        .getEstimateamount({ jobno: jobno, subjobno: subjobno })
        .then((data) => {
            result = data[0];
            pData.value.estimateamount = util.isEmpty(result) ? 0 : result.estimateamount;            
        });
    // 應請購金額
    await commonSvc
        .getPurchaseEsti({ jobno: jobno, subjobno: subjobno, date_st: date_st, date_sp: date_sp })
        .then((data) => {
            result = data[0];
            pData.value.purchaseesti = util.isEmpty(result) ? 0 : result.estiamount;            
        });
    // 已請購金額
    await commonSvc
        .getPurchase({ jobno: jobno, subjobno: subjobno, date_st: date_st, date_sp: date_sp })
        .then((data) => {
            result = data[0];
            pData.value.purchase = util.isEmpty(result) ? 0 : result.estiamount;
        });
    
    // 應訂購金額
    await commonSvc
        .getOrderEsti({ jobno: jobno, subjobno: subjobno, date_st: date_st, date_sp: date_sp })
        .then((data) => {
            result = data[0];
            pData.value.orderesti = util.isEmpty(result) ? 0 : result.amount;
        });
    
    // 已訂購金額
    await commonSvc
        .getOrder({ jobno: jobno, subjobno: subjobno, date_st: date_st, date_sp: date_sp })
        .then((data) => {
            result = data[0];
            pData.value.order = util.isEmpty(result) ? 0 : result.amount;
        });
    
    // 應交貨金額
    await commonSvc
        .getDeliveryEsti({ jobno: jobno, subjobno: subjobno, date_st: date_st, date_sp: date_sp })
        .then((data) => {
            result = data[0];
            pData.value.deliveryesti = util.isEmpty(result) ? 0 : result.amount;
        });

    // 已交貨金額
    await commonSvc
        .getDelivery({ jobno: jobno, subjobno: subjobno, date_st: date_st, date_sp: date_sp })
        .then((data) => {
            result = data[0];
            pData.value.delivery = util.isEmpty(result) ? 0 : result.amount;
        });

    // 應驗收金額
    await commonSvc
        .getReceiveCheckEsti({ jobno: jobno, subjobno: subjobno, date_st: date_st, date_sp: date_sp })
        .then((data) => {
            result = data[0];
            pData.value.receivecheckesti = util.isEmpty(result) ? 0 : result.amount;
        });

    // 已驗收金額
    await commonSvc
        .getReceiveCheck({ jobno: jobno, subjobno: subjobno, date_st: date_st, date_sp: date_sp })
        .then((data) => {
            result = data[0];
            pData.value.receivecheck = util.isEmpty(result) ? 0 : result.amount;
        });
    //console.log(pData.value);
};

const printMonthWork = async(jobno, subjobno) => {
    /*
    await basicSvc
        .getBy({ jobno: jobno })
        .then((data) => {
            b.value = data[0];
        });
    */
    let wc = await contentSvc
        .getBy({ jobno: jobno })
        .then((data) => {
            return data[0];
        });

    let mw = await monthlyworkSvc
        .getBy({ jobno: jobno, subjobno: subjobno, yearmonth: sYM.value })
        .then((data) => {
            return data[0];
        });    

    let smember = await memberSvc
        .getBy({ jobno: jobno, subjobno: subjobno })
        .then((data) => {
            return data[0];
        });

    let leadername = await leaderSvc
        .getBy({ jobno: jobno })
        .then((data) => {
            let result = data;
            //console.log(result);
            if (util.isEmpty(result)) {
                return '';
            } else {
                let sleader = _.find(result, { enddate: null });
                //console.log(sleader);
                if (typeof sleader === 'array') {
                    return sleader[0].name;
                } else if (typeof sleader === 'object') {
                    return sleader.name;
                } else {
                    return '';
                }
                //return data;
            }
        });
    
    memberInfo.value = {
        team: smember.ofgroup1.substring(0, 3),
        leader: leadername,
        member: smember.name
    };
    await utilSvc.monthworkreport(sYM.value, memberInfo.value, b.value, summary.value, ptc.value, tcr.value, es.value, smi.value, mi.value, orders.value, pData.value, wc, mw, checkContent.value);

};

const printMonthWorkTotal = async(jobno, subjobno) => {
    /*
    await basicSvc
        .getBy({ jobno: jobno })
        .then((data) => {
            b.value = data[0];
        });
    */
    await utilSvc.monthworktotalreport(sYM.value, b.value, summary.value, ptc.value, tcr.value, es.value, smi.value, mi.value, orders.value, pData.value, mptotal.value);

};

const printProjectWork = async(jobno) => {
    /*
    await basicSvc
        .getBy({ jobno: jobno })
        .then((data) => {
            b.value = data[0];
        });
    */
    let smember;
    await memberSvc
        .getBy({ jobno: jobno})
        .then((data) => {
            let result = data;
            if (util.isEmpty(result)) {
                return '';
            } else {
                smember = _.find(result, { enddate: null });
                //console.log(smember);
                if (typeof smember === 'array') {
                    return smember[0];
                } else if (typeof smember === 'object') {
                    return smember;
                } else {
                    return '';
                }
                //return data;
            }

            return data[0];
        });
    
    let sleader;
    await leaderSvc
        .getBy({ jobno: jobno })
        .then((data) => {
            let result = data;
            //console.log(result);
            if (util.isEmpty(result)) {
                return '';
            } else {
                sleader = _.find(result, { enddate: null });
                //console.log(sleader);
                if (typeof sleader === 'array') {
                    return sleader[0].name;
                } else if (typeof sleader === 'object') {
                    return sleader.name;
                } else {
                    return '';
                }
                //return data;
            }
        });
    
    memberInfo.value = {
        team: smember.ofgroup1.substring(0, 3),
        leader: sleader.name,
        member: smember.name
    };

    //console.log(summary.value);
    await utilSvc.projectworkreport(sYM.value, memberInfo.value, b.value, summary.value, es.value, smi.value, pData.value, orders.value, mptotal.value);
};
/*
const curym_accumh_byjt = (curym, jt, mi) => {
    let data = _.filter(mi, (item) => {
        return item.jobid[0] == jt && item.yearmonth == curym;
    });
    let total_mh = _.reduce(data, (sum, item) => {
        item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        return sum + item.lmn_mh;
    }, 0);
    return total_mh;
};

const curym_accudwg_byjt = (curym, jt, mi) => {
    let data = _.filter(mi, (item) => {
        return item.jobid[0] == jt && item.yearmonth == curym;
    });
    let total_dwg = _.reduce(data, (sum, item) => {
        item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        return sum + item.lmn_dwg;
    }, 0);
    return total_dwg;
};
*/
/*
const accumh = (curym, subjobno, jobid, mi) => {
    let data = _.filter(mi, (item) => {
        return item.subjobno == subjobno && item.jobid == jobid && item.yearmonth <= curym;
    });
    let total_mh = _.reduce(data, (sum, item) => {
        item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        return sum + item.lmn_mh;
    }, 0);
    return total_mh;
};

const accudwg = (curym, subjobno, jobid, mi) => {
    let data = _.filter(mi, (item) => {
        return item.subjobno == subjobno && item.jobid == jobid && item.yearmonth <= curym;
    });
    let total_dwg = _.reduce(data, (sum, item) => {
        item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        return sum + item.lmn_dwg;
    }, 0);
    return total_dwg;
}

const p_estiprg = (subjobno, jobid, orders, orderitems, curym, p) => {
    
    //console.log(dayjs('202309'+'01').endOf('month'));

    let cd = dayjs(curym + '01').endOf('month');
    
    //let cd = dayjs('2023-05-01').endOf('month');
    let esti_prg = 0;
    let prg = 0;
    // get orders by jobid
    let raw = _.map(orders, o => { return { ...o } });
    let o = _.filter(raw, (item) => {
        return item.jobid == jobid && item.subjobno == subjobno;
    });
    //console.log(jobid, dayjs(cd).format('YYYY-MM-DD'));
    //if (subjobno == 3 || subjobno == 6) { console.log('o: ', o); }

    // estimateamount_all = sum(estimateamount) by jobid
    let estimateamount_all = _.reduce(o, (sum, item) => {
        //estimateamount formate: '000,000', FORMAT by MS SQL
        let result = parseInt(pv(item.estimateamount));
        item.estimateamount = result == 'NaN' ? 0 : result;
        return sum + item.estimateamount;
    }, 0);
    //if (subjobno == 3 || subjobno == 6) { console.log(`${subjobno}: ${estimateamount_all}`); }


    //console.log('estimateamount_all: ', estimateamount_all);
    //let percentages = _.map(o, (item) => {
    //    return (item.estimateamount / estimateamount_all) * 100;
    //});

    let sd1 = dayjs('1900-01-01');

    if (estimateamount_all > 0) {
        esti_prg = _.reduce(o, (sum, item) => {
            let it_esti_prg = 0;
            if (cd > dayjs(item.purchase_esti_issue_date) && item.purchase_esti_issue_date != null && dayjs(item.purchase_esti_issue_date) > sd1) {
                it_esti_prg = 50;
            }
            // 預定訂購
            if (cd > dayjs(item.c1_order_esti_date) && item.c1_order_esti_date != null && dayjs(item.c1_order_esti_date) > sd1) {
                it_esti_prg = 60;
            }
            // 預定交貨
            if (cd > dayjs(item.delivery_esti_date) && item.delivery_esti_date != null && dayjs(item.delivery_esti_date) > sd1) {
                it_esti_prg = 90;
            }
            // 預定驗收
            if (cd > dayjs(item.receivecheck_esti_date) && item.receivecheck_esti_date != null && dayjs(item.receivecheck_esti_date) > sd1) {
                it_esti_prg = 100;
            }

            //console.log(`${jobid} esti_prg: `, it_esti_prg * item.estimateamount / estimateamount_all);
            return sum + it_esti_prg * item.estimateamount / estimateamount_all;
        }, 0); 
    }
    //if (subjobno == 3 || subjobno == 6) {
    //    console.log(`${subjobno} ${jobid} esti_prg:`, esti_prg);
    //}

    return esti_prg.toFixed(p);

};

const p_actprg = (subjobno, jobid, orders, orderitems, curym, p) => {
    let cd = dayjs(curym + '01').endOf('month');
    //let cd = dayjs('2023-05-01').endOf('month');
    let act_prg = 0;
    let prg = 0;
    // get orders by jobid
    let raw1 = _.map(orders, o => { return { ...o } });
    let raw2 = _.map(orderitems, o => { return { ...o } });
    let o = _.filter(raw1, (item) => {
        return item.jobid == jobid && item.subjobno == subjobno;
    });
    //let oi = _.filter(raw2, (item) => {
    //    return item.jobid == jobid;
    //});

    //console.log(jobid, dayjs(cd).format('YYYY-MM-DD'));

    // estimateamount_all = sum(estimateamount) by jobid
    let estimateamount_all = _.reduce(o, (sum, item) => {
        //estimateamount formate: '000,000', FORMAT by MS SQL
        let result = parseInt(pv(item.estimateamount));
        item.estimateamount = result == 'NaN' ? 0 : result;
        return sum + item.estimateamount;
    }, 0);

    let sd1 = dayjs('1900-01-01');

    if (estimateamount_all > 0) {
        act_prg = _.reduce(o, (sum, item) => {
            let it_act_prg = 0;
            if (cd > dayjs(item.purchase_issue_date) && item.purchase_issue_date != null && dayjs(item.purchase_issue_date) > sd1) {
                it_act_prg = 50;
            }
            // 實際訂購
            if (cd > dayjs(item.c1_order_date) && item.c1_order_date != null && dayjs(item.c1_order_date) > sd1) {
                it_act_prg = 60;
            }
            // 實際交貨
            if (cd > dayjs(item.delivery_date) && item.delivery_date != null && dayjs(item.delivery_date) > sd1) {
                it_act_prg = 90;
            }
            // 實際驗收
            if (cd > dayjs(item.receivecheck_date) && item.receivecheck_date != null && dayjs(item.receivecheck_date) > sd1) {
                
                //it_act_prg = 90 + Math.round(item.receivecheckratio * 10) / 100;
                //console.log('it_act_prg: ', item.receivecheckratio);
                //_.reduce(oi, (sum, item) => {
                //    
                //}, 0);
                let oi = _.filter(raw2, (it) => {
                    
                    return it.serialno == item.item;
                });
                //console.log('oi: ', oi);

                let oiTotal = _.reduce(oi, (isum, it) => {
                    return isum + pv(it.esti_unit_price) * pv(it.estiexchangerate) * pv(it.quantity);
                }, 0);
                

                let receivecheck_prg = _.reduce(oi, (isum, it) => {
                    return isum + pv(it.receivecheckratio) * pv(it.esti_unit_price) * pv(it.estiexchangerate) * pv(it.quantity) / oiTotal;
                }, 0);
                
                //console.log('receivecheck_prg: ', receivecheck_prg);

                it_act_prg = 90 + Math.round(receivecheck_prg * 10) / 100;
            }

            //console.log(`${jobid} act_prg: `, it_act_prg * item.estimateamount / estimateamount_all);
            return sum + it_act_prg * item.estimateamount / estimateamount_all;
        }, 0);
    }

    return act_prg.toFixed(p);

};

const estiprg = (curym, subjobno, date1, date2, p) => {
    let d1 = dayjs(date1);
    let d2 = dayjs(date2);
    let cur = dayjs(curym + '01').endOf('month');
    let diff2 = d2.diff(d1, 'day');
    let diff1 = cur.diff(d1, 'day');
    let prg = (diff1 / diff2 * 100).toFixed(p);
    let esti_prg = 0;
    if (prg >= 100) {
        esti_prg = 100;
    } else if (prg <= 0) {
        esti_prg = 0;
    } else {
        esti_prg = prg;
    }
    return esti_prg;
};

const actprg = (curym, subjobno, jobid, es, mi, p) => {
    let data = _.filter(mi, (item) => {
        return item.jobid == jobid && item.subjobno == subjobno && item.yearmonth <= curym;
    });

    let total_dwg = _.reduce(data, (sum, item) => {
        //item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        item.lmn_dwg = typeof item.lmn_dwg != 'number' ? 0 : item.lmn_dwg;
        return sum + item.lmn_dwg;
    }, 0);

    let estiitem = _.filter(es, (item) => {
        return item.jobid == jobid && item.subjobno == subjobno;
    })[0];

    let last_act_prg = 0;
    if (data.length > 0) {
        last_act_prg = data[data.length - 1].act_prg;
    } else {
        last_act_prg = 0;
    }

    let act_prg = 0;
    let prg = estiitem.esti_dwg ? (total_dwg / estiitem.esti_dwg * 100).toFixed(p) : last_act_prg;

    if (isNaN(prg) || prg == '' || prg == null) {
        act_prg = 0;
    } else if (dayjs(estiitem.fin_date).isValid() && dayjs(estiitem.fin_date).isAfter(dayjs(estiitem.start_date))) {
        act_prg = 100;
    } else {
        if (prg >= 100) {
            act_prg = 100;
        } else if (prg <= 0) {
            act_prg = 0;
        } else {
            act_prg = prg;
        }
    }
    return act_prg;
};
*/
/*
const estiprg_byjt = (jt, es, smi, orders, p) => {
    let esti_prg = 0;
    if (jt == 'P') {
        let o = _.map(orders, o => { return { ...o } });
        let estimateamount_all = _.reduce(o, (sum, item) => {
            //estimateamount formate: '000,000', FORMAT by MS SQL
            //console.log('item.estimateamount: ', item.estimateamount);
            //console.log(`${item.subjobno} ${item.jobid}`, item.estimateamount);
            //console.log(item.estimateamount);
            let result = parseInt(pv(item.estimateamount));
            item.estimateamount = result == 'NaN' ? 0 : result;
            return sum + item.estimateamount;
        }, 0);
        //console.log('smi: ', smi);
        //console.log('byjt estimateamount_all:', estimateamount_all);
        //if (subjobno == 3 || subjobno == 6) { console.log(); }


        let pdata = _.filter(smi, (item) => {
            return item.jobid[0] == jt;
        });

        //console.log('pdata:', pdata);
        if (estimateamount_all > 0) {
            esti_prg = _.reduce(pdata, (sum, item) => {
                let subTotal = _.reduce(o, (s, it) => {
                    if (item.jobid == it.jobid && item.subjobno == it.subjobno) {
                        //console.log('it:', it);
                        return s + it.estimateamount;                    
                    } else {
                        return s;
                    }
                    //console.log(`${it.subjobno} ${it.jobid} ${it.estimateamount}`);
                    //return item.jobid == it.jobid;
                }, 0);
                //console.log(`esti, ${item.subjobno}, ${item.jobid}, `, subTotal);
                //return sum + item.esti_prg *
                return sum + item.esti_prg * subTotal / estimateamount_all; 
            }, 0);
        }

    } else {
        let data = _.filter(es, (item) => {
            return item.jobid[0] == jt;
        });
        //console.log('data: ', data);
        let sum_esti_mh = _.reduce(data, (sum, item) => {
            item.esti_mh = item.esti_mh == null ? 0 : item.esti_mh;
            return sum + item.esti_mh;
        }, 0);
        //console.log('sum_esti_mh: ', sum_esti_mh);
        //const percentages = _.map(arr, (num) => (num / sum) * 100);
        //各jobid依據預定工時esti_mh計算所佔百分比，return []
        let percentages = _.map(data, (item) => {
            return (item.esti_mh / sum_esti_mh) * 100;
        });
        //console.log('percentages: ', percentages);
        let sdata = _.filter(smi, (item) => {
            return item.jobid[0] == jt;
        });
        //const result = arr1.map((val, index) => val * arr2[index]);
        let temp = _.map(sdata, (item, i) => {
            //if (jt == 'I') {
            //    console.log(`${item.esti_prg} ${percentages[i]} ${item.esti_prg * percentages[i] / 100}`);
            //}
            return item.esti_prg * percentages[i] / 100;
        });
        //console.log('esti temp: ', temp);


        esti_prg = _.sum(temp);
        if (isNaN(esti_prg) || esti_prg == '' || esti_prg == null) { esti_prg = 0; }
    }

    return esti_prg.toFixed(p);
};

const actprg_byjt = (jt, es, smi, orders, p) => {

    let act_prg = 0;
    if (jt == 'P') {
        let o = _.map(orders, o => { return { ...o } });
        let estimateamount_all = _.reduce(o, (sum, item) => {
            //estimateamount formate: '000,000', FORMAT by MS SQL
            //console.log(item.estimateamount);
            let result = parseInt(pv(item.estimateamount));
            item.estimateamount = result == 'NaN' ? 0 : result;
            return sum + item.estimateamount;
        }, 0);
        
        let pdata = _.filter(smi, (item) => {
            return item.jobid[0] == jt;
        });

        if (estimateamount_all > 0) {
            act_prg = _.reduce(pdata, (sum, item) => {
                let subTotal = _.reduce(o, (s, it) => {
                    if (item.jobid == it.jobid && item.subjobno == it.subjobno) {
                        //console.log(it);
                        return s + it.estimateamount;                    
                    } else {
                        return s;
                    }
                    //return item.jobid == it.jobid;
                }, 0);
                //console.log(`act ${item.jobid}: `, subTotal);
                //return sum + item.esti_prg *
                return sum + item.act_prg * subTotal / estimateamount_all; 
            }, 0);            
        }

    } else {
        let data = _.filter(es, (item) => {
            return item.jobid[0] == jt;
        });
        let sum_esti_mh = _.reduce(data, (sum, item) => {
            item.esti_mh = item.esti_mh == null ? 0 : item.esti_mh;
            return sum + item.esti_mh;
        }, 0);
        //const percentages = _.map(arr, (num) => (num / sum) * 100);
        //各jobid依據esti_mh計算所佔百分比，return []
        let percentages = _.map(data, (item) => {
            return (item.esti_mh / sum_esti_mh) * 100;
        });
        let sdata = _.filter(smi, (item) => {
            return item.jobid[0] == jt;
        });
        let temp = _.map(sdata, (item, i) => {
            //if (jt == 'I') {
            //    console.log(`${item.subjobno} ${item.act_prg}`);
                //console.log(`${item.act_prg} ${percentages[i]} ${item.act_prg * percentages[i] / 100}`);
            //}
            return item.act_prg * percentages[i] / 100;
        });

        //console.log('act temp: ', temp);

        act_prg = _.sum(temp);
        if (isNaN(act_prg) || act_prg == '' || act_prg == null) { act_prg = 0; }

    }

    //console.log('act: ', jt, act_prg);

    return act_prg.toFixed(p);
};
*/
/*
const estiprg_prj = (data) => {
    return (_.sum(_.zipWith(data, (it) => it.ratio * parseFloat(it.estiprg))) / 100).toFixed(1);
};

const actprg_prj = (data) => {
    return (_.sum(_.zipWith(data, (it) => it.ratio * parseFloat(it.actprg))) / 100).toFixed(1);
};

const estiprg_all = (ptc, tcr, es, smi, orders, p) => {
    //console.log(selectYM.value);
    //console.log('smi: ', smi);
    //console.log();
    let raw = _.map(ptc, o => { return { ...o } });
    let rdata = _.filter(raw, (item) => {
        return item.count > 0;
    });
    let wt = tcr[0];
    //console.log('rdata: ', rdata);
    _.map(rdata, (item) => {
        switch (item.jobtype) {
            case 'I': item.ratio = wt.id_wt; break;
            case 'B': item.ratio = wt.bd_wt; break;
            case 'D': item.ratio = wt.dd_wt; break;
            case 'E': item.ratio = wt.dcs_wt; break;
            case 'F': item.ratio = wt.plc_wt; break;
            case 'C': item.ratio = wt.cnt_wt; break;
            case 'P': item.ratio = wt.buy_wt; break;
            case 'K': item.ratio = wt.con_wt; break;
            case 'T': item.ratio = wt.com_wt; break;
            case 'R': item.ratio = wt.rpt_wt; break;
        }
    });
    //console.log(rdata);
    let sum = 0.0;
    //let percentages = [];
    //let ratio = 0.0;
    _.forEach(rdata, (item, idx) => {
        sum = sum + estiprg_byjt(item.jobtype, es, smi, orders, 1) * item.ratio / 100;
    });
    //console.log(percentages);
    //console.log(sum);
    return sum.toFixed(p);
};

const actprg_all = (ptc, tcr, es, smi, orders, p) => {
    let raw = _.map(ptc, o => { return { ...o } });
    let rdata = _.filter(raw, (item) => {
        return item.count > 0;
    });
    let wt = tcr[0];
    //console.log('rdata: ', rdata);
    _.map(rdata, (item) => {
        switch (item.jobtype) {
            case 'I': item.ratio = wt.id_wt; break;
            case 'B': item.ratio = wt.bd_wt; break;
            case 'D': item.ratio = wt.dd_wt; break;
            case 'E': item.ratio = wt.dcs_wt; break;
            case 'F': item.ratio = wt.plc_wt; break;
            case 'C': item.ratio = wt.cnt_wt; break;
            case 'P': item.ratio = wt.buy_wt; break;
            case 'K': item.ratio = wt.con_wt; break;
            case 'T': item.ratio = wt.com_wt; break;
            case 'R': item.ratio = wt.rpt_wt; break;
        }
    });
    //console.log(rdata);
    let sum = 0.0;
    //let percentages = [];
    //let ratio = 0.0;
    _.forEach(rdata, (item, idx) => {
        sum = sum + actprg_byjt(item.jobtype, es, smi, orders, 1) * item.ratio / 100;
    });
    //console.log(percentages);
    //console.log(sum);
    return sum.toFixed(p);
};
*/
/*
const esti_sdate_byjt = (jt, es) => {
    let dates = [];
    _.map(es, (item) => {
        if (item.jobid[0] == jt) {
            dates.push(item.esti_start_date);
        }
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    if (dates.length == 0) {
        //console.log(`esti minDate = ''`);
        return '';
    } else {
        let minDate = dayjs(dates[0]);
        dates.forEach((date) => {
            const currentDate = dayjs(date);
            if (currentDate.isBefore(minDate)) {
                minDate = currentDate;
            }
        });
        //console.log(`esti minDate = ${minDate.format('YYYY-MM-DD')}`);
        return minDate.format('YYYY-MM-DD');
    }
};

const esti_fdate_byjt = (jt, es) => {
    let dates = [];
    _.map(es, (item) => {
        if (item.jobid[0] == jt) {
            dates.push(item.esti_fin_date);
        }
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    if (dates.length == 0) {
        //console.log(`esti maxDate = ''`);
        return '';
    } else {
        let maxDate = dayjs(dates[0]);
        dates.forEach((date) => {
            const currentDate = dayjs(date);
            if (currentDate.isAfter(maxDate)) {
                maxDate = currentDate;
            }
        });
        //console.log(`esti maxDate = ${maxDate.format('YYYY-MM-DD')}`);
        return maxDate.format('YYYY-MM-DD');
    }
};

const act_sdate_byjt = (jt, smi) => {
    let dates = [];
    _.map(smi, (item) => {
        if (item.jobid[0] == jt) {
            dates.push(item.start_date);
        }
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    if (dates.length == 0) {
        //console.log(`act minDate = ''`);
        return '';
    } else {
        let minDate = dayjs(dates[0]);
        dates.forEach((date) => {
            const currentDate = dayjs(date);
            if (currentDate.isBefore(minDate)) {
                minDate = currentDate;
            }
        });
        //console.log(`act minDate = ${minDate.format('YYYY-MM-DD')}`);
        return minDate.format('YYYY-MM-DD');
    }
};

const act_fdate_byjt = (jt, smi) => {
    let dates = [];
    _.map(smi, (item) => {
        if (item.jobid[0] == jt) {
            dates.push(item.fin_date);
        }
    });
    //fdates = _.map(dates, o => { return { ...o } });
    let fdates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    //所有項目完成日期不為'' || null填入最後完成日期'
    if (fdates.length != dates.length) {
        //console.log(`act maxDate = ''`);
        return '';
    } else {
        let maxDate = dayjs(dates[0]);
        dates.forEach((date) => {
            const currentDate = dayjs(date);
            if (currentDate.isAfter(maxDate)) {
                maxDate = currentDate;
            }
        });
        //console.log(`act maxDate = ${maxDate.format('YYYY-MM-DD')}`);
        return maxDate.format('YYYY-MM-DD');
    }
};

const estimh_byjt = (jt, es) => {
    let data = _.filter(es, (item) => {
        return item.jobid[0] == jt;
    });
    let total_estimh = _.reduce(data, function(sum, item) {
        //item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        item.esti_mh = typeof item.esti_mh != 'number' ? 0 : item.esti_mh;
        return sum + item.esti_mh;
    }, 0);
    return total_estimh;
};

const estidwg_byjt = (jt, es) => {
    let data = _.filter(es, (item) => {
        return item.jobid[0] == jt;
    });
    let total_estidwg = _.reduce(data, function(sum, item) {
        //item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        item.esti_dwg = typeof item.esti_dwg != 'number' ? 0 : item.esti_dwg;
        return sum + item.esti_dwg;
    }, 0);
    return total_estidwg;
};

const accumh_byjt = (curym, jt, mi) => {
    let data = _.filter(mi, (item) => {
        return item.jobid[0] == jt && item.yearmonth <= curym;
    });
    let total_mhjt = _.reduce(data, (sum, item) => {
        item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        return sum + item.lmn_mh;
    }, 0);
    return total_mhjt;
};

const accudwg_byjt = (curym, jt, mi) => {
    let data = _.filter(mi, (item) => {
        return item.jobid[0] == jt && item.yearmonth <= curym;
    });
    let total_dwgjt = _.reduce(data, (sum, item) => {
        item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        return sum + item.lmn_dwg;
    }, 0);
    return total_dwgjt;
};

const get_firstdate_bycol = (colname, oi) => {
    let dates = [];
    _.map(oi, (item) => {
        dates.push(item[colname]);
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    let sortedDates;
    if (dates.length == 0) {
        return '';
    } else {

        sortedDates = _.sortBy(dates, (date) => dayjs(date));
        //console.log(`esti minDate = ${minDate.format('YYYY-MM-DD')}`);
        return dayjs(sortedDates[0]).format('YYYY-MM-DD');
    }    
};

const get_lastdate_bycol = (colname, oi) => {
    let dates = [];
    _.map(oi, (item) => {
        dates.push(item[colname]);
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    let sortedDates;
    if (dates.length == 0) {
        return '';
    } else {

        sortedDates = _.sortBy(dates, (date) => dayjs(date));
        //console.log(`esti minDate = ${minDate.format('YYYY-MM-DD')}`);
        let lastDate = _.last(sortedDates);
        return dayjs(lastDate).format('YYYY-MM-DD');
    }    
};
*/
const getRowClassName = (row) => {
/*
    console.log(row);
    if (row.design_type === '自行設計') {
        return 'completed-row';
    } else if (row.design_type === '委外設計') {
        return 'pending-row';
    } else {
        return {};
    }
*/
    return 'completed-row';

};

const test = (item) => {
    console.log(item.jobtype);
};

</script>
<template>
    <div>
        <el-row>
            <el-col :span="24" class="fstart">
                <span>
                    <el-radio-group v-model="sSubjobno" class="ma8">
                        <el-radio-button v-for="item in m" :key="item.employeeno" :label="item.subjobno" :value="item.subjobno"
                            @change="OnMemberClick(item.jobno, item.subjobno)">
                            {{ item.name }}
                        </el-radio-button>

                        <el-radio-button key="all" label="all" value="all" @change="OnMemberClick(user.sJobno, 'all')">
                            全案     
                        </el-radio-button>

<!--
                        <el-radio-button key="all" label="all" @change="OnAllClick">
                            全案     
                        </el-radio-button>
-->
                    </el-radio-group>
                </span>
                <span>

                    <el-select v-model="sYM" class="value ma2" @change="OnYMChange">
                        <el-option v-for="item in YMOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>

                </span>
            <!--
                <span>
                    <el-button type="primary" class="value ma8" @click="orderreportExport(user.sJobno, sSubjobno)">匯出請購明細</el-button>
                </span>
            -->
                <span>
                    <!--
                    <el-button v-if="sSubjobno != 'all'" type="primary" class="value ma8" @click="printMonthWork(user.sJobno, sSubjobno)">工程月報</el-button>
                    -->
                    <el-button v-if="sSubjobno != 'all'" type="primary" class="value ma8" @click="showDialogMonthwork=true">工程月報</el-button>

                </span>
                <span>
                    <el-button v-if="sSubjobno == 'all'" type="primary" class="value ma8" @click="printMonthWorkTotal(user.sJobno, sSubjobno)">工程進度管制表</el-button>
                </span>
                <span>
                    <el-button v-if="sSubjobno == 'all'" type="primary" class="value ma8" @click="printProjectWork(user.sJobno)">專案報告</el-button>
                </span>

            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-tabs v-if="ptc" tab-position="left" v-model="sCategory" :class="['t-area']" @click="OnCategoryClick(sCategory)">
                    <el-tab-pane name="SUMMARY">
                        <template #label>
                            <span class="tabtext">
                                進度摘要
                            </span>
                        </template>
                        <el-row>
                        <!--
                            <div v-if="sSubjobno != 'all'" class="fs16 ma4">
                                預定總進度: {{ util.estiprg_all(ptc, tcr, es, smi, orders, 1) }} / 實際總進度: {{ util.actprg_all(ptc, tcr, es, smi, orders, 1) }}
                            </div>
                            <div v-if="sSubjobno == 'all'" class="fs16 ma4">
                                預定總進度: {{ util.estiprg_prj(summary) }} / 實際總進度: {{ util.actprg_prj(summary) }}
                            </div>
                        -->
                            <div v-if="sSubjobno != 'all'" class="fs16 ma4">
                                預定總進度: {{ estiprgall }} / 實際總進度: {{ actprgall }}
                            </div>
                            <div v-if="sSubjobno == 'all'" class="fs16 ma4">
                                預定總進度: {{ estiprgprj }} / 實際總進度: {{ actprgprj }}
                            </div>                                                 
                        </el-row>
                        <el-row>
                                     
                            <el-table :data="summary" style="width: 100%" 
                                class="fs16 ma4" 
                                :row-style="getRowClassName"
                                show-summary
                                highlight-current-row
                                :summary-method="showSummary"
                            >
                                <el-table-column fixed label="項目" prop="category" width="100" header-align="center" align="center" />

                                <el-table-column label="預定" width="240" header-align="center" align="center">
                                    <el-table-column prop="esti_sdate" label="開始日期" width="120" header-align="center" align="center" />
                                    <el-table-column prop="esti_fdate" label="結束日期" width="120" header-align="center" align="center" />
                                </el-table-column>
                                <el-table-column label="實際" width="240" header-align="center" align="center">
                                    <el-table-column prop="act_sdate" label="開始日期" width="120" header-align="center" align="center" />
                                    <el-table-column prop="act_fdate" label="結束日期" width="120" header-align="center" align="center" />
                                </el-table-column>
                                <el-table-column label="圖數" width="210" header-align="center" align="center">
                                    <el-table-column prop="curym_accudwg" label="當月" width="70" header-align="center" align="right" />
                                    <el-table-column prop="estidwg" label="預定" width="70" header-align="center" align="right" />
                                    <el-table-column prop="accudwg" label="累計" width="70" header-align="center" align="right" />
                                </el-table-column>
                                <el-table-column label="工時(MH)" width="210" header-align="center" align="center">
                                    <el-table-column prop="curym_accumh" label="當月" width="70" header-align="center" align="right" />
                                    <el-table-column prop="estimh" label="預定" width="70" header-align="center" align="right" />
                                    <el-table-column prop="accumh" label="累計" width="70" header-align="center" align="right" />
                                </el-table-column>
                                <el-table-column label="比重(%)" prop="ratio"  width="70" header-align="center" align="right" />
                                <el-table-column label="進度(%)" width="160" header-align="center" align="center" >
                                    <el-table-column prop="estiprg" label="預定" width="80" header-align="center" align="right" />
                                    <el-table-column prop="actprg" label="實際" width="80" header-align="center" align="right" />
                                </el-table-column>

                            </el-table>

                        </el-row>
                        <br/>
                        <el-row>
                            <el-col :span="6">
                                <el-card :class="['ma4', 'shadow']">
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">應請購金額:</span>
                                        <span calss="fend ma2">{{util.fv(pData.purchaseesti)}}</span>
                                    </div>
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">已請購金額:</span>
                                        <span calss="fend ma2">{{util.fv(pData.purchase)}}</span>
                                    </div>
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">已請購比例:</span>
                                        <span calss="fend ma2">{{util.getPercentage(pData.purchase, pData.purchaseesti, 1)}}</span>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="6">
                                <el-card :class="['ma4', 'shadow']">
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">應訂購金額:</span>
                                        <span calss="fend ma2">{{util.fv(pData.orderesti)}}</span>
                                    </div>
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">已訂購金額:</span>
                                        <span calss="fend ma2">{{util.fv(pData.order)}}</span>
                                    </div>
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">已訂購比例:</span>
                                        <span calss="fend ma2">{{util.getPercentage(pData.order, pData.orderesti, 1)}}</span>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="6">
                                <el-card :class="['ma4', 'shadow']">
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">應交貨金額:</span>
                                        <span calss="fend ma2">{{util.fv(pData.deliveryesti)}}</span>
                                    </div>
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">已交貨金額:</span>
                                        <span calss="fend ma2">{{util.fv(pData.delivery)}}</span>
                                    </div>
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">已交貨比例:</span>
                                        <span calss="fend ma2">{{util.getPercentage(pData.delivery, pData.deliveryesti, 1)}}</span>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="6">
                                <el-card :class="['ma4', 'shadow']">
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">應驗收金額:</span>
                                        <span calss="fend ma2">{{util.fv(pData.receivecheckesti)}}</span>
                                    </div>
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">已驗收金額:</span>
                                        <span calss="fend ma2">{{util.fv(pData.receivecheck)}}</span>
                                    </div>
                                    <div class="d-flex ma2">
                                        <span calss="fstart ma2">已驗收比例:</span>
                                        <span calss="fend ma2">{{util.getPercentage(pData.receivecheck, pData.receivecheckesti, 1)}}</span>
                                    </div>
                                </el-card>
                            </el-col>

                        </el-row>
                    </el-tab-pane>
                   
                    <template v-if="sSubjobno == 'all'">
                        <el-tab-pane name="ISODESCRIPTION">
                            <template #label>
                                <span class="tabtext">
                                    進度管制說明
                                </span>
                            </template>
                            <el-row class="report">

                                <el-col :span="12" class="fstart">
                                    <span class="fs16 ma4">
                                        <div>
                                            進度管制說明:
                                        </div>    
                                    </span>
                                </el-col>
                                <el-col :span="12" class="fend">
                                    <span class="ma4">
                                        <el-button type="primary" class="ma2" @click="saveMptotal(user.sJobno)">
                                            儲存
                                        </el-button>
                                    </span>

                                </el-col>

                            </el-row>
                            <el-row>
                                <div class="fstart fs16 ma4" style="width: 100%;">
                                    <el-input v-model="mptotal.isoprogressdescription" :rows="12" type="textarea" :class="['report', 'custom-textarea']" style="font-size: 18px;"/>
                                </div>                                
                            </el-row>


                        </el-tab-pane>

                        <el-tab-pane name="PROJECT">
                            <template #label>
                                <span class="tabtext">
                                    專案進行情形
                                </span>
                            </template>
                            <el-row class="report">
                                <el-col :span="12" class="fstart">
                                    <span class="fs16 ma4">
                                        <div>
                                            專案進行情形:
                                        </div>    
                                    </span>
                                </el-col>
                                <el-col :span="12" class="fend">
                                    <span class="ma4">
                                        <el-button type="primary" class="ma2" @click="saveMptotal(user.sJobno)">
                                            儲存
                                        </el-button>
                                    </span>

                                </el-col>

                                </el-row>
                                <el-row>
                                <div class="fstart fs16 ma4" style="width: 100%;">
                                    <el-input v-model="mptotal.worksummaried" :rows="12" type="textarea" :class="['report', 'custom-textarea']" style="font-size: 18px;"/>
                                </div>                                
                                </el-row>                            
                        </el-tab-pane>
                    </template>

                    <template v-if="sSubjobno != 'all'">
                      
                        <template v-for="item in  ptc " :key="item.jobtype">
                            <el-tab-pane v-if="item.count > 0" :name="item.jobtype">
                                <template #label>
                                    <span class="tabtext">
                                        <el-badge :value="item.count" />
                                        {{ item.category }}
                                    </span>
                                </template>

                                <el-row>
                                    <div class="fstart fs16 ma4" style="width: 100%;">
                                        <span class="ma4">
                                            預定進度: {{ util.estiprg_byjt(sCategory, es, smi, orders, 1) }} / 實際進度: {{ util.actprg_byjt(sCategory, es, smi, orders, 1) }}
                                        </span>
                                        <span class="ma4"></span>
                                        <span v-if="item.jobtype == 'P'" class="ma4">
                                            <el-button type="primary" @click="getOrders(user.sJobno, sSubjobno);getOrderItems(user.sJobno, sSubjobno); updateOrdersDlg = true;">請購管理</el-button>
                                        </span>
                                    </div>
                                </el-row>

                                <el-row>
                                    <template v-for="it in smi " :key="item.jobid">
                                        <el-card v-if="it.jobid[0] == sCategory" :class="['card', 'ma8', 'shadow']"
                                            :body-style="{ padding: '8px' }" shadow="never"
                                            :style="{ 'background-color': `${getDTColor(it.design_type)}` }"
                                            @click="OnMonthItemDlgClick(it); updateMonthItemDlg = true;">
                                            <div class="fbetween ma4">
                                                <span class="card-header">{{ it.jobid }}</span>
                                                <span>
                                                    <div class="fs14 fbetween">
                                                        <span>預定進度: </span>
                                                        <span>{{ util.rNum(it.esti_prg) }}%</span>
                                                    </div>
                                                    <div class="fs14 fbetween">
                                                        <span>實際進度: </span>
                                                        <span>{{ util.rNum(it.act_prg) }}%</span>
                                                    </div>
                                                </span>
                                            </div>
                                            <div class="card-content ma4">{{ it.content }}</div>
                                            <div class="card-footer">
                                                <div class="fs14 ma2">
                                                    預定:{{ it.esti_start_date }} ~ {{ it.esti_fin_date }}
                                                </div>
                                                <div class="fs14 ma2">
                                                    實際:{{ it.start_date }} ~ {{ it.fin_date }}
                                                </div>
                                                <!--
                                                <div class="fs14 ma4">
                                                    本月圖數:{{ item.lmn_dwg }} 本月工時:{{ item.lmn_mh }}
                                                </div>
                                                <div class="fs14 ma4">
                                                    累計圖數:{{ item.accu_dwg }} 累計工時:{{ item.accu_mh }}
                                                </div>
                                                -->

                                                <div class="d-flex fs14">
                                                    <span class="card-item fs14 ma2">本月圖數: {{ it.lmn_dwg }}</span>
                                                    <span class="card-item fs14 ma2">累計圖數: {{ it.accu_dwg }}</span>
                                                </div>
                                                <div class="d-flex">
                                                    <span class="card-item fs14 ma2">本月工時: {{ it.lmn_mh }}</span>
                                                    <span class="card-item fs14 ma2">累計工時: {{ it.accu_mh }}</span>
                                                </div>

                                            </div>
                                        </el-card>

                                    </template>
                                </el-row>


                            </el-tab-pane>
                        </template>

                    </template>
                </el-tabs>
            </el-col>
        </el-row>

        <!--print Monthwork Dialog-->
        <el-dialog v-model="showDialogMonthwork" title="列印工程月報" width="30%">
            <span class="fs16">
                <el-checkbox v-model="checkContent" label="主要工程內容" size="large" />
            </span>
            <template #footer>
                <span>
                    <el-button @click="showDialogMonthwork = false">取消</el-button>
                    <el-button type="primary" @click="printMonthWork(user.sJobno, sSubjobno);showDialogMonthwork = false;">
                        確定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!--update MonthItem Dialog-->
        <el-dialog v-model=" updateMonthItemDlg " width="520">
            <div class="card-header fstart">
                <span>
                    <div>{{ updatemi.jobid }}</div>
                    <div>{{ updatemi.content }}</div>
                </span>
            </div>
            <hr />

            <el-row>
                <el-col :span=" 8 ">
                    <div class="item-align ma4">
                        <span class="label ma2">本月圖數</span>
                        <span class="value ma2">
                            <el-input v-model.number=" updatemi.lmn_dwg " />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label ma2">本月工時</span>
                        <span class="value ma2">
                            <el-input v-model.number=" updatemi.lmn_mh " />
                        </span>
                    </div>

                </el-col>
                <el-col :span=" 8 ">
                    <div class="item-align ma4">
                        <span class="label ma2">累計圖數</span>
                        <span class="value ma2">
                            <el-input v-model.number=" updatemi.accu_dwg " />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label ma2">累計工時</span>
                        <span class="value ma2">
                            <el-input v-model.number=" updatemi.accu_mh " />
                        </span>
                    </div>
                </el-col>
                <el-col :span=" 8 ">
                    <div class="item-align ma4">
                        <span class="label ma2">預定圖數</span>
                        <span class="value ma2">
                            <el-input v-model.number=" updatemi.esti_dwg " />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label ma2">預定工時</span>
                        <span class="value ma2">
                            <el-input v-model.number=" updatemi.esti_mh " />
                        </span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span=" 12 ">
                    <div class="item-align ma4">
                        <span class="label ma2">實際開始日期</span>
                        <span class="value ma2">
                            <el-date-picker v-model=" updatemi.start_date " type="date" :clearable=" false " format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" style="width: 120px" />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label ma2">實際完成日期</span>
                        <span class="value ma2">
                            <el-date-picker v-model=" updatemi.fin_date " type="date" :clearable=" false " format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" style="width: 120px" />
                        </span>
                    </div>
                    <div class="item-align ma4" v-if="updatemi.esti_dwg < 1 && updatemi.jobid[0] != 'P' ? true : false" >
                        <span class="label ma2">實際進度</span>
                        <span class="value ma2">
                            <el-input v-model.number=" updatemi.act_prg " />
                        </span>
                    </div>

                </el-col>
                <el-col :span=" 12 ">
                    <div class="item-align ma4">
                        <span class="label ma2">預定開始日期</span>
                        <span class="value ma2">
                            <el-date-picker v-model=" updatemi.esti_start_date " type="date" :clearable=" false "
                                format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 120px" />
                        </span>
                    </div>
                    <div class="item-align ma4">
                        <span class="label ma2">預定完成日期</span>
                        <span class="value ma2">
                            <el-date-picker v-model=" updatemi.esti_fin_date " type="date" :clearable=" false "
                                format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 120px" />
                        </span>
                    </div>
                    <div class="item-align ma4" v-if="updatemi.esti_dwg < 1 && updatemi.jobid[0] != 'P' ? true : false" >
                        <span class="label ma2">預定進度</span>
                        <span class="value ma2">
                            <el-input disabled v-model.number=" updatemi.esti_prg " />
                        </span>
                    </div>                    
                </el-col>
            </el-row>
            <template #footer>
                <el-button type="primary" class="ma2" @click=" updateMonthItem(updatemi); updateMonthItemDlg = false;">
                    更新
                </el-button>
                <el-button type="primary" class="ma2" @click=" updateMonthItemDlg = false; ">
                    取消
                </el-button>
            </template>
        </el-dialog>
        
        <!--update Orders & Orderitems Dialog-->
        <el-dialog v-model=" updateOrdersDlg " fullscreen>
            <template>
                <!--create new Orders-->     
                <el-dialog v-model="addOrdersDlg" width="70%" title="新增購案" append-to-body>
                    <el-row>
                        <el-col :span="8">
                            <div class="item-align ma4">
                                <span class="label-m ma2">請購項目名稱</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworder.content" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">訂單/合約編號</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworder.orderno" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">預定請購日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworder.purchase_esti_issue_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">預定訂購日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworder.c1_order_esti_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">預定交貨日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworder.delivery_esti_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">預定驗收日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworder.receivecheck_esti_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                                </span>
                            </div>           
                            <div class="item-align ma4">
                                <span class="label-m ma2">預估總價</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworder.estimateamount" class="right-aligned" :formatter="fv" :parser="pv" />
                                </span>
                            </div>
 
                        </el-col>
                        <el-col :span="8">
                            <div class="item-align ma4">
                                <span class="label-m ma2">類別</span>
                                <span class="value-m ma2">
                                    <el-select v-model="neworder.category">
                                        <el-option v-for="item in ctype" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">請購序號</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworder.y6tserialno" placeholder="序號自動產生" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">實際請購日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworder.purchase_issue_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">實際訂購日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworder.c1_order_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">實際交貨日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworder.delivery_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">實際驗收日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworder.receivecheck_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                                </span>
                            </div>                            
                            <div class="item-align ma4">
                                <span class="label-m ma2">實際總價</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworder.amount" class="right-aligned" :formatter="fv" :parser="pv" />
                                </span>
                            </div>

                        </el-col>
                        <el-col :span="8">
                            <div class="item-align ma4">
                                <span class="label-m ma2">請購類型</span>
                                <span class="value-m ma2">
                                    <el-select v-model="neworder.jobid">
                                        <el-option v-for="item in ptask" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">C1/Y61承辦日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworder.c1_issue_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 140px" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">承辦人</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworder.c1_member" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">外包</span>
                                <span class="value-m ma2">
                                    <el-checkbox v-model="neworder.isturnkey" label="" />
                                </span>
                            </div>
                        </el-col>

                    </el-row>
                    <hr />
                    <el-row>
                        <el-button type="primary" class="ma2" @click=" addOrders(user.sJobno, sSubjobno);addOrdersDlg = false; ">
                            確定
                        </el-button>
                        <el-button type="primary" class="ma2" @click=" addOrdersDlg = false; ">
                            取消
                        </el-button>
                    </el-row>

                </el-dialog>
                <!--create new Orderitems-->
                <el-dialog v-model="addOrderitemsDlg" width="70%" title="新增購案細項" append-to-body>
                    <el-row>
                        <el-col :span="8">
                            <div class="item-align ma4">
                                <span class="label-m ma2">物品名稱/規範</span>
                                <span class="value-l ma2">
                                    <el-input type="textarea" v-model="neworderitem.name" />
                                </span>
                            </div>   
                        </el-col>
                        <el-col :span="8">
                            <div class="item-align ma4">
                                <span class="label-m ma2">單位</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.unit" />
                                </span>
                            </div>                        
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div class="item-align ma4">
                                <span class="label-m ma2">預估匯率</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.estiexchangerate" class="right-aligned" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">預估單價</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.esti_unit_price" class="right-aligned" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">預定交貨日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworderitem.delivery_esti_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">預定驗收日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworderitem.receivecheck_esti_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">物料編號</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.materialcode" />
                                </span>
                            </div>

                        </el-col>
                        <el-col :span="8">
                            <div class="item-align ma4">
                                <span class="label-m ma2">匯率</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.exchangerate" class="right-aligned" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">單價</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.unit_price" class="right-aligned" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">實際交貨日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworderitem.delivery_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%" />
                                </span>
                            </div>                            
                            <div class="item-align ma4">
                                <span class="label-m ma2">實際驗收日期</span>
                                <span class="value-m ma2">
                                    <el-date-picker v-model="neworderitem.receivecheck_date" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">規範編號</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.specification_code" />
                                </span>
                            </div>

                        </el-col>

                        <el-col :span="8">
                            <div class="item-align ma4">
                                <span class="label-m ma2">幣別</span>
                                <span class="value-m ma2">
                                    <el-select v-model="neworderitem.currency">
                                        <el-option v-for="item in currencytype" :key="item.value" :label="item.label" :value="item.value" />
                                    </el-select>
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">數量</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.quantity" class="right-aligned" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">品質</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.quality" />
                                </span>
                            </div>                            
                            <div class="item-align ma4">
                                <span class="label-m ma2">驗收比率</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.receivecheckratio" class="right-aligned" />
                                </span>
                            </div>
                            <div class="item-align ma4">
                                <span class="label-m ma2">廠商統編</span>
                                <span class="value-m ma2">
                                    <el-input v-model="neworderitem.supplierid" />
                                </span>
                            </div>

                        </el-col>
                    </el-row>
                    <hr />
                    <el-row>
                        <el-button type="primary" class="ma2" @click=" addOrderitems();addOrderitemsDlg = false; ">
                            確定
                        </el-button>
                        <el-button type="primary" class="ma2" @click=" addOrderitemsDlg = false; ">
                            取消
                        </el-button>
                    </el-row>                    
                </el-dialog>
            </template>


            <div class="card-header fbetween">
                <span>
                    {{ b.jobno }} {{ b.jobname }}
                </span>
            </div>

            <div class="card-header fbetween">
                <span>
                    <div>請購案</div>                       
                </span>
                <span>
                    <el-button type="primary" class="ma2" @click=" updateOrdersDlg = false; getMonthItem(user.sJobno, sSubjobno);">
                        關閉
                    </el-button>
                </span>
            </div>
            <hr />
          
            <el-row>
                <el-col :span=" 24 ">
                    <el-table :data="orders" ref="ordersTableRef" show-summary :summary-method="getOrdersSummary" border height="280" style="width: 100%" class="fs14 ma2" :row-style="getRowClassName" @row-click="ordersClick" highlight-current-row @selection-change="handleSelectionOrders" @current-change="handleOrdersChange" >
                    <!--
                    <el-table :data="orders" ref="ordersTableRef" border height="280" style="width: 100%" class="fs14 ma2" :row-style="getRowClassName" @row-click="ordersClick" highlight-current-row @selection-change="handleSelectionOrders" @current-change="handleOrdersChange" >
                    -->
                        <el-table-column fixed type="selection" width="40" header-align="center" align="center" />
                        <el-table-column fixed label="項次" prop="item" width="55" header-align="center" align="center" />
                        <el-table-column fixed label="名稱" prop="content" width="160" header-align="center" align="left">
                            <template #default="{ row }">
                                <el-input v-model="row.content" size="small" />
                            </template>
                        </el-table-column>    
                        <el-table-column label="類別" prop="category" width="110" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-select v-model="row.category" size="small">
                                    <el-option v-for="item in ctype" :key="item.value" :label="item.label" :value="item.value" />
                                </el-select>
                            </template>
                        </el-table-column>    
                        <el-table-column label="訂單/合約編號" prop="orderno" width="120" header-align="center" align="left">
                            <template #default="{ row }">
                                <el-input v-model="row.orderno" size="small" />
                            </template>                           
                        </el-table-column>
                        <el-table-column label="請購序號" prop="y6tserialno" width="100" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-input v-model="row.y6tserialno" size="small" disabled />
                            </template>                                                   
                        </el-table-column>

                        <el-table-column label="請購日期" width="250" header-align="center" align="center">
                            <el-table-column prop="purchase_esti_issue_date" label="預定" width="125" header-align="center" align="center">
                                <template #default="{ row }">
                                    <el-date-picker v-model="row.purchase_esti_issue_date" size="small" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100px" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="purchase_issue_date" label="實際" width="125" header-align="center" align="center">
                                <template #default="{ row }">
                                    <el-date-picker v-model="row.purchase_issue_date" size="small" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100px" />
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="訂購日期" width="250" header-align="center" align="center">
                            <el-table-column prop="c1_order_esti_date" label="預定" width="125" header-align="center" align="center">
                                <template #default="{ row }">
                                    <el-date-picker v-model="row.c1_order_esti_date" size="small" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100px" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="c1_order_date" label="實際" width="125" header-align="center" align="center">
                                <template #default="{ row }">
                                    <el-date-picker v-model="row.c1_order_date" size="small" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100px" />
                                </template>
                            </el-table-column>
                        </el-table-column>

                        <el-table-column label="C1/Y61承辦日期" prop="c1_issue_date" width="135" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-date-picker v-model="row.c1_issue_date" size="small" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100px" />
                            </template>                        
                        </el-table-column>    
                        <el-table-column label="承辦人" prop="c1_member" width="90" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-input v-model="row.c1_member" size="small" />
                            </template>                        
                        </el-table-column>
                        <el-table-column label="請購類型" prop="jobid" width="120" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-select v-model="row.jobid" size="small">
                                    <el-option v-for="item in ptask" :key="item.value" :label="item.label" :value="item.value" />
                                </el-select>
                            </template>                                                 
                        </el-table-column>
                        <el-table-column label="外包" prop="isturnkey" width="55" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-checkbox v-model="row.isturnkey" label="" size="small" />
                            </template>                                                 
                        </el-table-column>
                        <el-table-column label="預估總價" prop="estimateamount" width="110" header-align="center" align="right">
                            <template #default="{ row }">
                                <el-input v-model="row.estimateamount" size="small" class="right-aligned" :formatter="fv" :parser="pv" />
                            </template>
                        </el-table-column>                        
                        
                        <el-table-column label="實際總價" prop="amount" width="110" header-align="center" align="right">
                            <template #default="{ row }">
                                <el-input v-model="row.amount" size="small" class="right-aligned" :formatter="fv" :parser="pv" />
                            </template>
                        </el-table-column>
                        
                    </el-table>

                </el-col>

            </el-row>
            <el-row class="fend">
                <el-button type="success" class="ma2" @click=" addOrdersDlg = true; ">
                    <i :class="['mdi', 'mdi-18px', 'mdi-plus']" />
                    新增
                </el-button>                
                <el-button type="primary" class="ma2" @click=" updateOrders(); ">
                    <i :class="['mdi', 'mdi-18px', 'mdi-pencil']" />
                    更新
                </el-button>
                <el-button type="danger" class="ma2" @click=" removeOrders(); ">
                    <i :class="['mdi', 'mdi-18px', 'mdi-minus']" />
                    刪除
                </el-button>
            </el-row>
            
            <div class="card-header fbetween">
                <span>
                    <div>請購細項</div>                       
                </span>
            </div>
            <hr />
            <el-row>
                <el-col :span="24">
                    <el-table v-if="sorderitems" :data="sorderitems" height="360" show-summary :summary-method="getOrderItemsSummary" border  style="width: 100%" class="fs14 ma2" highlight-current-row @selection-change="handleSelectionOrderitems"> 
                        <el-table-column fixed type="selection" width="40" header-align="center" align="center" />
                        <el-table-column fixed label="項次" prop="item" width="60" header-align="center" align="center" />
                        <el-table-column fixed label="物品名稱/規範" prop="name" width="300" header-align="center" align="left">
                            <template #default="{ row }">
                                <el-input type="textarea" size="small" v-model="row.name" :rows="2" style="width: 100%" />
                            </template>
                        </el-table-column>                
                        <el-table-column label="單位" prop="unit" width="70" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-input v-model="row.unit" size="small" />
                            </template>
                        </el-table-column>
                        <el-table-column label="幣別" prop="currency" width="80" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-select v-model="row.currency" size="small">
                                    <el-option v-for="item in currencytype" :key="item.value" :label="item.label" :value="item.value" size="small" />
                                </el-select>                                
                            </template>
                        </el-table-column>
                        <el-table-column label="匯率" width="120" header-align="center" align="center">
                            <el-table-column label="預估" prop="estiexchangerate" width="70" header-align="center" align="center">
                                <template #default="{ row }">
                                    <el-input v-model="row.estiexchangerate" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column label="實際" prop="exchangerate" width="70" header-align="center" align="center">
                                <template #default="{ row }">
                                    <el-input v-model="row.exchangerate" size="small" />
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="單價" width="210" header-align="center" align="center">
                            <el-table-column label="預估" prop="esti_unit_price" width="105" header-align="center" align="right">
                                <template #default="{ row }">
                                    <el-input v-model="row.esti_unit_price" size="small" class="right-aligned" :formatter="fv" :parser="pv" />
                                </template>
                            </el-table-column>
                            <el-table-column label="實際" prop="unit_price" width="105" header-align="center" align="right">
                                <template #default="{ row }">
                                    <el-input v-model="row.unit_price" size="small" class="right-aligned" :formatter="fv" :parser="pv" />
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="數量" prop="quantity" width="70" header-align="center" align="right">
                            <template #default="{ row }">
                                <el-input v-model="row.quantity" size="small" class="right-aligned" />
                            </template>
                        </el-table-column>
                        <el-table-column label="交貨日期" width="250" header-align="center" align="center">
                            <el-table-column prop="delivery_esti_date" label="預定" width="125" header-align="center" align="center">
                                <template #default="{ row }">
                                    <el-date-picker v-model="row.delivery_esti_date" size="small" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100px" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="delivery_date" label="實際" width="125" header-align="center" align="center">
                                <template #default="{ row }">
                                    <el-date-picker v-model="row.delivery_date" size="small" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100px" />
                                </template>                            
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="驗收日期" width="250" header-align="center" align="center">
                            <el-table-column prop="receivecheck_esti_date" label="預定" width="125" header-align="center" align="center">
                                <template #default="{ row }">
                                    <el-date-picker v-model="row.receivecheck_esti_date" size="small" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100px" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="receivecheck_date" label="實際" width="125" header-align="center" align="center">
                                <template #default="{ row }">
                                    <el-date-picker v-model="row.receivecheck_date" size="small" type="date" :clearable="false" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100px" />
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="驗收比率" prop="receivecheckratio" width="60" header-align="center" align="right">
                            <template #default="{ row }">
                                <el-input v-model="row.receivecheckratio" class="right-aligned" size="small" />
                            </template>
                        </el-table-column>
                        <el-table-column label="物料編號" prop="materialcode" width="110" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-input v-model="row.materialcode" size="small" />
                            </template>
                        </el-table-column>
                      
                        <el-table-column label="規範編號" prop="specification_code" width="100" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-input v-model="row.specification_code" size="small" />
                            </template>
                        </el-table-column>
                    
                        <el-table-column label="廠商名稱" prop="name_q" width="100" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-tooltip
                                    placement="top"
                                    effect="light"
                                    :content="row.supplierid"
                                >
                                    <el-input v-model="row.name_q" size="small" />
                                </el-tooltip>
                                
                            </template>
                        </el-table-column>
                        
                        <el-table-column label="訂單編號" prop="orderno" width="120" header-align="center" align="center">
                            <template #default="{ row }">
                                <el-input v-model="row.orderno" size="small" />
                            </template>
                        </el-table-column>

                        <el-table-column label="品質" prop="quality" width="60" header-align="center" align="right">
                            <template #default="{ row }">
                                <el-input v-model="row.quality" size="small" />
                            </template>
                        </el-table-column>
                        
                    </el-table>
                </el-col>
            </el-row>
            <el-row class="fend">
                <el-button type="success" class="ma2" @click=" addOrderitemsDlg = true; ">
                    <i :class="['mdi', 'mdi-18px', 'mdi-plus']" />
                    新增
                </el-button>                
                <el-button type="primary" class="ma2" @click=" updateOrderitems(); ">
                    <i :class="['mdi', 'mdi-18px', 'mdi-pencil']" />
                    更新
                </el-button>
                <el-button type="danger" class="ma2" @click=" removeOrderitems(); ">
                    <i :class="['mdi', 'mdi-18px', 'mdi-minus']" />
                    刪除
                </el-button>                
            </el-row>

            <template #footer>

            </template>
        </el-dialog>

    </div>
</template>
<style scoped>
.ma2 {
    margin: 2px;
}

.ma4 {
    margin: 4px;
}

.ma8 {
    margin: 8px;
}

.tabtext {
    font-size: 18px;
    font-weight: bold;
}

.fs14 {
    font-size: 14px;
}

.fs16 {
    font-size: 16px;
}

.fs18 {
    font-size: 18px;
}

.fs20 {
    font-size: 20px;
}

.t-area {
    font-size: 16px;
}

.d-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card {
    cursor: pointer;
    width: 240px;
    height: 220px;
}

.card-header {
    font-size: 18px;
    font-weight: bold;
}

.card-content {
    font-size: 14px;
    color: mediumblue;
    font-weight: bold;
    height: 60px;
}

.card-item {
    width: 110px;
}

/*
.card-footer {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    align-items: center;
}
*/
.card-footer {
    font-size: 12px;
    justify-content: space-between;
    align-items: center;
}

.report {
    width: 780px;
}

.custom-textarea :deep() .el-textarea__inner {
    font-size: 16px;
}

.shadow {
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
}

.shadow:hover {
    box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.5);
}

.fstart {
    display: flex;
    align-items: center;
    justify-content: start;
}

.fend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.fbetween {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.item-align {
    display: flex;
    align-items: center;
    justify-content: start;
}

.label {
    width: 100px;
}

.value {
    width: 120px;
}

.label-m {
    width: 120px;
}

.value-m {
    width: 140px;
}

.label-l {
    width: 140px;
}

.value-l {
    width: 180px;
}
.completed-row {
    background-color: #aaffaa;
}
.pending-row {
    background-color: #ffaaaa;
}

/*
.el-input :deep() .el-input__inner {
    text-align: end;
}
*/
.el-input, .right-aligned :deep() .el-input__inner  {
    text-align: end;
}


</style>
