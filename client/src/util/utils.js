/*
* Utility functions
*/

import * as dayjs from 'dayjs';

// 使用 sessionStorage 讓各分頁的登入身分與選擇狀態互相獨立
export const saveObj = (itemname, value) => {
    sessionStorage.setItem(itemname, JSON.stringify(value));
}

export const loadObj = (itemname) => {
    return JSON.parse(sessionStorage.getItem(itemname));
}

export const delObj = (itemname) => {
    sessionStorage.removeItem(itemname);
}

export const clearAll = () => {
    sessionStorage.clear();
}

export const trimObj = (obj) => {
    if (obj === null && !Array.isArray(obj) && typeof obj != 'object') return obj;
    return Object.keys(obj).reduce(function (acc, key) {
        acc[key.trim()] = typeof obj[key] === 'string' ?
            obj[key].trim() : typeof obj[key] === 'object' ? trimObj(obj[key]) : obj[key];
        return acc;
    }, Array.isArray(obj) ? [] : {});
}

export const trimJSON = (obj) => {
    return JSON.parse(JSON.stringify(obj).replace(/(\\)?"\s*|\s+"/g, ($0, $1) => $1 ? $0 : '"'));
    //return JSON.parse(JSON.stringify(obj).replace(/"\s+|\s+"/g, '"'));
}

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const isSameJobid = (a, b) => a.jobid === b.jobid;

export const onlyInLeft = (left, right, compareFunction) => left.filter(leftValue => !right.some(rightValue => compareFunction(leftValue, rightValue)));

export const deepCopy = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(deepCopy);
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (let key in obj) {
            newObj[key] = deepCopy(obj[key]);
        }
        return newObj;
    } else {
        return obj;
    }
};

export const fv = (value) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const pv = (value) => {
    if (typeof value === 'number') {
        return value;
    } else if (typeof value === 'string') {
        return value.replace(/\$\s?|(,*)/g, '');
    } else {
        return 0;
    }
};

export const rNum = (num) => {
    return Math.round(num * 10) / 10;
};

export const StrToInt = (str) => {
    return parseInt(Math.round(parseFloat(str)));
};

export const isEmpty = (value) => {
    // check value is undefined , null or {}
    if ((typeof value === 'undefined') ||
        (value === null) ||
        (value && typeof value === "object" && Object.keys(value).length === 0)) {
        return true;
    } else {
        return false;
    }
};

export const getPercentage = (a, b, p) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return 0;
    }
    if (b === 0) {
        return 0;
    }
    let result = (a / b) * 100;
    result = result >= 100.0 ? 100.0 : result;
    return result.toFixed(p);

};

export const fmtPercentage = (value, p) => {

};

export const fmtROCdate = (value) => {
    if (!isEmpty(value) && dayjs(value).isValid()) {
        let year = parseInt(dayjs(value).format('YYYY')) - 1911;
        let month = dayjs(value).format('MM');
        let day = dayjs(value).format('DD');
        return `${year}/${month}/${day}`;
    } else {
        return '';
    }
};

export const getWeekStartEnd = (currentDate) => {
    let currentWeekStart = dayjs(currentDate).startOf('week').format('YYYY-MM-DD');
    let currentWeekEnd = dayjs(currentDate).endOf('week').format('YYYY-MM-DD');

     return {begin: currentWeekStart, end: currentWeekEnd};
};

export const getFirstDate = (data) => {
    let minDate;
    if (data.length == 0) {
        return null;
    } else {
        minDate = dayjs(data[0]);
        data.forEach((item) => {
            const currentDate = dayjs(item);
            if (currentDate.isBefore(minDate)) {
                minDate = currentDate;
            }            
        });
    }
    return minDate.format('YYYY-MM-DD');
};

export const getLastDate = (data) => {
    let maxDate;
    if (data.length == 0) {
        return null;
    } else {
        maxDate = dayjs(data[0]);
        data.forEach((item) => {
            const currentDate = dayjs(item);
            if (currentDate.isAfter(maxDate)) {
                maxDate = currentDate;
            }
        });
    }
    return maxDate.format('YYYY-MM-DD');
};

export const esti_sdate_byjt = (jt, es) => {
    let dates = [];
    _.map(es, (item) => {
        if (item.jobid[0] == jt) {
            dates.push(item.esti_start_date);
        }
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    if (dates.length == 0) {
        //console.log(`esti minDate = ''`);
        return null;
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

export const esti_fdate_byjt = (jt, es) => {
    let dates = [];
    _.map(es, (item) => {
        if (item.jobid[0] == jt) {
            dates.push(item.esti_fin_date);
        }
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    if (dates.length == 0) {
        //console.log(`esti maxDate = ''`);
        return null;
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

export const act_sdate_byjt = (jt, smi) => {
    let dates = [];
    _.map(smi, (item) => {
        if (item.jobid[0] == jt) {
            dates.push(item.start_date);
        }
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    if (dates.length == 0) {
        //console.log(`act minDate = ''`);
        return null;
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

export const act_fdate_byjt = (jt, smi) => {
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
        return null;
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

export const estimh_byjt = (jt, es) => {
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

export const estidwg_byjt = (jt, es) => {
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

export const curym_accumh_byjt = (curym, jt, mi) => {
    let data = _.filter(mi, (item) => {
        return item.jobid[0] == jt && item.yearmonth == curym;
    });
    let total_mh = _.reduce(data, (sum, item) => {
        //item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        item.lmn_mh = typeof item.lmn_mh != 'number' ? 0 : item.lmn_mh;
        return sum + item.lmn_mh;
    }, 0);
    return total_mh;
};

export const curym_accudwg_byjt = (curym, jt, mi) => {
    let data = _.filter(mi, (item) => {
        return item.jobid[0] == jt && item.yearmonth == curym;
    });
    let total_dwg = _.reduce(data, (sum, item) => {
        //item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        item.lmn_dwg = typeof item.lmn_dwg != 'number' ? 0 : item.lmn_dwg;
        return sum + item.lmn_dwg;
    }, 0);
    return total_dwg;
};

export const accumh_byjt = (curym, jt, mi) => {
    let data = _.filter(mi, (item) => {
        return item.jobid[0] == jt && item.yearmonth <= curym;
    });
    let total_mhjt = _.reduce(data, (sum, item) => {
        //item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        item.lmn_mh = typeof item.lmn_mh != 'number' ? 0 : item.lmn_mh;
        return sum + item.lmn_mh;
    }, 0);
    return total_mhjt;
};

export const accudwg_byjt = (curym, jt, mi) => {
    let data = _.filter(mi, (item) => {
        return item.jobid[0] == jt && item.yearmonth <= curym;
    });
    let total_dwgjt = _.reduce(data, (sum, item) => {
        //item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        item.lmn_dwg = typeof item.lmn_dwg != 'number' ? 0 : item.lmn_dwg;
        return sum + item.lmn_dwg;
    }, 0);
    return total_dwgjt;
};

export const estidwg_byjtdt = (jt, es, dt) => { 
    let data = _.filter(es, (item) => {
        let idt = isEmpty(item.design_type) || item.design_type == '' ? '' : item.design_type[0];
        return item.jobid[0] == jt &&  dt.includes(idt);
    });
    let total_estidwgjtdt = _.reduce(data, function(sum, item) {
        //item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        item.esti_dwg = typeof item.esti_dwg != 'number' ? 0 : item.esti_dwg;
        return sum + item.esti_dwg;
    }, 0);
    return total_estidwgjtdt;
};

export const estimh_byjtdt = (jt, es, dt) => {
    let data = _.filter(es, (item) => {
        //let idt = item.design_type.length > 0 ? item.design_type[0] : '';
        let idt = isEmpty(item.design_type) || item.design_type == '' ? '' : item.design_type[0];
        //console.log('idt = ', idt, item);
        return item.jobid[0] == jt &&  dt.includes(idt);
        //return item.jobid[0] == jt;
    });
    let total_estimhjtdt = _.reduce(data, function(sum, item) {
        //item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        item.esti_mh = typeof item.esti_mh != 'number' ? 0 : item.esti_mh;
        return sum + item.esti_mh;
    }, 0);
    return total_estimhjtdt;
};

export const estidwg_bydt = (es, dt) => {
    let data = _.filter(es, (item) => {
        let idt = isEmpty(item.design_type) || item.design_type == '' ? '' : item.design_type[0];
        return dt.includes(idt);
    });
    let total_estidwgjtdt = _.reduce(data, function(sum, item) {
        //item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        item.esti_dwg = typeof item.esti_dwg != 'number' ? 0 : item.esti_dwg;
        return sum + item.esti_dwg;
    }, 0);
    return total_estidwgjtdt;
};

export const estimh_bydt = (es, dt) => {
    let data = _.filter(es, (item) => {
        let idt = isEmpty(item.design_type) || item.design_type == '' ? '' : item.design_type[0];
        return dt.includes(idt);
    });
    let total_estimhjtdt = _.reduce(data, function(sum, item) {
        item.esti_mh = typeof item.esti_mh != 'number' ? 0 : item.esti_mh;
        return sum + item.esti_mh;
    }, 0);
    return total_estimhjtdt;
};

export const accumh_byjtdt = (curym, jt, smi, dt) => {
    let data = _.filter(smi, (item) => {
        //let idt = item.design_type.length > 0 ? item.design_type[0] : '';
        let idt = isEmpty(item.design_type) || item.design_type == '' ? '' : item.design_type[0];
        return item.jobid[0] == jt && dt.includes(idt) && item.yearmonth <= curym;
        //return item.jobid[0] == jt && dt[0] == '自' && item.yearmonth <= curym;
    });
    let total_mhjtdt = _.reduce(data, (sum, item) => {
        //item.accu_mh = item.accu_mh == null ? 0 : item.accu_mh;
        item.accu_mh = typeof item.accu_mh != 'number' ? 0 : item.accu_mh;
        return sum + item.accu_mh;
    }, 0);
    return total_mhjtdt;
};

export const accudwg_byjtdt = (curym, jt, smi, dt) => {
    let data = _.filter(smi, (item) => {
        //let idt = item.design_type.length > 0 ? item.design_type[0] : '';
        let idt = isEmpty(item.design_type) || item.design_type == '' ? '' : item.design_type[0];
        return item.jobid[0] == jt && dt.includes(idt) && item.yearmonth <= curym;
        //return item.jobid[0] == jt && dt[0] == '自' && item.yearmonth <= curym;
    });
    let total_dwgjtdt = _.reduce(data, (sum, item) => {
        //item.accu_dwg = item.accu_dwg == null ? 0 : item.accu_dwg;
        item.accu_dwg = typeof item.accu_dwg != 'number' ? 0 : item.accu_dwg;
        return sum + item.accu_dwg;
    }, 0);
    return total_dwgjtdt;
};

export const accumh_bydt = (curym, smi, dt) => {
    let data = _.filter(smi, (item) => {
        let idt = isEmpty(item.design_type) || item.design_type == '' ? '' : item.design_type[0];
        return dt.includes(idt) && item.yearmonth <= curym;
    });
    let total_mhdt = _.reduce(data, (sum, item) => {
        //item.accu_mh = item.accu_mh == null ? 0 : item.accu_mh;
        item.accu_mh = typeof item.accu_mh != 'number' ? 0 : item.accu_mh;
        return sum + item.accu_mh;
    }, 0);
    return total_mhdt;
};

export const accudwg_bydt = (curym, smi, dt) => {
    let data = _.filter(smi, (item) => {
        let idt = isEmpty(item.design_type) || item.design_type == '' ? '' : item.design_type[0];
        return dt.includes(idt) && item.yearmonth <= curym;
    });
    let total_dwgdt = _.reduce(data, (sum, item) => {
        item.accu_dwg = typeof item.accu_dwg != 'number' ? 0 : item.accu_dwg;
        return sum + item.accu_dwg;
    }, 0);
    return total_dwgdt;
};

export const estiprg_byjt = (jt, es, smi, orders, p) => {
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
            //item.esti_mh = item.esti_mh == null ? 0 : item.esti_mh;
            item.esti_mh = typeof item.esti_mh != 'number' ? 0 : item.esti_mh;
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

export const actprg_byjt = (jt, es, smi, orders, p) => {

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
            //item.esti_mh = item.esti_mh == null ? 0 : item.esti_mh;
            item.esti_mh = typeof item.esti_mh != 'number' ? 0 : item.esti_mh;
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

// 預定設計進度
export const estiprg_design = (summary) => {
    //console.log(summary);
    let sum_ratio = _.reduce(summary, (sum, item) => {
        return item.taskindex < 500 ? sum + item.ratio : sum;
    }, 0);
    //console.log('sum_ratio = ', sum_ratio);
    //let temp = _.map(summary, (item, i) => {
    //    return item.taskindex < 700 ? parseFloat(item.estiprg) * parseFloat(item.ratio) / sum_ratio : 0;
    //});
    //console.log('temp = ', temp);
    //let estiprg = _.sum(temp);

    let estiprg = _.reduce(summary, (sum, item) => {
        return item.taskindex < 500 ? sum + parseFloat(item.estiprg) * parseFloat(item.ratio) / sum_ratio : sum;
    }, 0);


    if (isNaN(estiprg) || estiprg == '' || estiprg == null) { estiprg = 0; }
    return estiprg.toFixed(1);
};

// 實際設計進度
export const actprg_design = (summary) => {
    let sum_ratio = _.reduce(summary, (sum, item) => {
        return item.taskindex < 500 ? sum + item.ratio : sum;
    }, 0);
    //let temp = _.map(summary, (item, i) => {
    //    return item.taskindex < 700 ? parseFloat(item.actprg) * parseFloat(item.ratio) / sum_ratio : 0;
    //});
    //let actprg = _.sum(temp);
    let actprg = _.reduce(summary, (sum, item) => {
        return item.taskindex < 500 ? sum + parseFloat(item.actprg) * parseFloat(item.ratio) / sum_ratio : sum;
    }, 0);

    if (isNaN(actprg) || actprg == '' || actprg == null) { actprg = 0; }
    return actprg.toFixed(1);

};

export const accumh = (curym, subjobno, jobid, mi) => {
    let data = _.filter(mi, (item) => {
        return item.subjobno == subjobno && item.jobid == jobid && item.yearmonth <= curym;
    });
    let total_mh = _.reduce(data, (sum, item) => {
        //item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        item.lmn_mh = typeof item.lmn_mh != 'number' ? 0 : item.lmn_mh;
        return sum + item.lmn_mh;
    }, 0);
    return total_mh;
};

export const accudwg = (curym, subjobno, jobid, mi) => {
    let data = _.filter(mi, (item) => {
        return item.subjobno == subjobno && item.jobid == jobid && item.yearmonth <= curym;
    });
    let total_dwg = _.reduce(data, (sum, item) => {
        //item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        item.lmn_dwg = typeof item.lmn_dwg != 'number' ? 0 : item.lmn_dwg;
        return sum + item.lmn_dwg;
    }, 0);
    return total_dwg;
}

export const p_estiprg = (subjobno, jobid, orders, orderitems, curym, p) => {
    
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

export const p_actprg = (subjobno, jobid, orders, orderitems, curym, p) => {
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

export const estiprg = (curym, subjobno, date1, date2, p) => {
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

export const actprg = (curym, subjobno, jobid, es, mi, p) => {
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

export const estiprg_prj = (data) => {
    return (_.sum(_.zipWith(data, (it) => it.ratio * parseFloat(it.estiprg))) / 100).toFixed(1);
};

export const actprg_prj = (data) => {
    return (_.sum(_.zipWith(data, (it) => it.ratio * parseFloat(it.actprg))) / 100).toFixed(1);
};

export const estiprg_all = (ptc, tcr, es, smi, orders, p) => {
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

export const actprg_all = (ptc, tcr, es, smi, orders, p) => {
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

export const accu_gendwg_member = (mi) => {
    //累計個人自行設計圖數(不含DCS、PLC)
    let jobtype = ['I', 'B', 'D', 'C', 'P', 'R'];
    let designtype = ['自行設計'];
    let total_dwg = _.reduce(mi, (sum, item) => {
        //console.log(item);
        item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        
        //if (!_.isEmpty(item.design_type)) {
            if (jobtype.includes(item.jobid[0]) && designtype.includes(item.design_type)) {
                return sum + item.lmn_dwg;
            } else {
                return sum;
            }    
        //} else {
        //    return sum;
        //}

    }, 0);
    return total_dwg;
};

export const accu_genmh_member = (mi) => {
    //累計個人自行設計工時(不含DCS、PLC)
    let jobtype = ['I', 'B', 'D', 'C', 'P', 'R'];
    let designtype = ['自行設計'];
    let total_mh = _.reduce(mi, (sum, item) => {
        item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        
        //if (!_.isEmpty(item.design_type)) {
            if (jobtype.includes(item.jobid[0]) && designtype.includes(item.design_type)) {
                return sum + item.lmn_mh;
            } else {
                return sum;
            }        
        //} else {
        //    return sum;
        //}

    }, 0);
    return total_mh;
};

export const accu_approvaldwg_member = (mi) => {
    //累計個人審查圖數(含PLC、DCS)
    let jobtype = ['I', 'B', 'D', 'E', 'F', 'C', 'P', 'R'];
    let designtype = [null, '委外設計', '委外統包'];
    let total_dwg = _.reduce(mi, (sum, item) => {
        item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;        
        //if (!_.isEmpty(item.design_type)) {
            if (jobtype.includes(item.jobid[0]) && designtype.includes(item.design_type)) {
                return sum + item.lmn_dwg;
            } else {
                return sum;
            }        
        //} else {
        //    return sum;
        //}

    }, 0);
    return total_dwg;
};

export const accu_approvalmh_member = (mi) => {
    //累計個人審查工時(含PLC、DCS)
    let jobtype = ['I', 'B', 'D', 'E', 'F', 'C', 'P', 'R'];
    let designtype = [null, '委外設計', '委外統包'];
    let total_mh = _.reduce(mi, (sum, item) => {
        item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        //if (!_.isEmpty(item.design_type)) {
            if (jobtype.includes(item.jobid[0]) && designtype.includes(item.design_type)) {
                return sum + item.lmn_mh;
            } else {
                return sum;
            }        
        //} else {
        //    return sum;
        //}

    }, 0);
    return total_mh;
};

export const accu_dcsdwg_member = (mi) => {
    //累計個人DCS自行設計圖數
    let count = 0;
    let jobtype = ['E'];
    let designtype = ['自行設計'];
    let total_dwg = _.reduce(mi, (sum, item) => {
        item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        //if (!_.isEmpty(item.design_type)) {
            if (jobtype.includes(item.jobid[0]) && designtype.includes(item.design_type)) {
                return sum + item.lmn_dwg;
            } else {
                return sum;
            }        
        //} else {
        //    return sum;
        //}
    }, 0);
    return total_dwg;
};

export const accu_dcsmh_member = (mi) => {
    //累計個人DCS自行設計工時
    let jobtype = ['E'];
    let designtype = ['自行設計'];
    let total_mh = _.reduce(mi, (sum, item) => {
        item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        //if (!_.isEmpty(item.design_type)) {
            if (jobtype.includes(item.jobid[0]) && designtype.includes(item.design_type)) {
                return sum + item.lmn_mh;
            } else {
                return sum;
            }        
        //} else {
        //    return sum;
        //}
    }, 0);
    return total_mh;
};

export const accu_plcdwg_member = (mi) => {
    //累計個人PLC自行設計圖數
    let jobtype = ['F'];
    let designtype = ['自行設計'];
    let total_dwg = _.reduce(mi, (sum, item) => {
        item.lmn_dwg = item.lmn_dwg == null ? 0 : item.lmn_dwg;
        //if (!_.isEmpty(item.design_type)) {
            if (jobtype.includes(item.jobid[0]) && designtype.includes(item.design_type)) {
                return sum + item.lmn_dwg;
            } else {
                return sum;
            }        
        //} else {
        //    return sum;
        //}
    }, 0);
    return total_dwg;
};

export const accu_plcmh_member = (mi) => {
    //累計個人PLC自行設計工時
    let jobtype = ['F'];
    let designtype = ['自行設計'];
    let total_mh = _.reduce(mi, (sum, item) => {
        item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        //if (!_.isEmpty(item.design_type)) {
            if (jobtype.includes(item.jobid[0]) && designtype.includes(item.design_type)) {
                return sum + item.lmn_mh;
            } else {
                return sum;
            }        
        //} else {
        //    return sum;
        //}
    }, 0);
    return total_mh;
};


export const accu_commh_member = (mi) => {
    //累計個人施工、試車時數
    let jobtype = ['K', 'T'];
    let total_mh = _.reduce(mi, (sum, item) => {
        item.lmn_mh = item.lmn_mh == null ? 0 : item.lmn_mh;
        //if (!_.isEmpty(item.design_type)) {
            if (jobtype.includes(item.jobid[0])) {
                return sum + item.lmn_mh;
            } else {
                return sum;
            }            
        //} else {
        //    return sum;
        //}
    }, 0);
    return total_mh;
};

export const getsdate = (summary) => {
    let dates = [];
    _.map(summary, (item) => {
        //console.log(item.category, item.esti_sdate);
        dates.push(item.esti_sdate);
        dates.push(item.act_sdate);
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    
    if (dates.length == 0) {
        return null;
    } else {
        let minDate = dayjs(dates[0]);
        dates.forEach((date) => {
            const currentDate = dayjs(date);
            if (currentDate.isBefore(minDate)) {
                minDate = currentDate;
            }
        });
        return minDate.format('YYYY-MM-DD');
    }
    
};

export const getfdate = (summary) => {
    let dates = [];
    _.map(summary, (item) => {
        dates.push(item.esti_fdate);
        dates.push(item.act_fdate);
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    if (dates.length == 0) {
        return null;
    } else {
        let maxDate = dayjs(dates[0]);
        dates.forEach((date) => {
            const currentDate = dayjs(date);
            if (currentDate.isAfter(maxDate)) {
                maxDate = currentDate;
            }
        });
        return maxDate.format('YYYY-MM-DD');
    }

};

export const getestisdate = (summary) => {
    let dates = [];
    _.map(summary, (item) => {
        //console.log(item.category, item.esti_sdate);
        dates.push(item.esti_sdate);
        //dates.push(item.act_sdate);
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    
    if (dates.length == 0) {
        return null;
    } else {
        let minDate = dayjs(dates[0]);
        dates.forEach((date) => {
            const currentDate = dayjs(date);
            if (currentDate.isBefore(minDate)) {
                minDate = currentDate;
            }
        });
        return minDate.format('YYYY-MM-DD');
    }
};

export const getestifdate = (summary) => {
    let dates = [];
    _.map(summary, (item) => {
        dates.push(item.esti_fdate);
        //dates.push(item.act_fdate);
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    if (dates.length == 0) {
        return null;
    } else {
        let maxDate = dayjs(dates[0]);
        dates.forEach((date) => {
            const currentDate = dayjs(date);
            if (currentDate.isAfter(maxDate)) {
                maxDate = currentDate;
            }
        });
        return maxDate.format('YYYY-MM-DD');
    }

};

export const getactsdate = (summary) => {
    let dates = [];
    _.map(summary, (item) => {
        //console.log(item.category, item.esti_sdate);
        //dates.push(item.esti_sdate);
        dates.push(item.act_sdate);
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    
    if (dates.length == 0) {
        return null;
    } else {
        let minDate = dayjs(dates[0]);
        dates.forEach((date) => {
            const currentDate = dayjs(date);
            if (currentDate.isBefore(minDate)) {
                minDate = currentDate;
            }
        });
        return minDate.format('YYYY-MM-DD');
    }
};

export const getactfdate = (summary) => {
    let lastItem = _.maxBy(summary, 'taskindex');
    return lastItem.act_fdate;
/*
    let dates = [];
    _.map(summary, (item) => {
        //dates.push(item.esti_fdate);
        dates.push(item.act_fdate);
        //dates.push({act_fdate: item.act_fdate, taskindex: item.taskindex});
    });
    dates = dates.filter(date => date !== null && date !== '' && dayjs(date).isValid());
    if (dates.length == 0) {
        return null;
    } else {
        let maxDate = dayjs(dates[0]);
        dates.forEach((date) => {
            const currentDate = dayjs(date);
            if (currentDate.isAfter(maxDate)) {
                maxDate = currentDate;
            }
        });
        return maxDate.format('YYYY-MM-DD');
    }
*/

};

export const listMonths = (sdate, fdate) => {
    const start = dayjs(sdate);
    const end = dayjs(fdate);
    let current = start;
    let dates = [];
    while (current.isBefore(end) || current.isSame(end, 'month')) {
        dates.push(current.startOf('month').format('YYYY-MM-DD'));
        current = current.add(1, 'month');
    }
    return dates;
};

export const monthDiff = (sdate, fdate, sym) => {
    const start = dayjs(sdate);
    const end = dayjs(fdate);
    //console.log(`start = ${sdate}, end = ${fdate}`);
    //return end.diff(start, 'month', true);
    if (!start.isValid() && !end.isValid()) {
        return 0;
    } else if (start.isValid() && !end.isValid()) {
        return dayjs(sym, 'YYYYMM').endOf('month').diff(start, 'month', true);
    } else {
        return end.diff(start, 'month', true);
    }
    
}

export const dayDiff = (sdate, fdate, sym) => {
    const start = dayjs(sdate);
    const end = dayjs(fdate);
    //console.log(`start = ${sdate}, end = ${fdate}`);
    //return end.diff(start, 'month', true);
    if (!start.isValid() && !end.isValid()) {
        return 0;
    } else if (start.isValid() && !end.isValid()) {
        return dayjs(sym, 'YYYYMM').endOf('month').diff(start, 'day', true);
    } else {
        return end.diff(start, 'day', true);
    }
    
}

export const countMonthsByYear = (dates) => {
    const yearMonthMap = {};
    dates.forEach(d => {
        const year = dayjs(d).year();
        const month = dayjs(d).month();
        if (!yearMonthMap[year]) {
            yearMonthMap[year] = new Set();
        }        
        yearMonthMap[year].add(month);
    });
    const result = Object.keys(yearMonthMap).map(year => ({
        year: parseInt(year),
        months: yearMonthMap[year].size
    }));
    return result;
}

export const extractMonths = (dates) => {
    return dates.map(date => dayjs(date).month() + 1);
}
