import React from 'react';
import { Form} from 'react-bootstrap';

const ProviderPoolFunc = require("../../../functions/ProviderPoolFunctions.js");
const loadFunc = require("../../../functions/LoadFunctions.js");
const ValFunc = require("../../../functions/ValidationFunctions.js");
const ENSFunc = require("../../../functions/ENSFunctions.js");

class SendNewProposalComponent extends React.Component {
  constructor(props) {
    super(props)
    loadFunc.LoadProviderPoolFunc(this.props.contractType, this.props.contract);
    this.refresh = this.refresh.bind(this)
  }

    state = {
      newProvider : "",
      newProviderInfo : ""
    };

    async refresh() {
      await this.props.refresh()
    }

    handleNewProposal = async (event) => {
      event.preventDefault();

      let Address = await ENSFunc.Resolution(this.state.newProvider.trim());

      await ProviderPoolFunc.AddProviderPool(Address, this.state.newProviderInfo.trim(), false, this.props.contractType, this.props.price, this.props.contract)
        this.setState({ newProvider: "" })
        this.setState({ newProviderInfo: "" })
        await loadFunc.LoadProviderPoolFunc(this.props.contractType, this.props.contract);
      
      await this.refresh()
    };

    render(){
      return (
        <div>
         <h3>New Proposal</h3>
         <Form onSubmit={this.handleNewProposal} style={{margin: '50px 50px 50px 50px' }}>
            <Form.Group  className="mb-3">
               <Form.Control type="text" name="newProvider" placeholder="address or ENS name"
                    value={this.state.newProvider}
                    onChange={event => this.setState({ newProvider: event.target.value })}/>
                <Form.Control type="text" name="newProviderInfo" placeholder="Info" 
                    value={this.state.newProviderInfo}
                    onChange={event => this.setState({ newProviderInfo: event.target.value })}/>    
            </Form.Group>
            <button class="btn btn-primary">Submit Proposal</button> 
          </Form>
          <hr class="bg-secondary"/>
        </div>
      );
    }
  }
  
export default SendNewProposalComponent;