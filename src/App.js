import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import tauCharts from 'taucharts';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {data: [{"x":0, "y":0, "group":0}], chart: null};
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
    setInterval(() => this.fetchData(), 500);
  }

  clusterData = () => {
    // TODO: add dropdown lists to configure the input values
    axios.post(`http://localhost:8990/clusterData`, {cluster_interval: 100}, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">ExMiner Visualizer</h1>
        </header>
        <button onClick={this.clusterData}>
          Do cluster
        </button>
        <div id="scatter"></div>
      </div>
    );
  }
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
