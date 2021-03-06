import {ProviderContractType} from '../../../config.js';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const func = require("../../../functions/ProviderPoolFunctions.js");

class ListPendingProvidersPoolsComponent extends React.Component{
  state = {
    isPendingProvidersPoolsAddShown: false,
    isPendingProvidersPoolsRemoveShown: false
  };

  togglePendingProvidersPoolsAdd = () => {
    if(this.state.isPendingProvidersPoolsAddShown)this.setState({ isPendingProvidersPoolsAddShown: false })
    else this.setState({ isPendingProvidersPoolsAddShown: true })
  };
  togglePendingProvidersPoolsRemove = () => {
    if(this.state.isPendingProvidersPoolsRemoveShown)this.setState({ isPendingProvidersPoolsRemoveShown: false })
    else this.setState({ isPendingProvidersPoolsRemoveShown: true })
  };

    render(){
      var text = (this.props.contractType == ProviderContractType)? "Pools" : "Providers";
      var pendingProvidersPoolsAdd = func.pendingAdd;
      var pendingProvidersPoolsRemove = func.pendingRemove;

      return(
        <div>
           <button
              className="btn btn-lg btn-warning center modal-button"
              onClick={this.togglePendingProvidersPoolsAdd}>Check Pending {text} to be Added</button>

           {this.state.isPendingProvidersPoolsAddShown ? (
                  <div class="border border-warning border-5">
                    <br />
                    <Container style={{margin: '10px 50px 50px 50px' }}>
                        {pendingProvidersPoolsAdd.map(pendingProviderPoolAdd => (
                        <Row>
                          <Col key={pendingProviderPoolAdd[0]}> {pendingProviderPoolAdd[0]}</Col>
                          <Col>{pendingProviderPoolAdd[1]}</Col>
                        </Row>
                        ))}
                    </Container>
                  </div>) : null} 

            <br />
            <br />

            <button
              className="btn btn-lg btn-warning center modal-button"
              onClick={this.togglePendingProvidersPoolsRemove}>Check Pending {text} to be Removed</button>

            {this.state.isPendingProvidersPoolsRemoveShown ? (
                  <div class="border border-warning border-5">
                    <br />
                    <Container style={{margin: '10px 50px 50px 50px' }}>
                      {pendingProvidersPoolsRemove.map(pendingProviderPoolRemove => (
                        <Row>
                          <Col key={pendingProviderPoolRemove[0]}> {pendingProviderPoolRemove[0]}</Col>
                          <Col>{pendingProviderPoolRemove[1]}</Col>
                        </Row>
                        ))}
                    </Container>
                  </div>) : null} 
        </div>
      );
 
    }
    
  }

export default ListPendingProvidersPoolsComponent;