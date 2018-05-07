import React from 'react';
import {connect} from 'react-redux';
import { Switch, NavLink, Route } from "react-router-dom";
import { Dropdown, Button, Icon, Label, Form, Table, Input, Search, Grid, Header } from 'semantic-ui-react';
import moment from 'moment';

import { PurchaseOrderService } from '../../../services/api/PurchaseOrderService';

export class SearchPurchaseOrder extends React.Component {

  constructor(props) {
    super(props);
    this._purchaseOrderService = new PurchaseOrderService();
    this.state = {
      PODetail: {po_number: "-", supplier: "-", order_date: "-", delivery_date: "-", branch: "-", status: "-"},
      POProduct: [],
      searchState: false,
      //
      po_number_input: null,
    };
  }

  handleInputChange(event, data) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [data.name]: data.value
    });
  }

  handlePOSearch(){
    this.setState({
      searchState: !this.state.searchState,
    });
    let promise = this._purchaseOrderService.getPurchaseOrder(this.state.po_number_input);
    promise.then(function (response){
      this.setState({
        POProduct: response.data.po_product,
        PODetail: {
          po_number: response.data.po_number, 
          supplier: response.data.supplier_name, 
          order_date: moment(response.data.order_date).format('DD/MM/YYYY'), 
          delivery_date: moment(response.data.expect_delivery_date).format('DD/MM/YYYY'), 
          branch: response.data.customer_branch_name, 
          status: response.data.status
        },
        searchState: !this.state.searchState,
      });
    }.bind(this));
  }

  render() {
    return (
      <div>
        <Form class="ui form" onSubmit={(e) => this.handlePOSearch(e)}>
          <Input focus loading={this.state.searchState} icon='search' iconPosition='left' placeholder='ค้นหาด้วยเลข PO' name="po_number_input" onChange={(e,d) => this.handleInputChange(e,d)}/>
        </Form>
              <Table celled>
      <Table.Header>
          <Table.Row>
            <Table.HeaderCell >
              เลขที่ PO
            </Table.HeaderCell>
            <Table.HeaderCell >
              Supplier
            </Table.HeaderCell>
            <Table.HeaderCell >
              วันที่สั่งซื้อ
            </Table.HeaderCell>
            <Table.HeaderCell >
              วันที่ส่งของ
            </Table.HeaderCell>
            <Table.HeaderCell >
              สาขาที่ส่ง
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            <Table.Row>
              <Table.Cell>{this.state.PODetail.po_number}</Table.Cell>
              <Table.Cell>{this.state.PODetail.supplier}</Table.Cell>
              <Table.Cell>{this.state.PODetail.order_date}</Table.Cell>
              <Table.Cell>{this.state.PODetail.delivery_date}</Table.Cell>
              <Table.Cell>{this.state.PODetail.branch}</Table.Cell>
            </Table.Row>
        </Table.Body>
      </Table>
      <Table celled>
      <Table.Header>
          <Table.Row>
            <Table.HeaderCell >
              สินค้า
            </Table.HeaderCell>
            <Table.HeaderCell >
              รหัสสินค้า
            </Table.HeaderCell>
            <Table.HeaderCell >
              จำนวน
            </Table.HeaderCell>
            <Table.HeaderCell >
              ราคา
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {_.map(this.state.POProduct, ({ product_id, product_name, product_number, order_amount, product_price }) => (
            <Table.Row key={product_id} >
              <Table.Cell>{product_name}</Table.Cell>
              <Table.Cell>{product_number}</Table.Cell>
              <Table.Cell>{order_amount}</Table.Cell>
              <Table.Cell>{product_price}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Button as='div' labelPosition='right'>
      <Button basic color='blue'>
        <Icon name='archive' />
        สถานะการส่่ง
      </Button>
      <Label as='a' basic color='blue' pointing='left'>{this.state.PODetail.status}</Label>
    </Button>
      {/* <Dropdown text='อัพเดต' floating labeled button className='icon'>
      <Dropdown.Menu>
      <Dropdown.Header icon='tags' content='เปลี่ยนแปลงสถานะการจัดส่ง' />
      <Dropdown.Divider />
      <Dropdown.Item label={{ color: 'red', empty: true, circular: true }} text='ยกเลิก' />
      <Dropdown.Item label={{ color: 'blue', empty: true, circular: true }} text='รอการจัดส่ง' />
      <Dropdown.Item label={{ color: 'black', empty: true, circular: true }} text='จัดส่งแล้ว' />
      </Dropdown.Menu>
      </Dropdown> */}
      </div>
    );
  }
}

export default connect(
)(SearchPurchaseOrder);