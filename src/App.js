import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import tauCharts from 'taucharts';
import DButton from './DButton'
import { ButtonToolbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BUTTONS = [
  'Number Of Clusters',
  'DataSet size',
  'Data Range (0-)',
  'Cluster Time Interval',
  'Algorithm'
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {data: [{"x":0, "y":0, "group":0}], chart: null};
    this.cluster_n = 3;
    this.dataset_size = 500;
    this.data_range = 1000;
    this.cluster_interval = 100;
    this.algorithm = 'kmean';    
  }

  fetchData() {
    axios.get(`http://localhost:8990/getData`)
      .then(res => {
        const data = process(res.data.data)
        this.setState({ data });
        this.state.chart.setData(data);
      });
  }

  init_chart() {
    const chart = new tauCharts.Chart({
      data: this.state.data,
      type: 'scatterplot',
      y: 'y',
      x: 'x',
      color: 'group'
    });
    document.getElementById("scatter").innerHTML = "";
    chart.renderTo('#scatter');
    this.setState({ chart });
  }

  componentDidMount() {
    this.init_chart();
    setInterval(() => this.fetchData(), this.cluster_interval);
  }

  request() {
    return {
      cluster_n:        this.cluster_n,
      dataset_size:     this.dataset_size,
      data_range:       this.data_range,
      cluster_interval: this.cluster_interval,
      algorithm:        this.algorithm
    }
  }

  clusterData = () => {
    axios.post(`http://localhost:8990/clusterData`, this.request(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  set_value = (name, v) => {
    switch(name){
      case 'Number Of Clusters':
        this.cluster_n = v;
        break;
      case 'DataSet size':
        this.dataset_size = v;
        break;
      case 'Cluster Time Interval':
        this.cluster_interval = v;
        break;
      case 'Data Range (0-)':
        this.data_range = v;
        break;
      case 'Algorithm':
        this.algorithm = v;
        break;
      default:
        console.log(name);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">ExMiner Visualizer</h1>
        </header>
        <ButtonToolbar>
        {BUTTONS.map((name, index) =>
          dropdownButton(name, index, this))}
        <Button bsStyle="primary" onClick={this.clusterData}>Do Cluster</Button>
        </ButtonToolbar>
        <div id="scatter"></div>
      </div>
    );
  }
}

function dropdownButton(button_name, index, obj) {
  var button = new DButton(button_name, index, obj)
  console.log(button.buttonContent)
  return button.buttonContent
}

function process(data) {
  var result = []
  for (var i = 0, len = data.length; i < len; i++) {
    var group = data[i][1]
    var d = data[i][0]
    result.push({"group": group, "x": d[0], "y": d[1]})
  }
  return result
}

export default App;
