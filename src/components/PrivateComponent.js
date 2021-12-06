import React from 'react';
import CertificateComponent from './subcomponents/Certificates/CertificateComponent.js';
import OwnerComponent from './subcomponents/Owners/OwnerComponent.js';
import ProviderPoolComponent from './subcomponents/ProvidersPools/ProviderPoolComponent.js';
import ListPoolsIssuers from './subcomponents/Factory/ListPoolsIssuers.js';
import CreatePoolIssuer from './subcomponents/Factory/CreatePoolIssuer.js';
import LoadingComponent from './subcomponents/LoadingComponent.js';

const ProviderPoolFunc = require("../functions/ProviderPoolFunctions.js");
const BrowserStorageFunctions = require("../functions/BrowserStorageFunctions.js");
const Certificatefunc = require("../functions/CertificateFunctions.js");
const Ownerfunc = require("../functions/OwnerFunctions.js");
const Contracts = require("../functions/Contracts.js");
const LoadFunc = require("../functions/LoadFunctions.js");
const TreasuryFunc = require("../functions/TreasuryFunctions.js");


class PrivateComponent extends React.Component {
  async componentWillMount() {
    Certificatefunc.SwitchContext()
    await this.refresh();
  }

  constructor(props) {
    super(props)
    this.refresh = this.refresh.bind(this)
  }

    state = {
      loading : true,
      privateEnv : true,
      contractType : 2
    };

    NotEmpty(value){
      if(value != null && value !== "" && value !== "undefined"){
        return true
      }
      return false;
    }
      
    async refresh() {
      await ProviderPoolFunc.ReadKeys(BrowserStorageFunctions.privatePoolKey, this.state.contractType);
      await LoadFunc.LoadFactoriesFunc(Contracts.privatePoolFactory, this.state.contractType); 
      Ownerfunc.resetOwners();    
      if(this.NotEmpty(ProviderPoolFunc.PrivatePoolAddress)){
        await ProviderPoolFunc.SelectProviderPool(ProviderPoolFunc.PrivatePoolAddress, this.state.contractType);
      }
      this.setState({loading : false})
    }
  
    render(){
      return (
        <div>
          {(false == this.state.loading)? 
            <div>
              <CreatePoolIssuer contract={Contracts.privatePoolFactory}
                price={TreasuryFunc.PrivatePriceWei}
                contractType={this.state.contractType} 
                refresh={this.refresh}/>
              <br />
              <br />
              <ListPoolsIssuers contract={Contracts.privatePoolFactory}
                contractType={this.state.contractType} 
                Key={BrowserStorageFunctions.privatePoolKey} 
                refresh={this.refresh}/>
              <br />
              {(this.NotEmpty(ProviderPoolFunc.PrivatePoolAddress))?
                <div>
                  <CertificateComponent contract={Contracts.privatePool}  
                    contractType={this.state.contractType}
                    privateEnv={this.state.privateEnv} 
                    refresh={this.refresh}
                    price={0}/>
                  <br />
                </div>
              :null}
              
              {
              (Ownerfunc.isOwner)?(
                <div>
                  <OwnerComponent contract={Contracts.privatePool} 
                    contractType={this.state.contractType} 
                    refresh={this.refresh}/>
                  <br/>
                  <ProviderPoolComponent contract={Contracts.privatePool} 
                    contractType={this.state.contractType} 
                    refresh={this.refresh}/>
                </div>
              ):null}
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

  
  export default PrivateComponent;