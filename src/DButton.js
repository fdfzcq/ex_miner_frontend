import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class DButton {
  constructor(name, index, obj) {
    this.name = name
    this.index = index
    this.obj = obj
  }

  get buttonContent() {
    switch (this.name) {
      case 'Number Of Clusters':
        return numberOfClusterContent(this);
      case 'DataSet size':
        return dataSetSizeContent(this);
      case 'Cluster Time Interval':
        return clusterTimeIntervalContent(this);
      case 'Data Range (0-)':
        return dataRangeContent(this);
      case 'Algorithm':
        return algorithmContent(this);
      default:
        console.log(this.name)
    }
  }
}

function numberOfClusterContent(button) {
  var choices = Array.from({length: 10}, (v, k) => k+1)
  return to_html(button, choices)
}

function dataSetSizeContent(button) {
  var choices = Array.from({length: 10}, (v, k) => 1000*(k+1))
  return to_html(button, choices)
}

function clusterTimeIntervalContent(button) {
  var choices = Array.from({length: 10}, (v, k) => 100*(k+1))
  return to_html(button, choices)
}

function dataRangeContent(button) {
  var choices = Array.from({length: 10}, (v, k) => 1000*(k+1))
  return to_html(button, choices)
}

function algorithmContent(button) {
  var choices = ['kmean']
  return to_html(button, choices)
}

function to_html(button, choices) {
  var listItems = choices.map((c,i) =>
    <MenuItem eventKey={c}>{c}</MenuItem>
  )
  return (
    <DropdownButton
      bsStyle='default'
      title={button.name}
      key={button.index}
      id={button.name}
      onSelect={function(evt){button.obj.set_value(button.name, evt)}}>
    {listItems}
    </DropdownButton>
  )
}

export default DButton;
