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

class Homepage extends React.Component {

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
                totalCommission += this.state.commission*prom.guestlist.number;
                return (
                    { promoter: prom.guestlist.name, guestlists: prom.guestlist.number, commission: '$'+this.state.commission*prom.guestlist.number}
                )
            })
        )
        const totalRow = [{ promoter: 'Total', guestlists: ' ', commission: '$'+totalCommission}]
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
                <div className="ag-theme-alpine" style={{ height: 400, width: 1500}}>
                    <AgGridReact 
                        rowData = {rowData}
                        rowSelection = "multiple"
                        pinnedBottomRowData = {totalRow}
                    >
                        <AgGridColumn field="promoter" sortable={true} filter={true}></AgGridColumn>
                        <AgGridColumn field="guestlists" sortable={true} filter={true}></AgGridColumn>
                        <AgGridColumn field="commission" sortable={true} filter={true}></AgGridColumn>
                    </AgGridReact>
                </div>
            </Content>
        )
    }
}

export default Homepage;