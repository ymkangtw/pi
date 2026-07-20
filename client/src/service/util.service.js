import axios from "axios";
import * as dayjs from 'dayjs';
import _ from 'lodash';
import { jsPDF } from "jspdf";
import * as util from '@/util/utils.js';
import '@/assets/NotoSansTC-normal.js';
//import '@/assets/LXGWWenKaiTC-normal.js';

//import CommonSvc from '@/service/common.service.js';

export default class UtilService {
    async weekreportbygroup(param) {
        let data = await axios
        //await axios
            .post('/api/util/weekreportbygroup', {
                //params: param,
                //responseType: 'blob'

                data: param,
                //responseType: 'stream'
                //headers: { 'content-type': 'application/json' },
                //data: param,
                //maxContentLength: 100000000,
                //maxBodyLength: 1000000000,
                
            })
            .then(res => {
                //var fileURL = window.URL.createObjectURL(new Blob([res.data]));
                //console.log(res);
                /*
                var fileURL = window.URL.createObjectURL(new Blob([res.data], { type: 'application/msword' }));
                var fileLink = document.createElement('a');
                const currDate = dayjs(new Date()).format('YYYY-MM-DD');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', `三級週報${currDate}.docx`);
                document.body.appendChild(fileLink);
                fileLink.click();
                fileLink.remove();
                */
                return res.data;
                //return 'download';
            });
        return data;
    };

    async downloadFile(param) {
        let data = await axios
            .get('/api/util/downloadfile', {
                params: param,
                responseType: 'blob'                
            })
            .then(res => {
                var fileURL = window.URL.createObjectURL(new Blob([res.data], { type: 'application/msword' }));
                var fileLink = document.createElement('a');
                const currDate = dayjs(new Date()).format('YYYY-MM-DD');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', `三級週報${currDate}.docx`);
                document.body.appendChild(fileLink);
                fileLink.click();
                fileLink.remove();
                return 'download'
            });
        return trimJSON(data);
    };

    async orderreport(param) {
        let data = await axios
            .post('/api/util/orderreport', {
                data: param,
            })
            .then(res => {
                return res.data;
            });
        return data;
    };

    async monthworkreport(sym, memberInfo, b, s, ptc, tcr, es, smi, mi, orders, pData, content, monthwork, checkContent) {
        //console.log('summary: ', s);
        //console.log('basic: ', b);
        //console.log('ptc: ', ptc);
        //console.log('tcr: ', tcr);
        //console.log('es: ', es);
        //console.log('smi: ', smi);
        //console.log('mi: ', mi);
        //console.log('orders: ', orders);
        let sdate = await dayjs(util.getsdate(s)).startOf('month').format('YYYY-MM-DD');
        //let fdate = await dayjs(util.getfdate(s)).add(4, 'month').endOf('month').format('YYYY-MM-DD');
        let fdate = await dayjs(util.getfdate(s)).endOf('month').format('YYYY-MM-DD');
        let diffm = util.listMonths(sdate, fdate);
        //console.log(diffm);
        let earliestYear = Math.min(...diffm.map(date => dayjs(date).year()));
        let earliestYearMonths = diffm.filter(date => dayjs(date).year() === earliestYear).length;
        let dmw = 98 / diffm.length; // gantt chart max width: 98mm

        // 最早年月
        if (dmw * earliestYearMonths < 6) {
            let subm = Math.ceil(6 / dmw) - earliestYearMonths;
            sdate = dayjs(sdate).subtract(subm, 'month').startOf('month').format('YYYY-MM-DD');
        }

        // 最晚年月
        let addm = Math.ceil(7 / dmw);
        fdate = dayjs(fdate).add(addm, 'month').endOf('month').format('YYYY-MM-DD');
        //console.log(sdate, fdate);
        
        let pLM = 5;
        let pUM = 5;
        let pd = 2;
        let A4Width = 210;
        let A4Height = 297;
    
        //let fs10 = 10;
        //let fs12 = 12;
        
        var doc = new jsPDF({
            //compress: false,
            orientation: 'portrait',
            unit: 'mm',
            //unit: 'px',
            format: 'a4'
        });
        //doc.addFont('kaiu-normal.ttf', 'kaiu', 'normal');
        //doc.setFont('kaiu');
        //doc.text("Hello world!", 10, 10);
        let drawSize = {x1: pLM, y1: pUM, x2: A4Width - 2 * pLM, y2: A4Height - 2 * pUM};
        doc.setLineWidth(0.1);
        // 內框
        doc.rect(drawSize.x1, drawSize.y1, drawSize.x2, drawSize.y2);
        // 外框
        doc.rect(drawSize.x1 - 0.5, drawSize.y1 - 0.5, drawSize.x2 + 0.5 * 2, drawSize.y2 + 0.5 * 2);

        //doc.addFileToVFS();
        doc.setFont('NotoSansTC');
        //doc.setFont('LXGWWenKaiTC');
        
        //let idreportno = `${team}-${'03'}-${year}-${String(no).padStart(3, '0')}-${'CD'}`;
        doc.setFontSize(8);
        doc.text(`資料時間: ${parseInt(sym.slice(0, 4)) - 1911}年${sym.slice(4, 6)}月`, pLM + pd, pUM + 4);
        doc.text(`工程編號: ${b.jobno}`, pLM + pd, pUM + 4 * 2);
        doc.setFontSize(14);
        doc.setTextColor('#0000FF');
        let title = `${b.jobname} 月報表`;
        doc.text(`${title}`, A4Width / 2, pUM + 4, {align: 'center', baseline: 'middle'});
        doc.setTextColor('#000000');
        let wordCount = title.length;
        //doc.line(A4Width / 2 - wordCount / 2 * 4.25, pUM + 4 * 2, A4Width / 2 + wordCount / 2 * 4.25, pUM + 4 * 2);
        doc.setDrawColor('#0000FF');
        doc.line(A4Width / 2 - 62.5, pUM + 4 * 2 - 0.4, A4Width / 2 + 62.5, pUM + 4 * 2 - 0.4);
        doc.line(A4Width / 2 - 62.5, pUM + 4 * 2, A4Width / 2 + 62.5, pUM + 4 * 2);
        doc.setDrawColor('#000000');
        //doc.text("繁體中文測試，。項目1.", pLM + 10, pUM + 10, {baseline: 'middle'});
        doc.setFontSize(8);
        let curDate = dayjs(new Date());
        let year = parseInt(curDate.format('YYYY')) - 1911;
        let month = curDate.format('MM');
        let day = curDate.format('DD');
        doc.text(`列印日期: ${year}年${month}月${day}日`, A4Width - pUM - pd, pUM + 4, { align: 'right' });
        
        //
        let sX = pLM + pd;
        let sY = pUM + 4 * 4;
        let lh = 6;
        doc.setFontSize(11);
        doc.text(`1. 工程總預算:`, sX, sY + lh * 0);
        doc.text(`2. 儀電總預算:`, sX, sY + lh * 1);
        doc.text(`3. ${memberInfo.team}預算金額:`, sX, sY + lh * 2);
        doc.text(`4. 計畫請購金額:`, sX, sY + lh * 3);
        doc.text(`5. 預計總圖件數:`, sX, sY + lh * 4);
        doc.text(`6. 實際總圖件數:`, sX, sY + lh * 5);
        doc.text(`7. 本月圖件數:`, sX, sY + lh * 6);
        
        sX = sX + 60;
        // 工程總預算
        doc.text(`${b.totalbudget}`, sX, sY + lh * 0, { align: 'right' });
        // 儀電總預算
        doc.text(`${b.electricalbudget}`, sX, sY + lh * 1, { align: 'right' });
        // Y63預算金額
        doc.text(`${b.y6tbudget}`, sX, sY + lh * 2, { align: 'right' });
        // 計畫請購金額
        //doc.text(`${util.fv(pData.purchaseesti)}`, sX, sY + lh * 3, { align: 'right' });
        doc.text(`${util.fv(pData.estimateamount)}`, sX, sY + lh * 3, { align: 'right' });
        
        // 預計總圖件數
        let estidwg = _.reduce(s, (sum, item) => {
            return sum + item.estidwg;
        }, 0);
        doc.text(`${estidwg}`, sX, sY + lh * 4, { align: 'right' });
        // 實際總圖件數
        let accudwg = _.reduce(s, (sum, item) => {
            return sum + item.accudwg;
        }, 0);
        let accudwg_s = util.accudwg_bydt(sym, smi, ['自']);
        let accudwg_t = util.accudwg_bydt(sym, smi, ['委', '']);

        doc.text(`${accudwg_s}(自) ${accudwg_t}(外)`, sX, sY + lh * 5, { align: 'right' });
        // 本月圖件數
        let curym_accudwg = _.reduce(s, (sum, item) => {
            return sum + item.curym_accudwg;
        }, 0);        
        doc.text(`${curym_accudwg}`, sX, sY + lh * 6, { align: 'right' });

        sX = sX + 10;
        doc.text(`8. 計畫總工時:`, sX, sY + lh * 0);
        doc.text(`9. 實際總工時:`, sX, sY + lh * 1);
        doc.text(`10. 本月工時:`, sX, sY + lh * 2);
        doc.text(`11. 計畫總進度:`, sX, sY + lh * 3);
        doc.text(`12. 實際總進度:`, sX, sY + lh * 4);
        doc.text(`13. 本月設計進度:`, sX, sY + lh * 5);
        doc.text(`14. 設計計畫總進度:`, sX, sY + lh * 6);
        //doc.text(`14. 申請單位:`, sX, sY + lh * 6);
        sX = sX + 55;
        // 計畫總工時
        let estimh = _.reduce(s, (sum, item) => {
            return sum + item.estimh;
        }, 0);
        doc.text(`${estimh}`, sX, sY + lh * 0, { align: 'right' });
        // 實際總工時
        let accumh = _.reduce(s, (sum, item) => {
            return sum + item.accumh;
        }, 0); 
        doc.text(`${accumh}`, sX, sY + lh * 1, { align: 'right' });
        // 本月工時
        let curym_accumh = _.reduce(s, (sum, item) => {
            return sum + item.curym_accumh;
        }, 0);
        doc.text(`${curym_accumh}`, sX, sY + lh * 2, { align: 'right' });
        // 計畫總進度
        let estiprg_prj = util.estiprg_prj(s);
        doc.text(`${estiprg_prj}`, sX, sY + lh * 3, { align: 'right' });
        // 實際總進度
        let actprg_prj = util.actprg_prj(s);
        doc.text(`${actprg_prj}`, sX, sY + lh * 4, { align: 'right' });
        // 本月進度
        let ratio = _.reduce(s, (sum, item) => {
            return item.taskindex < 700 ? sum + item.ratio : sum;
        }, 0);
        //console.log('ratio = ', ratio);
        doc.text(`${(parseFloat(util.getPercentage(curym_accudwg, estidwg, 2)) * ratio / 100).toFixed(1)}`, sX, sY + lh * 5, { align: 'right' });
        //doc.text(`${ratio1}`, sX, sY + lh * 5, { align: 'right' });
        // 設計計畫總進度
        doc.text(`${util.estiprg_design(s)}`, sX, sY + lh * 6, { align: 'right' });
        // 申請單位
        //doc.text(`${b.appdept}`, sX, sY + lh * 6, { align: 'right' });

        sX = sX + 10;
        doc.text(`15. 申請單位:`, sX, sY + lh * 0);
        //doc.text(`15. 預算編號:`, sX, sY + lh * 0);
        doc.text(`16. 工令編號:`, sX, sY + lh * 1);
        doc.text(`17. 案件類別:`, sX, sY + lh * 2);
        doc.text(`18. 預算年度:`, sX, sY + lh * 3);
        doc.text(`19. 系統設計:`, sX, sY + lh * 4);
        doc.text(`20. 專案負責人:`, sX, sY + lh * 5);
        doc.text(`21. 設計實際總進度:`, sX, sY + lh * 6);
        
        sX = sX + 60;
        // 申請單位
        doc.text(`${b.appdept}`, sX, sY + lh * 0, { align: 'right' });
        // 預算編號
        //doc.text(`${b.approvalno}`, sX, sY + lh * 0, { align: 'right' });
        // 工令編號
        doc.text(`${b.joborderno}`, sX, sY + lh * 1, { align: 'right' });
        // 案件類別
        doc.text(`${b.jobtype}`, sX, sY + lh * 2, { align: 'right' });
        // 預算年度
        doc.text(`${b.budgetyearst} - ${b.budgetyearsp}`, sX, sY + lh * 3, { align: 'right' });
        // 系統設計
        doc.text(`${memberInfo.member}`, sX, sY + lh * 4, { align: 'right' });
        // 專案負責人
        doc.text(`${memberInfo.leader}`, sX, sY + lh * 5, { align: 'right' });
        // 設計實際總進度
        doc.text(`${util.actprg_design(s)}`, sX, sY + lh * 6, { align: 'right' });

        // Gantt Chart
        sX = pLM;
        sY = pUM + 55;

        doc.setLineWidth(0.1);
        doc.line(sX, sY, A4Width - pLM, sY);
        sY = sY + 0.5;
        doc.line(sX, sY, A4Width - pLM, sY);

        // Draw Column
        sX = pLM;
        //sY = sY + 12;
        let columnH = 12;
        let columnW = [6, 17, 15, 15, 10, 10, 10, 10, 8];
        //doc.line(sX, sY, A4Width - pLM, sY);
        let chartsX = pLM + _.sum(_.slice(columnW, 0, 9));
        let chartsY = sY;


        let w = 0;
        w = _.sum(_.slice(columnW, 0, 1));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 2));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 3));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 4));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 5));
        doc.line(sX + w, sY + columnH / 2, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 6));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 7));
        doc.line(sX + w, sY + columnH / 2, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 8));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 9));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        
        doc.line(sX + _.sum(_.slice(columnW, 0, 4)), sY + columnH / 2, sX + _.sum(_.slice(columnW, 0, 8)), sY + columnH / 2);
        doc.line(sX, sY + columnH, A4Width - pLM, sY + columnH);

        // 開始/完成日期
        doc.setFontSize(10);
        doc.text(`項\n次`, sX + columnW[0] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 1));
        doc.text(`工作內容`, sX + w + columnW[1] / 2, sY + columnH / 2, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 2));
        doc.text(`開始\n日期`, sX + w + columnW[2] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 3));
        doc.text(`完成\n日期`, sX + w + columnW[3] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 4));
        doc.text(`設計`, sX + w + (columnW[4] + columnW[4]) / 2, sY + columnH / 4, { align: 'center', baseline: 'middle' });
        doc.text(`圖數`, sX + w + columnW[4] / 2, sY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 5));
        doc.text(`工時`, sX + w + columnW[5] / 2, sY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 6));
        doc.text(`審查`, sX + w + (columnW[6] + columnW[7]) / 2, sY + columnH / 4, { align: 'center', baseline: 'middle' });
        doc.text(`圖數`, sX + w + columnW[6] / 2, sY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 7));
        doc.text(`工時`, sX + w + columnW[7] / 2, sY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 8));
        doc.text(`比\n重`, sX + w + columnW[8] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });
        // 設計/審查 圖數/工時
        doc.setFontSize(10);


        // Fill Table
        sX = pLM;
        sY = sY + columnH;
        let i = 0;
        let lineH = 10;
        
        for (let it of s) {
            doc.setFontSize(10);
            // 項次
            doc.text(`${i + 1}`, sX + columnW[0] / 2, sY + lineH * i + lineH / 2, { align: 'center', baseline: 'middle' });
            // 工作內容
            w = _.sum(_.slice(columnW, 0, 1));
            doc.text(`${it.category}`, sX + w + columnW[1] / 2, sY + lineH * i + lineH / 2, { align: 'center', baseline: 'middle' });
            
            doc.setFontSize(8);
            // 開始日期
            w = _.sum(_.slice(columnW, 0, 2));
            doc.text(`${util.fmtROCdate(it.esti_sdate)}`, sX + w + columnW[2] / 2, sY + lineH * i + lineH / 4 + 0.5, { align: 'center', baseline: 'middle' });
            doc.text(`${util.fmtROCdate(it.act_sdate)}`, sX + w + columnW[2] / 2, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'center', baseline: 'middle' });
            // 完成日期
            w = _.sum(_.slice(columnW, 0, 3));
            doc.text(`${util.fmtROCdate(it.esti_fdate)}`, sX + w + columnW[3] / 2, sY + lineH * i + lineH / 4 + 0.5, { align: 'center', baseline: 'middle' });
            doc.text(`${util.fmtROCdate(it.act_fdate)}`, sX + w + columnW[3] / 2, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'center', baseline: 'middle' });
            // 設計圖數
            w = _.sum(_.slice(columnW, 0, 5));
            doc.text(`${util.estidwg_byjtdt(it.jobtype, es, ['自'])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 + 0.5, { align: 'right', baseline: 'middle' });
            doc.text(`${util.accudwg_byjtdt(sym, it.jobtype, smi, ['自'])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });

            // 設計工時
            w = _.sum(_.slice(columnW, 0, 6));
            doc.text(`${util.estimh_byjtdt(it.jobtype, es, ['自'])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 + 0.5, { align: 'right', baseline: 'middle' });
            doc.text(`${util.accumh_byjtdt(sym, it.jobtype, smi, ['自'])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });

            // 審查圖數
            w = _.sum(_.slice(columnW, 0, 7));
            doc.text(`${util.estidwg_byjtdt(it.jobtype, es, ['委', ''])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 + 0.5, { align: 'right', baseline: 'middle' });
            doc.text(`${util.accudwg_byjtdt(sym, it.jobtype, smi, ['委', ''])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });

            // 審查工時
            w = _.sum(_.slice(columnW, 0, 8));
            doc.text(`${util.estimh_byjtdt(it.jobtype, es, ['委', ''])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 + 0.5, { align: 'right', baseline: 'middle' });
            doc.text(`${util.accumh_byjtdt(sym, it.jobtype, smi, ['委', ''])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });

            // 比重
            w = _.sum(_.slice(columnW, 0, 8));
            //doc.text(`${it.ratio}`, sX + w + columnW[8] / 2, sY + lineH * (i + 1) - lineH / 2 + 3, { align: 'center' });
            doc.text(`${it.ratio}`, sX + w + columnW[8] / 2, sY + lineH * i + lineH / 2, { align: 'center', baseline: 'middle' });
            //doc.text(`${it.category}`, sX + w + columnW[1] / 2, sY + lineH * (i + 1) - lineH / 2 + 1, { align: 'center' });

            doc.line(sX, sY + lineH * (i + 1), A4Width - pLM, sY + lineH * (i + 1));
            i = i + 1;
        }
        // Draw column
        w = _.sum(_.slice(columnW, 0, 1));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 2));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 3));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 4));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 5));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 6));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 7));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 8));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 9));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);

        //console.log('sY = ', sY + lineH * s.length);


        // Draw Gantt Chart
        let months = util.listMonths(sdate, fdate);
        let chartW = A4Width - pLM - chartsX;
        let chartH = sY + lineH * s.length - chartsY;
        let mw = chartW / months.length;
        //console.log('mw = ', mw);

        doc.line(chartsX, chartsY + columnH / 2, chartsX + chartW, chartsY + columnH / 2);
        for (let i = 0; i < months.length; i++) {
            doc.line(chartsX + (i + 1) * mw, chartsY + columnH / 2, chartsX + (i + 1) * mw, chartsY + chartH);
        }
        //console.log(months.length);
        //console.log(util.countMonthsByYear(months));
        
        // TEXT YEAR
        let cYM = util.countMonthsByYear(months);
        w = 0;
        doc.setFontSize(8);
        for (let it of cYM) {
            //console.log(it);
            w = w + it.months;
            doc.line(chartsX + w * mw, chartsY, chartsX + w * mw, chartsY + columnH / 2);
            doc.text(`${it.year - 1911}`, chartsX + w * mw - (it.months / 2) * mw, chartsY + columnH / 4, { align: 'center', baseline: 'middle' });
        }
        
        /*
        if (mw <= 1.0) {
            doc.setFontSize(3);
        } else if (mw > 1 && mw < 1.5 ) {
            doc.setFontSize(4);
        } else if (mw >= 1.5 && mw < 2 ) {
            doc.setFontSize(5);
        } else {
            doc.setFontSize(6);
        }
        */
        //doc.setFontSize(mw * 2.4);
        
        // TEXT MONTH
        let monthTxt = util.extractMonths(months);
        i = 0;
        let fs = 0;
        for (let it of monthTxt) {
            //fs = it > 9 ? mw * 2.9 : mw * 3.5;
            fs = mw * 3.5;
            if (it > 9) { doc.setCharSpace(-0.25); } else { doc.setCharSpace(0); }
            fs = fs > 7 ? 7 : fs;
            doc.setFontSize(fs);
            doc.text(`${it}`, chartsX + i * mw + mw / 2, chartsY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
            i = i + 1;
        }
        doc.setCharSpace(0);
        //doc.scale(1, 1);

        // Draw Progress Bar
        i = 0;
        let mds = 0;
        let mde = 0;
        let bh = 1.5;
        doc.setFontSize(7);
        doc.setTextColor('#0000FF');
        for (let it of s) {
            //console.log(util.monthDiff(sdate, it.esti_sdate, sym), util.monthDiff(sdate, it.esti_fdate, sym));
            //console.log(util.monthDiff(sdate, it.act_sdate, sym), util.monthDiff(sdate, it.act_fdate, sym));
            
            mds = util.monthDiff(sdate, it.esti_sdate, sym);
            mde = util.monthDiff(sdate, it.esti_fdate, sym);

            //console.log(`esti mds: ${mds}, mde: ${mde}, sdate: ${sdate}, e-sdate: ${it.esti_sdate}, e-fdate: ${it.esti_fdate}, ${sym}`);
            //doc.setFillColor('#FFFFFF');
            doc.setFillColor('#91caff');
            doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 - bh / 2 + 0.5, (mde - mds) * mw, bh, 'DF');
            if (it.act_sdate) {
                doc.text(`${it.estiprg}`, chartsX + mds * mw + (mde - mds) * mw + 1, chartsY + columnH + (lineH * i) + lineH / 4 + 0.5, { baseline: 'middle' });
            }
            
            
            mds = util.monthDiff(sdate, it.act_sdate, sym);
            mde = util.monthDiff(sdate, it.act_fdate, sym);
            //console.log(`act mds: ${mds}, mde: ${mde}, sdate: ${sdate}, a-sdate: ${it.act_sdate}, a-fdate: ${it.act_fdate}, ${sym}`);
            //doc.setFillColor('#C0C0C0');
            doc.setFillColor('#ff4d4f');
            
            if (it.act_sdate) {

                if ((chartsX + mds * mw + (mde - mds) * mw) >= drawSize.x2) {
                    doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 * 3 - bh / 2 - 0.5, A4Width - pLM - (chartsX + mds * mw), bh, 'DF');
                    doc.text(`${it.actprg}`, A4Width - pLM - 1, chartsY + columnH + (lineH * i) + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });
                } else {
                    doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 * 3 - bh / 2 - 0.5, (mde - mds) * mw, bh, 'DF');
                    doc.text(`${it.actprg}`, chartsX + mds * mw + (mde - mds) * mw + 1, chartsY + columnH + (lineH * i) + lineH / 4 * 3 - 0.5, { baseline: 'middle' });
                }
                //doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 * 3 - bh / 2 - 0.5, (mde - mds) * mw, bh, 'DF');
                //doc.text(`${it.actprg}`, chartsX + mds * mw + (mde - mds) * mw + 1, chartsY + columnH + (lineH * i) + lineH / 4 * 3 - 0.5, { baseline: 'middle' });
            }

            i = i + 1;
        }
        doc.setTextColor('#000000');

        //請購進度
        doc.setFillColor('#000000');
        doc.setFontSize(10);
        let textH = 5;
        sY = sY + s.length * lineH;
        doc.text(`應請購金額:`, sX + pd, sY + textH * 1);
        doc.text(`已請購金額:`, sX + pd, sY + textH * 2);
        doc.text(`已請購比例:`, sX + pd, sY + textH * 3);
        doc.text(`${util.fv(pData.purchaseesti)}`, sX + pd + 40, sY + textH * 1, { align: 'right' });
        doc.text(`${util.fv(pData.purchase)}`, sX + pd + 40, sY + textH * 2, { align: 'right' });
        let pRatio = util.getPercentage(pData.purchase, pData.purchaseesti, 1);
        doc.text(`${pRatio}`, sX + pd + 40, sY + textH * 3, { align: 'right' });

        doc.text(`應訂購金額:`, sX + pd + 50, sY + textH * 1);
        doc.text(`已訂購金額:`, sX + pd + 50, sY + textH * 2);
        doc.text(`已訂購比例:`, sX + pd + 50, sY + textH * 3);
        doc.text(`${util.fv(pData.orderesti)}`, sX + pd + 90, sY + textH * 1, { align: 'right' });
        doc.text(`${util.fv(pData.order)}`, sX + pd + 90, sY + textH * 2, { align: 'right' });
        let oRatio = util.getPercentage(pData.order, pData.orderesti, 1);
        doc.text(`${oRatio}`, sX + pd + 90, sY + textH * 3, { align: 'right' });

        doc.text(`應交貨金額:`, sX + pd + 100, sY + textH * 1);
        doc.text(`已交貨金額:`, sX + pd + 100, sY + textH * 2);
        doc.text(`已交貨比例:`, sX + pd + 100, sY + textH * 3);
        doc.text(`${util.fv(pData.deliveryesti)}`, sX + pd + 140, sY + textH * 1, { align: 'right' });
        doc.text(`${util.fv(pData.delivery)}`, sX + pd + 140, sY + textH * 2, { align: 'right' });
        let dRatio = util.getPercentage(pData.delivery, pData.deliveryesti, 1);
        doc.text(`${dRatio}`, sX + pd + 140, sY + textH * 3, { align: 'right' });

        doc.text(`應驗收金額:`, sX + pd + 150, sY + textH * 1);
        doc.text(`已驗收金額:`, sX + pd + 150, sY + textH * 2);
        doc.text(`已驗收比例:`, sX + pd + 150, sY + textH * 3);
        doc.text(`${util.fv(pData.receivecheckesti)}`, sX + pd + 190, sY + textH * 1, { align: 'right' });
        doc.text(`${util.fv(pData.receivecheck)}`, sX + pd + 190, sY + textH * 2, { align: 'right' });
        let rRatio = util.getPercentage(pData.receivecheck, pData.receivecheckesti, 1);
        doc.text(`${rRatio}`, sX + pd + 190, sY + textH * 3, { align: 'right' });

        if (checkContent) {
            // 主要工程內容
            sY = sY + textH * 4.5;
            //let ltextH = 4;
            //console.log('sY = ', sY );
            //console.log('content = ', content);
            doc.setFontSize(12);
            doc.setTextColor('#0000FF');
            doc.text(`主要工程內容:`, sX + pd, sY);
            doc.setTextColor('#000000');
            doc.setDrawColor('#0000FF');
            doc.line(sX, sY + 1.5, sX + 32, sY + 1.5, 'S');
            doc.setDrawColor('#000000');
            sY = sY + textH * 0.5;

            doc.setFontSize(10);
            if (!util.isEmpty(content) && (content.workcontent != null)) {
                let wcontent = content.workcontent.split('\n');
                for (let it of wcontent) {
                    sY = sY + textH * 1.2;
                    if ((sY + 1) >= (drawSize.y2)) {
                        doc.addPage('a4', 'portrait');
                        // 內框
                        doc.rect(drawSize.x1, drawSize.y1, drawSize.x2, drawSize.y2);
                        // 外框
                        doc.rect(drawSize.x1 - 0.5, drawSize.y1 - 0.5, drawSize.x2 + 0.5 * 2, drawSize.y2 + 0.5 * 2);
                        sY = drawSize.y1 + textH;
                    }
                    doc.text(it, sX + pd + 2, sY);
                }
            }
        }


        // 本月工作重點
        if (checkContent) {
            sY = sY + textH * 1.5;
        } else {
            sY = sY + textH * 4.5;
        }
        
        doc.setFontSize(12);
        doc.setTextColor('#0000FF');
        doc.text(`本月工作重點:`, sX + pd, sY);
        doc.setTextColor('#000000');
        doc.setDrawColor('#0000FF');
        doc.line(sX, sY + 1.5, sX + 32, sY + 1.5, 'S');
        doc.setDrawColor('#000000');
        sY = sY + textH * 0.5;
        //console.log('monthwork: ', monthwork);

        if (!util.isEmpty(monthwork) && (monthwork.monthwork != null)) {
            let mwork = monthwork.monthwork.split('\n');
            doc.setFontSize(10);
            for (let it of mwork) {
                sY = sY + textH * 1.25;
                if ((sY + 1) >= (drawSize.y1 + drawSize.y2)) {
                    doc.addPage('a4', 'portrait');
                    // 內框
                    doc.rect(drawSize.x1, drawSize.y1, drawSize.x2, drawSize.y2);
                    // 外框
                    doc.rect(drawSize.x1 - 0.5, drawSize.y1 - 0.5, drawSize.x2 + 0.5 * 2, drawSize.y2 + 0.5 * 2);
                    sY = drawSize.y1 + textH * 1.5;
                    //console.log('sY := ', sY);
                }
                doc.text(it, sX + pd + 2, sY);
            }
        }


        //doc.text(`應請購金額: ${100}`, sX + pd, sY + textH * 1, { align: 'left', baseline: 'middle' });
        //doc.text(`已請購金額: ${100}`, sX + pd, sY + textH * 2, { align: 'left', baseline: 'middle' });



        //let charteY = ;
        
        //console.log('DrawColor = ', doc.getDrawColor());
        //doc.setDrawColor('#0000FF');  // Line Color
        //doc.setFillColor('#0000FF');  // Rect Fill Color


        //doc.rect(chartsX, chartsY, 10, 10, 'S')
        //chartsX = chartsX + 30;
        //doc.rect(chartsX, chartsY, 10, 10, 'F')
        //chartsX = chartsX + 30;
        //doc.rect(chartsX, chartsY, 10, 10, 'DF')
        
        // add page
        //doc.addPage('a4', 'portrait');
        //doc.text("Hello world !!", 20, 20);
    
        doc.save(`${b.jobno}-${b.jobname}.pdf`);
        
    };

    async monthworktotalreport(sym, b, s, ptc, tcr, es, smi, mi, orders, pData, mptotal) {
        let sdate = await dayjs(util.getsdate(s)).startOf('month').format('YYYY-MM-DD');
        //let fdate = await dayjs(util.getfdate(s)).add(4, 'month').endOf('month').format('YYYY-MM-DD');
        let fdate = await dayjs(util.getfdate(s)).endOf('month').format('YYYY-MM-DD');
        let diffm = util.listMonths(sdate, fdate);
        //console.log(diffm);
        let earliestYear = Math.min(...diffm.map(date => dayjs(date).year()));
        let earliestYearMonths = diffm.filter(date => dayjs(date).year() === earliestYear).length;
        let dmw = 184 / diffm.length;   // gantt chart max width: 184mm

        if (dmw * earliestYearMonths < 6) {
            let subm = Math.ceil(6 / dmw) - earliestYearMonths;
            sdate = dayjs(sdate).subtract(subm, 'month').startOf('month').format('YYYY-MM-DD');
        }

        let addm = Math.ceil(7 / dmw);
        fdate = dayjs(fdate).add(addm, 'month').endOf('month').format('YYYY-MM-DD');
        //console.log(sdate, fdate);
        
        let pLM = 5;
        let pUM = 5;
        let pd = 2;
        let A4Width = 297;
        let A4Height = 210;
    
        let fs10 = 10;
        let fs12 = 12;
        
        var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        let drawSize = {x1: pLM, y1: pUM, x2: A4Width - 2 * pLM, y2: A4Height - 2 * pUM - 15};
        doc.setLineWidth(0.1);
        // 內框
        doc.rect(drawSize.x1, drawSize.y1, drawSize.x2, drawSize.y2);
        // 外框
        doc.rect(drawSize.x1 - 0.5, drawSize.y1 - 0.5, drawSize.x2 + 0.5 * 2, drawSize.y2 + 0.5 * 2);

        doc.setFont('NotoSansTC');

        // Title
        let lineH = 12;
        let sX = drawSize.x1;
        let sY = drawSize.y1;

        doc.setFontSize(10);
        let curDate = dayjs(new Date());
        let year = parseInt(curDate.format('YYYY')) - 1911;
        let month = curDate.format('MM');
        let day = curDate.format('DD');
        doc.text(`列印日期: ${year}/${month}/${day}`, drawSize.x2 - 32, pUM + lineH / 3, { align: 'left', baseline: 'middle' });
        doc.text(`資料時間: ${parseInt(sym.slice(0, 4)) - 1911}年${sym.slice(4, 6)}月`, drawSize.x2 - 32, pUM + lineH / 3 * 2, { align: 'left', baseline: 'middle' });
        doc.setFontSize(12);
        //doc.text(`專案編號: ${b.jobno}`, sX + pd * 2, sY + lineH / 2, { align: 'left', baseline: 'middle' });
        doc.text(`專案編號: ${b.projectno}`, sX + pd * 2, sY + lineH / 2, { align: 'left', baseline: 'middle' });
        doc.setFontSize(16);
        doc.text(`${b.jobname}進度管制表`, A4Width / 2, sY + lineH / 2, { align: 'center', baseline: 'middle' });
        doc.setLineWidth(0.1);
        doc.line(sX, sY + lineH, A4Width - pLM, sY + lineH);

        let columnH = 12;
        let columnW = [10, 40, 10, 16, 16, 10];
        sY = sY + lineH;
        let chartsX = pLM + _.sum(_.slice(columnW, 0, 6));
        let chartsY = sY;

        // Draw Column
        let w = 0;
        w = _.sum(_.slice(columnW, 0, 1));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 2));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 3));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 4));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 5));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 6));
        doc.line(sX + w, sY, sX + w, sY + columnH);

        doc.line(sX, sY + columnH, A4Width - pLM, sY + columnH);
        
        // Column Name
        doc.setFontSize(10);
        doc.text(`項次`, sX + columnW[0] / 2, sY + columnH / 2, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 1));
        doc.text(`工作內容`, sX + w + columnW[1] / 2, sY + columnH / 2, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 2));
        doc.text(`權重`, sX + w + columnW[2] / 2, sY + columnH / 2, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 3));
        doc.text(`開始\n日期`, sX + w + columnW[3] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 4));
        doc.text(`完成\n日期`, sX + w + columnW[4] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 5));
        doc.text(`進度`, sX + w + columnW[5] / 2, sY + columnH / 2, { align: 'center', baseline: 'middle' });

        // Fill Table
        sY = sY + columnH;
        let i = 0;
        for (let it of s) {
            doc.setFontSize(10);
            // 項次
            doc.text(`${i + 1}`, sX + columnW[0] / 2, sY + lineH * i + lineH / 2, { align: 'center', baseline: 'middle' });
            // 工作內容
            w = _.sum(_.slice(columnW, 0, 1));
            doc.text(`${it.category}`, sX + w + columnW[1] / 2, sY + lineH * i + lineH / 2, { align: 'center', baseline: 'middle' });
            // 權重
            w = _.sum(_.slice(columnW, 0, 2));
            doc.text(`${it.ratio}`, sX + w + columnW[2] / 2, sY + lineH * i + lineH / 2, { align: 'center', baseline: 'middle' });
            doc.setFontSize(8);
            // 開始日期
            w = _.sum(_.slice(columnW, 0, 3));
            doc.text(`${util.fmtROCdate(it.esti_sdate)}`, sX + w + columnW[3] / 2, sY + lineH * i + lineH / 4 + 0.5, { align: 'center', baseline: 'middle' });
            doc.text(`${util.fmtROCdate(it.act_sdate)}`, sX + w + columnW[3] / 2, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'center', baseline: 'middle' });
            // 完成日期
            w = _.sum(_.slice(columnW, 0, 4));
            doc.text(`${util.fmtROCdate(it.esti_fdate)}`, sX + w + columnW[4] / 2, sY + lineH * i + lineH / 4 + 0.5, { align: 'center', baseline: 'middle' });
            doc.text(`${util.fmtROCdate(it.act_fdate)}`, sX + w + columnW[4] / 2, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'center', baseline: 'middle' });
            // 進度
            w = _.sum(_.slice(columnW, 0, 5));
            doc.text(`${it.estiprg}`, sX + w + columnW[5] / 2, sY + lineH * i + lineH / 4 + 0.5, { align: 'center', baseline: 'middle' });
            doc.text(`${it.actprg}`, sX + w + columnW[5] / 2, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'center', baseline: 'middle' });



            doc.line(sX, sY + lineH * (i + 1), A4Width - pLM, sY + lineH * (i + 1));
            i = i + 1;
        }        

        // Draw Column Line
        w = _.sum(_.slice(columnW, 0, 1));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 2));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 3));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 4));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 5));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 6));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);

        // Draw Gantt Chart
        let months = util.listMonths(sdate, fdate);
        let chartW = A4Width - pLM - chartsX;
        let chartH = sY + lineH * s.length - chartsY;
        let mw = chartW / months.length;
        doc.line(chartsX, chartsY + columnH / 2, chartsX + chartW, chartsY + columnH / 2);

        for (i = 0; i < months.length; i++) {
            doc.line(chartsX + (i + 1) * mw, chartsY + columnH / 2, chartsX + (i + 1) * mw, chartsY + chartH);
        }

        // TEXT YEAR
        let cYM = util.countMonthsByYear(months);
        w = 0;
        doc.setFontSize(8);
        for (let it of cYM) {
            //console.log(it);
            w = w + it.months;
            doc.line(chartsX + w * mw, chartsY, chartsX + w * mw, chartsY + columnH / 2);
            doc.text(`${it.year - 1911}`, chartsX + w * mw - (it.months / 2) * mw, chartsY + columnH / 4, { align: 'center', baseline: 'middle' });
        }

        // TEXT MONTH
        let monthTxt = util.extractMonths(months);
        i = 0;
        let fs = 0;
        for (let it of monthTxt) {
            //fs = it > 9 ? mw * 2.9 : mw * 3.5;
            fs = mw * 3.5;
            if (it > 9) { doc.setCharSpace(-0.2); } else { doc.setCharSpace(0); }
            fs = fs > 8 ? 8 : fs;
            doc.setFontSize(fs);
            doc.text(`${it}`, chartsX + i * mw + mw / 2, chartsY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
            i = i + 1;
        }
        doc.setCharSpace(0);

        // Draw Progress Bar
        i = 0;
        let mds = 0;
        let mde = 0;
        let bh = 2;
        doc.setFontSize(7);
        doc.setTextColor('#0000FF');
        for (let it of s) {
            mds = util.monthDiff(sdate, it.esti_sdate, sym);
            mde = util.monthDiff(sdate, it.esti_fdate, sym);

            doc.setFillColor('#91caff');
            doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 - bh / 2 + 0.5, (mde - mds) * mw, bh, 'DF');
            // 顯示預定進度數字
            //if (it.act_sdate) {
            //    doc.text(`${it.estiprg}`, chartsX + mds * mw + (mde - mds) * mw + 1, chartsY + columnH + (lineH * i) + lineH / 4 + 0.5, { baseline: 'middle' });
            //}
            
            mds = util.monthDiff(sdate, it.act_sdate, sym);
            mde = util.monthDiff(sdate, it.act_fdate, sym);
            doc.setFillColor('#ff4d4f');
            
            if (it.act_sdate) {
                if ((chartsX + mds * mw + (mde - mds) * mw) >= drawSize.x2) {
                    doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 * 3 - bh / 2 - 0.5, A4Width - pLM - (chartsX + mds * mw), bh, 'DF');
                    // 顯示實際進度數字
                    //doc.text(`${it.actprg}`, A4Width - pLM - 1, chartsY + columnH + (lineH * i) + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });
                } else {
                    doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 * 3 - bh / 2 - 0.5, (mde - mds) * mw, bh, 'DF');
                    // 顯示實際進度數字
                    //doc.text(`${it.actprg}`, chartsX + mds * mw + (mde - mds) * mw + 1, chartsY + columnH + (lineH * i) + lineH / 4 * 3 - 0.5, { baseline: 'middle' });
                }                             
                //doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 * 3 - bh / 2 - 0.5, (mde - mds) * mw, bh, 'DF');
                //doc.text(`${it.actprg}`, chartsX + mds * mw + (mde - mds) * mw + 1, chartsY + columnH + (lineH * i) + lineH / 4 * 3 - 0.5, { baseline: 'middle' });
            }

            i = i + 1;
        }
        doc.setTextColor('#000000');

        doc.setFillColor('#000000');
        doc.setFontSize(10);
        let textH = 5;        
        sY = sY + s.length * columnH + columnH * 0.2;
        doc.text(`一、預定進度與實際進度:`, sX + pd * 2, sY + textH * 1);
        doc.text(`計畫總進度:  ${util.estiprg_prj(s)}%`, sX + pd * 2 + 50, sY + textH * 1);
        doc.text(`實際總進度:  ${util.actprg_prj(s)}%`, sX + pd * 2 + 100, sY + textH * 1);
        doc.text(`計畫開始日期:  ${util.fmtROCdate(util.getestisdate(s))}`, sX + pd * 2 + 50, sY + textH * 2);
        doc.text(`計畫完成日期:  ${util.fmtROCdate(util.getestifdate(s))}`, sX + pd * 2 + 100, sY + textH * 2);
        doc.text(`實際開始日期:  ${util.fmtROCdate(util.getactsdate(s))}`, sX + pd * 2 + 50, sY + textH * 3);
        doc.text(`實際完成日期:  ${util.fmtROCdate(util.getactfdate(s))}`, sX + pd * 2 + 100, sY + textH * 3);

        sY = sY + textH * 4.5;
        doc.text(`二、說明:`, sX + pd * 2, sY);
        
        if (!util.isEmpty(mptotal) && (mptotal.isoprogressdescription != null)) {
            //let mwork = monthwork.monthwork.split('\n');
            let description = mptotal.isoprogressdescription.split('\n');
            doc.setFontSize(10);
            for (let it of description) {
                if ((sY + 1) >= (drawSize.y1 + drawSize.y2)) {
                    doc.addPage('a4', 'landscape');
                    // 內框
                    doc.rect(drawSize.x1, drawSize.y1, drawSize.x2, drawSize.y2);
                    // 外框
                    doc.rect(drawSize.x1 - 0.5, drawSize.y1 - 0.5, drawSize.x2 + 0.5 * 2, drawSize.y2 + 0.5 * 2);
                    sY = drawSize.y1 + textH * 1.5;
                    //console.log('sY := ', sY);
                }
                doc.text(it, sX + pd + 2 + 50, sY);
                sY = sY + textH;
            }
        }
        
        // 簽核欄位
        doc.setFontSize(12);
        let scolumnW = (drawSize.x2 - drawSize.x1) / 3;
        let stextW = 25;
        sX = drawSize.x1 + pd * 2;
        sY = pUM + drawSize.y2 + textH * 2.5;

        doc.text(`主辦工程師:`, sX, sY);
        doc.line(sX + stextW, sY + 2, sX + stextW + 60, sY + 2);
        doc.text(`專案工程師:`, sX + scolumnW * 1, sY);
        doc.line(sX + stextW + scolumnW * 1, sY + 2, sX + stextW + scolumnW * 1 + 60, sY + 2);
        doc.text(`二級主管:`, sX + scolumnW * 2, sY);
        doc.line(sX + stextW - 5 + scolumnW * 2, sY + 2, sX + stextW + scolumnW * 2 + 60, sY + 2);

        doc.save(`'${b.jobno}-工程進度管制表-'${sym}.pdf`);
    };


    async projectworkreport(sym, memberInfo, b, s, es, smi, pData, orders, mptotal) {
        let sdate = await dayjs(util.getsdate(s)).startOf('month').format('YYYY-MM-DD');
        //let fdate = await dayjs(util.getfdate(s)).add(4, 'month').endOf('month').format('YYYY-MM-DD');
        let fdate = await dayjs(util.getfdate(s)).endOf('month').format('YYYY-MM-DD');
        let diffm = util.listMonths(sdate, fdate);
        //console.log(diffm);
        let earliestYear = Math.min(...diffm.map(date => dayjs(date).year()));
        let earliestYearMonths = diffm.filter(date => dayjs(date).year() === earliestYear).length;
        let dmw = 174 / diffm.length;   // gantt chart max width: 174mm

        if (dmw * earliestYearMonths < 6) {
            let subm = Math.ceil(6 / dmw) - earliestYearMonths;
            sdate = dayjs(sdate).subtract(subm, 'month').startOf('month').format('YYYY-MM-DD');
        }

        let addm = Math.ceil(7 / dmw);
        fdate = dayjs(fdate).add(addm, 'month').endOf('month').format('YYYY-MM-DD');
        //console.log(sdate, fdate);
        
        let pLM = 5;
        let pUM = 5;
        let pd = 2;
        let A4Width = 297;
        let A4Height = 210;

        var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        let drawSize = {x1: pLM, y1: pUM, x2: A4Width - 2 * pLM, y2: A4Height - 2 * pUM};
        doc.setLineWidth(0.1);
        // 內框
        doc.rect(drawSize.x1, drawSize.y1, drawSize.x2, drawSize.y2);
        // 外框
        doc.rect(drawSize.x1 - 0.5, drawSize.y1 - 0.5, drawSize.x2 + 0.5 * 2, drawSize.y2 + 0.5 * 2);
        doc.setFont('NotoSansTC');

        // Title
        let lineH = 12;
        let sX = drawSize.x1;
        let sY = drawSize.y1;

        doc.setFontSize(10);
        let curDate = dayjs(new Date());
        let year = parseInt(curDate.format('YYYY')) - 1911;
        let month = curDate.format('MM');
        let day = curDate.format('DD');
        //doc.text(`列印日期: ${year}/${month}/${day}`, drawSize.x2 - 32, pUM + lineH / 3, { align: 'left', baseline: 'middle' });
        doc.text(`資料時間: ${parseInt(sym.slice(0, 4)) - 1911}年${sym.slice(4, 6)}月`, drawSize.x2 - 30, pUM + lineH / 3 * 1, { align: 'left', baseline: 'middle' });
        doc.setFontSize(16);
        doc.text(`專案報告:`, sX + pd * 2, sY + lineH / 2, { align: 'left', baseline: 'middle' });
        doc.setFontSize(16);
        doc.text(`${b.jobname}`, A4Width / 2, sY + lineH / 2, { align: 'center', baseline: 'middle' });
        doc.setLineWidth(0.1);
        doc.line(sX, sY + lineH, A4Width - pLM, sY + lineH);

        // Left Column: 專案摘要
        sX = drawSize.x1 + 10;
        sY = sY + lineH;
        doc.setFontSize(10);
        let textH = 5;

        doc.text(`專案\n摘要`, drawSize.x1 + 10 / 2, sY + textH * 5.5 / 2 - textH / 2, { align: 'center', baseline: 'middle' });
        doc.line(sX, sY, sX, sY + textH * 5.5);
        doc.line(drawSize.x1, sY + textH * 5.5, drawSize.x1 + drawSize.x2, sY + textH * 5.5);

        doc.text(`申請單位:`, sX + pd, sY + textH * 1);
        doc.text(`預算類別:`, sX + pd, sY + textH * 2);
        doc.text(`預算年度:`, sX + pd, sY + textH * 3);
        doc.text(`預算編號:`, sX + pd, sY + textH * 4);
        doc.text(`工令編號:`, sX + pd, sY + textH * 5);
        //doc.text(`預計總進度:`, sX + pd, sY + textH * 6);
        //doc.text(`實際總進度:`, sX + pd, sY + textH * 7);
        sX = drawSize.x1 + 60;
        // 申請單位
        doc.text(`${b.appdept}`, sX + pd, sY + textH * 1, { align: 'right' });
        // 預算類別
        doc.text(`${b.jobtype}`, sX + pd, sY + textH * 2, { align: 'right' });
        // 預算年度
        doc.text(`${b.budgetyearst} - ${b.budgetyearsp}`, sX + pd, sY + textH * 3, { align: 'right' });
        // 預算編號
        let approvalno; 
        if (!util.isEmpty(b.approvalno)) {
            approvalno = b.approvalno.split(',');
            if (approvalno.length > 1) {
                doc.text(`${approvalno[0]}, ...`, sX + pd, sY + textH * 4, { align: 'right' });
            } else {
                doc.text(`${approvalno[0]}`, sX + pd, sY + textH * 4, { align: 'right' });
            }
        }

        //doc.text(`${approvalno[0]}`, sX + pd, sY + textH * 4, { align: 'right' });
        // 工令編號
        let joborderno;
        if (!util.isEmpty(b.joborderno)) {
            joborderno = b.joborderno.split(',');
            if (joborderno.length > 1) {
                doc.text(`${joborderno[0]}, ...`, sX + pd, sY + textH * 5, { align: 'right' });
            } else {
                doc.text(`${joborderno[0]}`, sX + pd, sY + textH * 5, { align: 'right' });
            }
        }
        

        //doc.text(`${b.joborderno}`, sX + pd, sY + textH * 5, { align: 'right' });
        // 預定總進度
        //let estiprg_prj = util.estiprg_prj(s);
        //doc.text(`${estiprg_prj}%`, sX + pd, sY + textH * 6, { align: 'right' });
        // 實際總進度
        //let actprg_prj = util.actprg_prj(s);
        //doc.text(`${actprg_prj}%`, sX + pd, sY + textH * 7, { align: 'right' });

        sX = sX + 10;
        doc.text(`工程總預算:`, sX + pd, sY + textH * 1);
        doc.text(`儀電總預算:`, sX + pd, sY + textH * 2);
        doc.text(`${memberInfo.team}預算:`, sX + pd, sY + textH * 3);
        //doc.text(`${memberInfo.team}累計費用:`, sX + pd, sY + textH * 4);
        doc.text(`主辦工程師:`, sX + pd, sY + textH * 4);

        //doc.text(`預計總進度:`, sX + pd, sY + textH * 1);
        //doc.text(`實際總進度:`, sX + pd, sY + textH * 2);
        sX = sX + 50;
        doc.text(`${b.totalbudget}`, sX + pd, sY + textH * 1, { align: 'right' });
        doc.text(`${b.electricalbudget}`, sX + pd, sY + textH * 2, { align: 'right' });
        doc.text(`${b.y6tbudget}`, sX + pd, sY + textH * 3, { align: 'right' });
        //doc.text(`${util.fv(pData.order)}`, sX + pd, sY + textH * 4, { align: 'right' });
        doc.text(`${memberInfo.leader}`, sX + pd, sY + textH * 4, { align: 'right' });



        // Draw Grid Column Line
        sX = sX + 10;
        doc.line(sX, sY, sX, sY + textH * 5.5);
        let gridH = textH * 5.5;
        let gridW = A4Width - pLM - sX;
        let gridRH = gridH / 5;
        let gridRW = gridW / 6;
        doc.line(sX, sY + gridRH * 1, A4Width - pLM, sY + gridRH * 1);
        doc.line(sX, sY + gridRH * 2, A4Width - pLM, sY + gridRH * 2);
        doc.line(sX, sY + gridRH * 3, A4Width - pLM, sY + gridRH * 3);
        doc.line(sX, sY + gridRH * 4, A4Width - pLM, sY + gridRH * 4);
        //sX = sX + 20;

        //doc.text(``, sX + pd, sY + textH * 3);
        //doc.text(``, sX + pd, sY + textH * 4);
        //doc.text(``, sX + pd, sY + textH * 5);

        //sX = sX + 50;
        // 預定總進度
        let estiprg_prj = util.estiprg_prj(s);
        //doc.text(`${estiprg_prj}%`, sX + pd, sY + gridRH * 0.5, { align: 'right', baseline: 'middle' });
        // 實際總進度
        let actprg_prj = util.actprg_prj(s);
        //doc.text(`${actprg_prj}%`, sX + pd, sY + gridRH * 1.5, { align: 'right', baseline: 'middle' });
        doc.text(`預定總進度: ${estiprg_prj}%`, sX + pd, sY + gridRH * 0.5, { align: 'left', baseline: 'middle' });
        doc.text(`實際總進度: ${actprg_prj}%`, sX + pd + gridRW * 3, sY + gridRH * 0.5, { align: 'left', baseline: 'middle' });


        doc.text(`設計圖數`, sX + gridRW / 2, sY + gridRH * 2.5, { align: 'center', baseline: 'middle' });
        doc.text(`審查圖數`, sX + gridRW / 2, sY + gridRH * 3.5, { align: 'center', baseline: 'middle' });
        doc.text(`工時`, sX + gridRW / 2, sY + gridRH * 4.5, { align: 'center', baseline: 'middle' });
        //doc.text(`設計工時`, sX + gridRW / 2, sY + gridRH * 3.5, { align: 'center', baseline: 'middle' });
        //doc.text(`審查工時`, sX + gridRW / 2, sY + gridRH * 4.5, { align: 'center', baseline: 'middle' });
        sX = sX + gridRW;
        doc.line(sX, sY + gridRH * 1 , sX, sY + textH * 5.5);
        
        doc.text(`預定`, sX + gridRW / 2, sY + gridRH * 1.5, { align: 'center', baseline: 'middle' });
        let estidwg_bydts = util.estidwg_bydt(es, ['自']);
        let estidwg_bydtt = util.estidwg_bydt(es, ['委', '']);
        //console.log(`預定圖數(自): ${estidwg_bydts}, 預定圖數(委): ${estidwg_bydtt}`);

        let accudwg_bydts = util.accudwg_bydt(sym, smi, ['自']);
        let accudwg_bydtt = util.accudwg_bydt(sym, smi, ['委', '']);        
        //console.log(`實際圖數(自): ${accudwg_bydts}, 實際圖數(委): ${accudwg_bydtt}`);

        let estimh_bydts = util.estimh_bydt(es, ['自']);
        let estimh_bydtt = util.estimh_bydt(es, ['委', '']);
        //console.log(`預定工時(自): ${estimh_bydts}, 預定工時(委): ${estimh_bydtt}`);

        let accumh_bydts = util.accumh_bydt(sym, smi, ['自']);
        let accumh_bydtt = util.accumh_bydt(sym, smi, ['委', '']);        
        //console.log(`實際工時(自): ${accumh_bydts}, 實際工時(委): ${accumh_bydtt}`);
        
        doc.text(`${util.fv(estidwg_bydts)}`, sX + gridRW - pd , sY + gridRH * 2.5, { align: 'right', baseline: 'middle' });
        doc.text(`${util.fv(estidwg_bydtt)}`, sX + gridRW - pd , sY + gridRH * 3.5, { align: 'right', baseline: 'middle' });
        doc.text(`${util.fv(estimh_bydts + estimh_bydtt)}`, sX + gridRW - pd , sY + gridRH * 4.5, { align: 'right', baseline: 'middle' });
        //doc.text(`${util.fv(estimh_bydts)}`, sX + gridRW - pd , sY + gridRH * 3.5, { align: 'right', baseline: 'middle' });
        //doc.text(`${util.fv(estimh_bydtt)}`, sX + gridRW - pd , sY + gridRH * 4.5, { align: 'right', baseline: 'middle' });
        sX = sX + gridRW;
        doc.line(sX, sY + gridRH * 1, sX, sY + textH * 5.5);

        doc.text(`實際`, sX + gridRW / 2, sY + gridRH * 1.5, { align: 'center', baseline: 'middle' });
        doc.text(`${util.fv(accudwg_bydts)}`, sX + gridRW - pd , sY + gridRH * 2.5, { align: 'right', baseline: 'middle' });
        doc.text(`${util.fv(accudwg_bydtt)}`, sX + gridRW - pd , sY + gridRH * 3.5, { align: 'right', baseline: 'middle' });
        doc.text(`${util.fv(accumh_bydts + accumh_bydtt)}`, sX + gridRW - pd , sY + gridRH * 4.5, { align: 'right', baseline: 'middle' });
        //doc.text(`${util.fv(accumh_bydts)}`, sX + gridRW - pd , sY + gridRH * 3.5, { align: 'right', baseline: 'middle' });
        //doc.text(`${util.fv(accumh_bydtt)}`, sX + gridRW - pd , sY + gridRH * 4.5, { align: 'right', baseline: 'middle' });
        sX = sX + gridRW;
        doc.line(sX, sY + gridRH * 1, sX, sY + textH * 5.5);

        //console.log(orders);
        let estiPurchase = _.reduce(orders, (sum, item) => {
            if (item.category < 5) {
                return sum + parseInt(util.pv(item.estimateamount));
            } else {
                return sum;
            }
        }, 0);
        
        let accuPurchase = _.reduce(orders, (sum, item) => {
            if (item.category < 5) {
                return sum + parseInt(util.pv(item.amount));
            } else {
                return sum;
            }
        }, 0);

        let estiTurnkey = _.reduce(orders, (sum, item) => {
            if (item.category >= 5) {
                return sum + parseInt(util.pv(item.estimateamount));
            } else {
                return sum;
            }
        }, 0);

        let accuTurnkey = _.reduce(orders, (sum, item) => {
            if (item.category >= 5) {
                return sum + parseInt(util.pv(item.amount));
            } else {
                return sum;
            }
        }, 0);
        //console.log(`預定請購:${estiPurchase}, 實際請購:${accuPurchase}, 預訂外包:${estiTurnkey}, 實際外包:${accuTurnkey}`);

        doc.text(`採購金額`, sX + gridRW / 2, sY + gridRH * 2.5, { align: 'center', baseline: 'middle' });
        doc.text(`外包金額`, sX + gridRW / 2, sY + gridRH * 3.5, { align: 'center', baseline: 'middle' });
        doc.text(`總金額`, sX + gridRW / 2, sY + gridRH * 4.5, { align: 'center', baseline: 'middle' });
        
        sX = sX + gridRW;
        doc.line(sX, sY + gridRH * 1, sX, sY + textH * 5.5);

        //gridRW = (A4Width - pLM - sX) / 2;
        doc.text(`預定(仟)`, sX + gridRW / 2, sY + gridRH * 1.5, { align: 'center', baseline: 'middle' });
        doc.text(`${util.fv(Math.round(estiPurchase / 1000))}`, sX + gridRW - pd , sY + gridRH * 2.5, { align: 'right', baseline: 'middle' });
        doc.text(`${util.fv(Math.round(estiTurnkey / 1000))}`, sX + gridRW - pd , sY + gridRH * 3.5, { align: 'right', baseline: 'middle' });
        doc.text(`${util.fv(Math.round((estiPurchase + estiTurnkey) / 1000))}`, sX + gridRW - pd , sY + gridRH * 4.5, { align: 'right', baseline: 'middle' });

        sX = sX + gridRW;
        doc.line(sX, sY + gridRH * 1, sX, sY + textH * 5.5);
        doc.text(`實際(仟)`, sX + gridRW / 2, sY + gridRH * 1.5, { align: 'center', baseline: 'middle' });
        doc.text(`${util.fv(Math.round(accuPurchase / 1000))}`, sX + gridRW - pd , sY + gridRH * 2.5, { align: 'right', baseline: 'middle' });
        doc.text(`${util.fv(Math.round(accuTurnkey / 1000))}`, sX + gridRW - pd , sY + gridRH * 3.5, { align: 'right', baseline: 'middle' });
        doc.text(`${util.fv(Math.round((accuPurchase + accuTurnkey) / 1000))}`, sX + gridRW - pd , sY + gridRH * 4.5, { align: 'right', baseline: 'middle' });

        //doc.line(sX, sY + gridRH * 1, A4Width - pLM, sY + gridRH * 1);
        //doc.line(sX, sY + gridRH * 2, A4Width - pLM, sY + gridRH * 2);
        //doc.line(sX, sY + gridRH * 3, A4Width - pLM, sY + gridRH * 3);

        //sX = drawSize.x1 + 65;
        //doc.line(sX, sY, sX, sY + textH * 7.5);
        //doc.line(drawSize.x1, sY + textH * 7.5, drawSize.x2, sY + textH * 7.5);

        // 圖數工時
        
        // Gantt Chart
        sX = drawSize.x1 + 10;
        sY = sY + textH * 5.5;
        let columnH = 12;
        let columnW = [17, 15, 15, 10, 10, 10, 10, 8, 8];
        let chartsX = drawSize.x1 + 10 + _.sum(_.slice(columnW, 0, 9));
        let chartsY = sY;

        // 表格欄位
        let w = 0;
        //w = _.sum(_.slice(columnW, 0, 1));
        //doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 1));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 2));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 3));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 4));
        doc.line(sX + w, sY + columnH / 2, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 5));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 6));
        doc.line(sX + w, sY + columnH / 2, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 7));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 8));
        doc.line(sX + w, sY, sX + w, sY + columnH);
        w = _.sum(_.slice(columnW, 0, 9));
        doc.line(sX + w, sY, sX + w, sY + columnH);

        doc.line(sX + _.sum(_.slice(columnW, 0, 3)), sY + columnH / 2, sX + _.sum(_.slice(columnW, 0, 7)), sY + columnH / 2);
        doc.line(sX, sY + columnH, A4Width - pLM, sY + columnH);

        doc.setFontSize(10);
        //doc.text(`項\n次`, sX + columnW[0] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });
        //w = _.sum(_.slice(columnW, 0, 1));
        doc.text(`工作內容`, sX + columnW[0] / 2, sY + columnH / 2, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 1));
        doc.text(`開始\n日期`, sX + w + columnW[1] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 2));
        doc.text(`完成\n日期`, sX + w + columnW[2] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 3));
        doc.text(`設計`, sX + w + (columnW[3] + columnW[4]) / 2, sY + columnH / 4, { align: 'center', baseline: 'middle' });
        doc.text(`圖數`, sX + w + columnW[3] / 2, sY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 4));
        doc.text(`工時`, sX + w + columnW[4] / 2, sY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 5));
        doc.text(`審查`, sX + w + (columnW[5] + columnW[7]) / 2, sY + columnH / 4, { align: 'center', baseline: 'middle' });
        doc.text(`圖數`, sX + w + columnW[5] / 2, sY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 6));
        doc.text(`工時`, sX + w + columnW[6] / 2, sY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 7));
        doc.text(`比\n重`, sX + w + columnW[7] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });
        w = _.sum(_.slice(columnW, 0, 8));
        doc.text(`進\n度`, sX + w + columnW[8] / 2, sY + columnH / 3, { align: 'center', baseline: 'middle' });

        // 設計/審查 圖數/工時
        doc.setFontSize(10);
        sX = drawSize.x1 + 10;
        sY = sY + columnH;
        let i = 0;
        lineH = 10;
        for (let it of s) {
            //doc.setFontSize(10);
            // 項次
            //doc.text(`${i + 1}`, sX + columnW[0] / 2, sY + lineH * i + lineH / 2, { align: 'center', baseline: 'middle' });
            // 工作內容
            //w = _.sum(_.slice(columnW, 0, 1));
            doc.text(`${it.category}`, sX + columnW[0] / 2, sY + lineH * i + lineH / 2, { align: 'center', baseline: 'middle' });
            
            doc.setFontSize(8);
            // 開始日期
            w = _.sum(_.slice(columnW, 0, 1));
            doc.text(`${util.fmtROCdate(it.esti_sdate)}`, sX + w + columnW[1] / 2, sY + lineH * i + lineH / 4 + 0.5, { align: 'center', baseline: 'middle' });
            doc.text(`${util.fmtROCdate(it.act_sdate)}`, sX + w + columnW[1] / 2, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'center', baseline: 'middle' });
            // 完成日期
            w = _.sum(_.slice(columnW, 0, 2));
            doc.text(`${util.fmtROCdate(it.esti_fdate)}`, sX + w + columnW[2] / 2, sY + lineH * i + lineH / 4 + 0.5, { align: 'center', baseline: 'middle' });
            doc.text(`${util.fmtROCdate(it.act_fdate)}`, sX + w + columnW[2] / 2, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'center', baseline: 'middle' });
            // 設計圖數
            w = _.sum(_.slice(columnW, 0, 4));
            doc.text(`${util.estidwg_byjtdt(it.jobtype, es, ['自'])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 + 0.5, { align: 'right', baseline: 'middle' });
            doc.text(`${util.accudwg_byjtdt(sym, it.jobtype, smi, ['自'])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });

            // 設計工時
            w = _.sum(_.slice(columnW, 0, 5));
            doc.text(`${util.estimh_byjtdt(it.jobtype, es, ['自'])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 + 0.5, { align: 'right', baseline: 'middle' });
            doc.text(`${util.accumh_byjtdt(sym, it.jobtype, smi, ['自'])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });

            // 審查圖數
            w = _.sum(_.slice(columnW, 0, 6));
            doc.text(`${util.estidwg_byjtdt(it.jobtype, es, ['委', ''])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 + 0.5, { align: 'right', baseline: 'middle' });
            doc.text(`${util.accudwg_byjtdt(sym, it.jobtype, smi, ['委', ''])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });

            // 審查工時
            w = _.sum(_.slice(columnW, 0, 7));
            doc.text(`${util.estimh_byjtdt(it.jobtype, es, ['委', ''])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 + 0.5, { align: 'right', baseline: 'middle' });
            doc.text(`${util.accumh_byjtdt(sym, it.jobtype, smi, ['委', ''])}`, sX + w - 1.5, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });

            // 比重
            w = _.sum(_.slice(columnW, 0, 7));
            doc.text(`${it.ratio}`, sX + w + columnW[7] / 2, sY + lineH * i + lineH / 2, { align: 'center', baseline: 'middle' });

            // 進度
            w = _.sum(_.slice(columnW, 0, 9));
            //doc.text(`${it.ratio}`, sX + w + columnW[8] / 2, sY + lineH * i + lineH / 2, { align: 'center', baseline: 'middle' });
            doc.text(`${it.estiprg}`, sX + w - 0.5, sY + lineH * i + lineH / 4 + 0.5, { align: 'right', baseline: 'middle' });
            doc.text(`${it.actprg}`, sX + w - 0.5, sY + lineH * i + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });

            //doc.text(`${it.category}`, sX + w + columnW[1] / 2, sY + lineH * (i + 1) - lineH / 2 + 1, { align: 'center' });

            doc.line(sX, sY + lineH * (i + 1), A4Width - pLM, sY + lineH * (i + 1));
            i = i + 1;
        }
        // Draw Column line

        doc.line(sX, sY - columnH, sX, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 1));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 2));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 3));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 4));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 5));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 6));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 7));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 8));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        w = _.sum(_.slice(columnW, 0, 9));
        doc.line(sX + w, sY, sX + w, sY + lineH * s.length);
        doc.line(pLM, sY + lineH * s.length, sX, sY + lineH * s.length);

        doc.setFontSize(10);
        doc.text(`專案\n時程`, drawSize.x1 + 10 / 2, sY - columnH + lineH * s.length / 2 + textH / 2, { align: 'center', baseline: 'middle' });

        // Draw Gantt Chart
        let months = util.listMonths(sdate, fdate);
        let chartW = A4Width - pLM - chartsX;
        let chartH = sY + lineH * s.length - chartsY;
        let mw = chartW / months.length;

        doc.line(chartsX, chartsY + columnH / 2, chartsX + chartW, chartsY + columnH / 2);
        for (let i = 0; i < months.length; i++) {
            doc.line(chartsX + (i + 1) * mw, chartsY + columnH / 2, chartsX + (i + 1) * mw, chartsY + chartH);
        }

        // TEXT YEAR
        let cYM = util.countMonthsByYear(months);
        w = 0;
        doc.setFontSize(8);
        for (let it of cYM) {
            //console.log(it);
            w = w + it.months;
            doc.line(chartsX + w * mw, chartsY, chartsX + w * mw, chartsY + columnH / 2);
            doc.text(`${it.year - 1911}`, chartsX + w * mw - (it.months / 2) * mw, chartsY + columnH / 4, { align: 'center', baseline: 'middle' });
        }        

        // TEXT MONTH
        let monthTxt = util.extractMonths(months);
        i = 0;
        let fs = 0;
        for (let it of monthTxt) {
            //fs = it > 9 ? mw * 2.9 : mw * 3.5;
            fs = mw * 3.5;
            if (it > 9) { doc.setCharSpace(-0.25); } else { doc.setCharSpace(0); }
            fs = fs > 7 ? 7 : fs;
            doc.setFontSize(fs);
            doc.text(`${it}`, chartsX + i * mw + mw / 2, chartsY + columnH / 4 * 3, { align: 'center', baseline: 'middle' });
            i = i + 1;
        }
        doc.setCharSpace(0);

        // Draw Progress Bar
        i = 0;
        let mds = 0;
        let mde = 0;
        let bh = 1.5;
        doc.setFontSize(7);
        doc.setTextColor('#0000FF');
        for (let it of s) {
            //console.log(util.monthDiff(sdate, it.esti_sdate, sym), util.monthDiff(sdate, it.esti_fdate, sym));
            //console.log(util.monthDiff(sdate, it.act_sdate, sym), util.monthDiff(sdate, it.act_fdate, sym));
            
            mds = util.monthDiff(sdate, it.esti_sdate, sym);
            mde = util.monthDiff(sdate, it.esti_fdate, sym);

            //console.log(`esti mds: ${mds}, mde: ${mde}, sdate: ${sdate}, e-sdate: ${it.esti_sdate}, e-fdate: ${it.esti_fdate}, ${sym}`);
            //doc.setFillColor('#FFFFFF');
            doc.setFillColor('#91caff');
            doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 - bh / 2 + 0.5, (mde - mds) * mw, bh, 'DF');
            // 顯示預定進度數字
            //if (it.act_sdate) {
            //    doc.text(`${it.estiprg}`, chartsX + mds * mw + (mde - mds) * mw + 1, chartsY + columnH + (lineH * i) + lineH / 4 + 0.5, { baseline: 'middle' });
            //}
            
            
            mds = util.monthDiff(sdate, it.act_sdate, sym);
            mde = util.monthDiff(sdate, it.act_fdate, sym);
            //console.log(`act mds: ${mds}, mde: ${mde}, sdate: ${sdate}, a-sdate: ${it.act_sdate}, a-fdate: ${it.act_fdate}, ${sym}`);
            //doc.setFillColor('#C0C0C0');
            doc.setFillColor('#ff4d4f');
            
            if (it.act_sdate) {

                if ((chartsX + mds * mw + (mde - mds) * mw) >= drawSize.x2) {
                    doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 * 3 - bh / 2 - 0.5, A4Width - pLM - (chartsX + mds * mw), bh, 'DF');
                    // 顯示實際進度數字
                    //doc.text(`${it.actprg}`, A4Width - pLM - 1, chartsY + columnH + (lineH * i) + lineH / 4 * 3 - 0.5, { align: 'right', baseline: 'middle' });
                } else {
                    doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 * 3 - bh / 2 - 0.5, (mde - mds) * mw, bh, 'DF');
                    // 顯示實際進度數字
                    //doc.text(`${it.actprg}`, chartsX + mds * mw + (mde - mds) * mw + 1, chartsY + columnH + (lineH * i) + lineH / 4 * 3 - 0.5, { baseline: 'middle' });
                }
                //doc.rect(chartsX + mds * mw , chartsY + columnH + (lineH * i) + lineH / 4 * 3 - bh / 2 - 0.5, (mde - mds) * mw, bh, 'DF');
                //doc.text(`${it.actprg}`, chartsX + mds * mw + (mde - mds) * mw + 1, chartsY + columnH + (lineH * i) + lineH / 4 * 3 - 0.5, { baseline: 'middle' });
            }

            i = i + 1;
        }
        doc.setTextColor('#000000');
        
        // 專案進行情形
        doc.setFontSize(10);
        sY = sY + lineH * s.length;
        let dh = drawSize.y2 - sY;
        

        //doc.rect(sX, sY + lineH * s.length, 2, 2);
        //doc.rect(sX, drawSize.y2, 2, 2);
        doc.line(sX, sY, sX, drawSize.y1 + drawSize.y2);
        doc.text(`專案\n進行\n情形`, drawSize.x1 + 10 / 2, sY + dh / 2 - textH / 2, { align: 'center', baseline: 'middle' });

        //doc.setFontSize(12);

        if (!util.isEmpty(mptotal) && (mptotal.worksummaried != null)) {
            let worksummaried = mptotal.worksummaried.split('\n');
            doc.setFontSize(10);
            //doc.text('test', sX + pd + 2, sY);
            
            for (let it of worksummaried) {
                sY = sY + textH * 1.25;
                if ((sY + 1) >= (drawSize.y1 + drawSize.y2)) {
                    doc.addPage('a4', 'landspace');
                    // 內框
                    doc.rect(drawSize.x1, drawSize.y1, drawSize.x2, drawSize.y2);
                    // 外框
                    doc.rect(drawSize.x1 - 0.5, drawSize.y1 - 0.5, drawSize.x2 + 0.5 * 2, drawSize.y2 + 0.5 * 2);
                    
                    doc.line(drawSize.x1 + 10, drawSize.y1, drawSize.x1 + 10, drawSize.y1 + drawSize.y2);
                    doc.text(`專案\n進行\n情形`, drawSize.x1 + 10 / 2, drawSize.y1 + drawSize.y2 / 2, { align: 'center', baseline: 'middle' });
                                
                    sY = drawSize.y1 + textH * 1.5;
                    //console.log('sY := ', sY);
                }
                doc.text(it, sX + pd + 2, sY);
            }
            
        }


        doc.save(`${b.jobno}-專案報告-${sym}.pdf`);

    };
    
/*
    async getBy(param) {
        //for(var key in param) {
        //    console.log(key, param[key]);
        //}
        let data = await axios
            .get('/api/uteam/getby', {
                params: param
            })
            .then(res => {
                return res.data;
            });
        return trimJSON(data);
    };

    async create(input) {
        let data = await axios
            .post('/api/uteam/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;
    }

    async update(input) {
        let data = await axios
            .put('/api/uteam/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;       
    }

    async remove(input) {
        let data = await axios
            .delete('/api/uteam/', {
                data: input
            })
            .then(res => {
                return res.data;
            });
        return data;       
    }
*/
}
