import React from 'react';
import ManagerAddressPropositionComponent from './subcomponents/Manager/AddressPropositionComponent.js';
import PriceConverterAddressPropositionComponent from './subcomponents/PriceConverter/AddressPropositionComponent.js';
import PropositionConfigComponent from './subcomponents/Proposition/PropositionConfigComponent.js';
import PricePropositionComponent from './subcomponents/Treasury/PricePropositionComponent.js';
import ENSPropositionComponent from './subcomponents/ENS/ENSPropositionComponent.js';
import LoadingComponent from './subcomponents/LoadingComponent.js';

const Contracts = require("../functions/Contracts.js");
const LoadFunc = require("../functions/LoadFunctions.js");

class SettingsComponent extends React.Component {
  async componentWillMount() {
    await this.refresh();
  }

  constructor(props) {
    super(props)
    this.refresh = this.refresh.bind(this)
  }
  
   state = {
      loading : false,
    };
    
    async refresh() {
      this.setState({loading: true})
      await LoadFunc.LoadManagerFunc(Contracts.certificatePoolManager);
      this.setState({loading: false})
    }
  
    render(){
      return (
        <div>
          {(false == this.state.loading)? 
            <div>
              <ManagerAddressPropositionComponent contract={Contracts.certificatePoolManager}/>
              <br />
              <PropositionConfigComponent contract={Contracts.PropositionSettings}/>
              <br/>
              <PricePropositionComponent contract={Contracts.Treasury}/>
              <br/>
              <PriceConverterAddressPropositionComponent contract={Contracts.PriceConverter} />
              <br />
              <ENSPropositionComponent contract={Contracts.ENS} />
              <br />
            </div>
          :
            <div>
              <LoadingComponent />
            </div>
          }
        </div>
      );
    }
  }

  export default SettingsComponent;

