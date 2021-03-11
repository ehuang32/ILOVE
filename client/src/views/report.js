// React Imports
import React from 'react';
import axios from 'axios';

// Component Imports
import Content from '../components/content.js';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import LoadingScreen from '../components/loading.js';
import { Input, Label } from 'reactstrap';

// CSS Imports
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import "../css/random.css";

class Report extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            promoters: null,
            commission: 8
        };
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/api/prom/allProms`)
            .then(response => {
                this.setState({
                    promoters: response.data
                })
            })
            .catch(error => {console.log(error)})
    }

    handleInput(e) {
        let value = e.target.value;
        this.setState({
            commission: value
        })
    }

    render() {
        if (!this.state.promoters) {
            return <LoadingScreen text = {'Fetching Data...'}/>
        }
        var totalCommission = 0;
        const rowData = (
            this.state.promoters.map((prom, key) => {
                totalCommission += this.state.commission*(prom.guestlist.numberBefore+prom.guestlist.numberAfter);
                return (
                    { promoter: prom.guestlist.name, guestlists_b12: prom.guestlist.numberBefore, guestlists_a12: prom.guestlist.numberAfter, 
                        commission: '$'+this.state.commission*(prom.guestlist.numberBefore+prom.guestlist.numberAfter)}
                )
            })
        )
        const totalRow = [{ promoter: 'Total', guestlists_b12: ' ', guestlists_a12: ' ',commission: '$'+totalCommission}]
        return (
            <Content heading = 'Report'>
                <Label className = "label">Commission per Guestlist: </Label>
                <Input
                    type = "text"
                    placeholder = "Commission for Guestlist"
                    name = "input"
                    className = "input"
                    value = {this.state.commission}
                    onChange = {this.handleInput}
                />
                <div className="ag-theme-alpine" style={{ height: 400}}>
                    <AgGridReact 
                        rowData = {rowData}
                        rowSelection = "multiple"
                        pinnedBottomRowData = {totalRow}
                    >
                        <AgGridColumn field="promoter" sortable={true} filter={true}></AgGridColumn>
                        <AgGridColumn headerName="Guestlists Before 12" field="guestlists_b12" sortable={true} filter={true}></AgGridColumn>
                        <AgGridColumn headerName="Guestlists After 12" field="guestlists_a12" sortable={true} filter={true}></AgGridColumn>
                        <AgGridColumn field="commission" sortable={true} filter={true}></AgGridColumn>
                    </AgGridReact>
                </div>
            </Content>
        )
    }
}

export default Report;