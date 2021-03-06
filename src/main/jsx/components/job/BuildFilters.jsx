import React from 'react';
import contains from 'ramda/src/contains'
import classNames from 'classnames'; 
import Dialog from './../lib/Dialog.jsx';
require('./branch_tabs.css')
export default React.createClass({
  render(){
    return <span>
      {this._filtersDropDown()}
      {this._addTabDialog()}
    </span>
  },
  _filtersDropDown(){
    const items = 
      this.props.filters.map((tab,i)=>this._getHistoryTab(tab,i,this._isTabRemovable(tab)));
    const currentFilter = this.props.selectedFilter;
    return <paper-dropdown-menu  ref="branchMenu" label={currentFilter}>
      <div className="dropdown-content">
        {items}
        {this._addNewFilterItem()}
      </div>
    </paper-dropdown-menu> 
  },
  _addNewFilterItem(){
    return <paper-item>
      <paper-button onClick={this._addTab} ref="ca-addTab" >
        New <iron-icon  icon="add-circle"></iron-icon>
      </paper-button> 
    </paper-item>
  },
  _onBranchChange(e){
    if(e.currentTarget && e.currentTarget.id==="currentBranchButton"){
      this.refs.branchListDialog.show();
    }
  },
  _addTabDialog(){
    return <Dialog  ref="addTabDialog" heading="Add new filter" onSave={this._onTabSave} >
      <paper-input ref="newFilterExpression" label="Filter Expression"></paper-input>
    </Dialog>;
  },
  _isTabRemovable(tab){
    return !contains(tab)(['master','All','Mine']);
  },
  _addTab(){
    this.refs.branchMenu.close();
    this.refs.addTabDialog.show();
  },
  _onTabSave(e){
    const newFilter = this.refs.newFilterExpression.value
    if(newFilter){
      this.props.actions.AddFilter(newFilter);
    }
  },
  _onTabRemove(event){
    event.stopPropagation();
    var tab = event.currentTarget.getAttribute('data-tab');
    this.props.actions.RemoveFilter(tab);
  },
  _onTabSelect(e){
    this.refs.branchMenu.close();
    const filter =e.currentTarget.getAttribute('data-tab')
    this.props.actions.QueryChange({filter});
  },
  _getHistoryTab(tab,i,closable) {
    return <paper-item   key={i} >
      <paper-button data-tab={tab} onClick={this._onTabSelect}>
        {tab}
      </paper-button>
      {closable?<div data-tab={tab} className="tab-close" onClick={this._onTabRemove}><iron-icon icon="close"></iron-icon> </div>: ''}
    </paper-item>;
  }
});
