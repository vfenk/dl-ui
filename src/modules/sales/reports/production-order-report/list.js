import {inject} from 'aurelia-framework';
import {Service} from "./service";
import {Router} from 'aurelia-router';

@inject(Router, Service)
export class List {
    constructor(router, service) {

        this.service = service;
        this.router = router;
        this.today = new Date();
    }
    dateFrom = null;
    dateTo = null;
    salesContractNo = '';
    orderNo = '';
    orderType = null;
    processType = null;
    buyer = null;
    account = null;
    filterAccount = {};

    activate() {
        // var dataFilter = (new RegExp("penjualan", "i"));
        this.filterAccount = {
            "roles" : {
                "$elemMatch" : { 
                    "permissions" : {
                        "$elemMatch" : { 
                            "unit.name" : "PENJUALAN FINISHING & PRINTING"
                            // {
                            //     "$regex" : (new RegExp("penjualan", "i"))
                            // }
                        }
                    }
                }
            }
        };
    }

    reset() {
        this.dateFrom = null;
        this.dateTo = null;
        this.salesContractNo = '';
        this.orderNo = '';
        this.orderType = null;
        this.processType = null;
        this.buyer = null;
        this.account = null;
        this.data = [];
    }
    
    
    searching() {
        var data = [];
        this.service.getReport(this.dateFrom, this.dateTo, this.salesContractNo, this.orderNo, this.orderType, this.processType, this.buyer, this.account)
            .then(data => {
                this.data = data;
            })
    }

    ExportToExcel() {
        this.service.generateExcel(this.dateFrom, this.dateTo, this.salesContractNo, this.orderNo, this.orderType, this.processType, this.buyer, this.account);
    }

    buyerChanged(e){
        var selectedBuyer = e.detail || null;
        if(!selectedBuyer){
            this.buyer = null;
        }
    }

    orderTypeChanged(e){
        var selectedOrderType = e.detail || null;
        if(!selectedOrderType){
            this.orderType = null;
        }
    }

    processTypeChanged(e){
        var selectedProcessType = e.detail || null;
        if(!selectedProcessType){
            this.processType = null;
        }
    }

    accountChanged(e){
        var selectedAccount = e.detail || null;
        if(!selectedAccount){
            this.account = null;
        }
    }
}