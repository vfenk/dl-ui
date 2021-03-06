import { inject, bindable, containerless, computedFrom, BindingEngine } from 'aurelia-framework'
import { Service } from "./service";
var SupplierLoader = require('../../../loader/garment-supplier-loader');
var CurrencyLoader = require('../../../loader/currency-loader');
var VatLoader = require('../../../loader/vat-loader');

@inject(BindingEngine, Element, Service)
export class DataForm {
    @bindable readOnly = false;
    @bindable data = {};
    @bindable error = {};
    @bindable title;
    @bindable supplier;
    @bindable currency;
    @bindable vat;
    @bindable options = { readOnly: false };

    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 5
        }
    }

    itemsInfo = {
        columns: [
            { header: " ", value: "__check" },
            { header: "Nomor Surat Jalan" },
            { header: "Tanggal Surat Jalan" },
            { header: "Tanggal Barang Datang" },
            { header: "Total Amount" }],
        columnsReadOnly: [
            { header: "Nomor Surat Jalan" },
            { header: "Tanggal Surat Jalan" },
            { header: "Tanggal Barang Datang" },
            { header: "Total Amount" }]
    };

    constructor(bindingEngine, element, service) {
        this.bindingEngine = bindingEngine;
        this.element = element;
        this.service = service;
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
        this.options.readOnly = this.readOnly;
    }

    @computedFrom("data._id")
    get isEdit() {
        return (this.data._id || '').toString() != '';
    }

    async supplierChanged(newValue) {
        var selectedSupplier = newValue;
        if (selectedSupplier) {
            if (selectedSupplier._id) {
                this.data.supplier = selectedSupplier;
                this.data.supplierId = selectedSupplier._id;
                var result = await this.service.getDeliveryOrder({ supplierId: this.data.supplierId });
                var _deliveryOrders = result.data || []
                var dataItems = _deliveryOrders.map((deliveryOrder) => {
                    var items = deliveryOrder.items.map(doItem => {
                        var fulfillment = doItem.fulfillments.map(doFulfillment => {
                            return {
                                purchaseOrderExternalId: doItem.purchaseOrderExternalId,
                                purchaseOrderExternalNo: doItem.purchaseOrderExternalNo,
                                purchaseOrderId: doFulfillment.purchaseOrderId,
                                purchaseOrderNo: doFulfillment.purchaseOrderNo,
                                purchaseRequestId: doFulfillment.purchaseRequestId,
                                purchaseRequestNo: doFulfillment.purchaseRequestNo,
                                productId: doFulfillment.productId,
                                product: doFulfillment.product,
                                purchaseOrderQuantity: doFulfillment.purchaseOrderQuantity,
                                purchaseOrderUom: doFulfillment.purchaseOrderUom,
                                deliveredQuantity: doFulfillment.deliveredQuantity,
                                pricePerDealUnit: doFulfillment.pricePerDealUnit
                            }
                        });
                        fulfillment = [].concat.apply([], fulfillment);
                        return fulfillment;
                    });
                    items = [].concat.apply([], items);

                    var doItem = {};
                    doItem.deliveryOrderId = deliveryOrder._id;
                    doItem.deliveryOrderNo = deliveryOrder.no;
                    doItem.deliveryOrderDate = deliveryOrder.date;
                    doItem.deliveryOrderSupplierDoDate = deliveryOrder.supplierDoDate;
                    doItem.items = items;
                    return doItem;
                });
                dataItems = [].concat.apply([], dataItems);
                this.data.items = dataItems;

            }
        } else {
            this.data.supplier = {};
            this.data.supplierId = undefined;
            this.data.items = [];
        }
        this.resetErrorItems();
    }

    currencyChanged(newValue) {
        var selectedCurrency = newValue;
        if (selectedCurrency) {
            if (selectedCurrency._id) {
                this.data.currency = selectedCurrency;
            }
        }
        else {
            this.data.currency = {};
        }
        this.resetErrorItems();
    }

    vatChanged(newValue) {
        var selectedVat = newValue;
        if (selectedVat) {
            if (selectedVat._id) {
                this.data.vat = selectedVat;
            }
        }
        else {
            this.data.vat = {};
        }
        this.resetErrorItems();
    }

    get supplierLoader() {
        return SupplierLoader;
    }

    supplierView = (supplier) => {
        return `${supplier.code} - ${supplier.name}`
    }

    get currencyLoader() {
        return CurrencyLoader;
    }

    currencyView = (currency) => {
        return currency.code
    }

    get vatLoader() {
        return VatLoader;
    }

    vatView = (vat) => {
        return `${vat.name} - ${vat.rate}`
    }

    resetErrorItems() {
        if (this.error) {
            if (this.error.items) {
                this.error.items = [];
            }
        }
    }

    useVatChanged(e) {
        var selectedUseVat = e.srcElement.checked || false;
        this.data.vatNo = "";
        this.data.vatDate = "";
        this.context.vatVM.editorValue = "";
        if (!this.data.useIncomeTax && !this.data.useVat) {
            this.data.isPayTax = false
        }
    }

    useIncomeTaxChanged(e) {
        var selectedUseIncomeTax = e.srcElement.checked || false;
        this.data.incomeTaxNo = "";
        this.data.incomeTaxDate = "";
        if (!this.data.useIncomeTax && !this.data.useVat) {
            this.data.isPayTax = false
        }
    }

    onClickAllDataSource($event) {
        for (var item of this.data.items) {
            item.check = $event.detail.target.checked;
        }
    }
} 