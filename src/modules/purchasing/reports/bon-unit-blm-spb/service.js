import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../../utils/rest-service'; 

const serviceUri = 'unit-receipt-without-spb';
export class Service extends RestService {

    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "purchasing");
    }

    

    search(dateFrom, dateTo) {
    var endpoint = `${serviceUri}?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    return super.get(endpoint);
    
   }

    getById(id) {
        var endpoint = `${serviceUri}/${id}`;
        return super.get(endpoint);
    }

    
    generateExcel(dateFrom, dateTo) {
    var endpoint = `${serviceUri}?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    return super.getXls(endpoint);
    }

}
