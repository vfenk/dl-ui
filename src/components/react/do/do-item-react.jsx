import React from 'react';

import TextboxReact from '../basic/textbox-react.jsx';
import RadiobuttonReact from '../basic/radiobutton-react.jsx';
import NumericReact from '../basic/numeric-react.jsx';
// import POTextileAutoSuggestReact from '../auto-suggests/po-textile-auto-suggest-react.jsx';
import ProductAutoSuggestReact from '../auto-suggests/product-auto-suggest-react.jsx';
import PoExternalAutoSuggestReact from '../auto-suggests/po-external-auto-suggest-react.jsx';
import UomAutoSuggestReact from '../auto-suggests/uom-auto-suggest-react.jsx';
import DoItemFulfillmentReact from './do-item-fulfillment-react.jsx';

'use strict';

export default class DoItemReact extends React.Component {
    constructor(props) {
        super(props);

        this.init = this.init.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleToggleDetail = this.handleToggleDetail.bind(this);

        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

    }

    handleValueChange(event, poExternal) {
        var doItem = this.state.value;
        doItem.purchaseOrderExternal = poExternal;
        doItem.purchaseOrderExternalId = poExternal._id;
        console.log(doItem);
        this.setState({ value: doItem });
        if (this.props.onChange)
            this.props.onChange(doItem);
    }

    handleRemove() {
        if (this.props.onRemove)
            this.props.onRemove(this.state.value);
    }

    handleToggleDetail() {
        this.setState({ showDetail: !this.state.showDetail });
    }

    init(props) {
        var value = props.value;
        var poExternal = value.purchaseOrderExternal || {};
        var poCollection = poExternal.items || [];
        var fulfillments = [].concat.apply([], poCollection.map((purchaseOrder, index) => {
            var doItemFulfillments = (purchaseOrder.items || []).map((poItem, index) => {
                return {
                    purchaseOrderId: purchaseOrder._id,
                    purchaseOrder: purchaseOrder,
                    productId: poItem.product._id,
                    product: poItem.product,
                    purchaseOrderQuantity: poItem.dealQuantity,
                    purchaseOrderUom: poItem.dealUom,
                    deliveredQuantity: 0,
                    remark: ''
                }
            });
            return doItemFulfillments;
        }));

        value.fulfillments = fulfillments;

        var error = Object.assign({}, DoItemReact.defaultProps.error, props.error);
        var options = Object.assign({}, DoItemReact.defaultProps.options, props.options);
        var showDetail = (this.state || this.props).showDetail || true;

        this.setState({ value: value, error: error, options: options, showDetail: showDetail });
    }

    componentWillMount() {
        this.init(this.props);
    }

    componentWillReceiveProps(props) {
        this.init(props);
    }


    render() {
        this.options = { readOnly: (this.readOnly || '').toString().toLowerCase() === 'true' };
        var details = null;

        if (this.state.showDetail) {
            var items = this.state.value.fulfillments.map((fulfillment, index) => {
                var itemOptions = { readOnly: true };
                var realizationQtyOptions = { readOnly: false };
                return <DoItemFulfillmentReact key={`__item_${fulfillment.purchaseOrder.no}_${fulfillment.product._id}_${index}`} value={fulfillment} />;
            });

            details = <tr>
                <td colSpan="5">
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="20%">PO</th>
                                <th width="20%">Barang</th>
                                <th width="10%">Dipesan</th>
                                <th width="10%">Satuan</th>
                                <th width="10%">Diterima</th>
                                <th width="20%">Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items}
                        </tbody>
                    </table>
                </td>
            </tr>
        }

        return (
            <tr>
                <td colSpan="5">
                    <table className="table">
                        <tbody>
                            <tr>
                                <td width="90%">
                                    <PoExternalAutoSuggestReact value={this.state.value.purchaseOrderExternal} onChange={this.handleValueChange}/>
                                </td>
                                <td width="10%">
                                    <button className="btn btn-danger" onClick={this.handleRemove}>-</button>
                                    <button className="btn btn-info" onClick={this.handleToggleDetail}>i</button>
                                </td>
                            </tr>
                            {details}
                        </tbody>
                    </table>
                </td>
            </tr>
        )
    }
}

DoItemReact.propTypes = {
    value: React.PropTypes.object,
    error: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string]),
    options: React.PropTypes.shape({
        readOnly: React.PropTypes.bool
    })
};

DoItemReact.defaultProps = {
    value: {},
    error: {},
    options: {
        readOnly: false,
    }
};