import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { NETWORK_ID_LABELS} from './config';

import HomeComponent from './components/HomeComponent.js';
import NotRecognizedComponent from './components/NotRecognizedComponent.js';
import PublicComponent from './components/PublicComponent.js';
import PrivateComponent from './components/PrivateComponent.js';
import IssuerComponent from './components/IssuerComponent.js';
import DividendsComponent from './components/DividendsComponent.js';
import SettingsComponent from './components/SettingsComponent.js';
import CurrentAddressComponent from './components/CurrentAddressComponent.js';
import ConnectDisconnectComponent from './components/ConnectDisconnectComponent.js';
import EventsComponent from './components/EventsComponent.js';
import LoadingComponent from './components/subcomponents/LoadingComponent.js';


const certFunc = require("./functions/CertisFunctions.js");
const LoadFunc = require("./functions/LoadFunctions.js");
const BrowserStorageFunctions = require("./functions/BrowserStorageFunctions.js");
const AuxFunc = require("./functions/AuxiliaryFunctions.js");

const Home = "Home";
const Settings = "Settings";
const Public = "Public";
const Private = "Private";
const Provider = "Provider";
const Dividends = "Dividends";
const Event = "Events";
const NotRecognized = "NotRecognized";


class Demo extends React.Component {
  async componentWillMount() {
    this.setState({loading: true})
    await LoadFunc.LoadBlockchain();

    if(LoadFunc.Network != NETWORK_ID_LABELS.Other.Label){
      let currentTab = BrowserStorageFunctions.ReadKey(BrowserStorageFunctions.currentTabKey);
      if(currentTab){
        this.state.Component = currentTab
      }
      else this.state.Component = Home
    }
    else{
      this.state.Component = NotRecognized
    }

    let account = BrowserStorageFunctions.ReadKey(BrowserStorageFunctions.accountConnectedKey);
    if(account){
      await LoadFunc.ConnectNewAccount(account)
    }

    this.refresh = this.refresh.bind(this)
    this.setState({loading: false})
 }

  state = {
    value : 0,
    loading : false,
    Component : "",
    address : ""
  };

  async refresh(){
    this.setState({loading: true})
    this.setState({loading: false})
  }

  toggleMenu(newValue){
    BrowserStorageFunctions.WriteKey(BrowserStorageFunctions.currentTabKey, newValue);
    if(LoadFunc.Network != NETWORK_ID_LABELS.Other.Label || newValue == Home){
      this.setState({Component: newValue});
    }
    else this.setState({Component: NotRecognized});
  };

  
  render(){
    return (
      <div style={{backgroundColor: 'White'}}>
        <Navbar bg="dark" variant="dark" class="w-75">
            <Container>
              <Navbar.Brand onClick={() => this.toggleMenu(Home)}>Blockcerts <i>({LoadFunc.Network})</i></Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link onClick={() => this.toggleMenu(Settings)}>{Settings}</Nav.Link>
                <Nav.Link onClick={() => this.toggleMenu(Public)}>{Public}</Nav.Link>
                <Nav.Link onClick={() => this.toggleMenu(Private)}>{Private}</Nav.Link>
                {AuxFunc.account ? (<Nav.Link onClick={() => this.toggleMenu(Provider)}>{Provider}</Nav.Link>) : null}
                {certFunc.isOwner ? (<Nav.Link onClick={() => this.toggleMenu(Dividends)}>{Dividends}</Nav.Link>) : null}
                <Nav.Link onClick={() => this.toggleMenu(Event)}>{Event}</Nav.Link>
              </Nav>
              {
                  (false == this.state.loading) ? <CurrentAddressComponent /> : <LoadingComponent />
              }&nbsp;&nbsp;
              {
                  (false == this.state.loading) ? <ConnectDisconnectComponent refresh={this.refresh} /> : <LoadingComponent />
              }
            </Container>
        </Navbar>
        <br />
        <div class="mx-auto w-75">
          {(() => {
              switch (this.state.Component) {
                case Settings:
                    return (
                      ((false == this.state.loading) ? <SettingsComponent /> : <LoadingComponent />)
                    )
                case Public:
                    return (
                      ((false == this.state.loading) ? <PublicComponent /> : <LoadingComponent />)
                    )
                case Private:
                    return (
                      ((false == this.state.loading) ? <PrivateComponent /> : <LoadingComponent />)
                    )
                case Provider:
                    return (
                      ((false == this.state.loading) ? <IssuerComponent /> : <LoadingComponent />)
                    )
                case Dividends:
                    return (
                      ((false == this.state.loading) ? <DividendsComponent /> : <LoadingComponent />)
                    )
                case Event:
                    return (
                      ((false == this.state.loading) ? <EventsComponent /> : <LoadingComponent />)
                    )
                case NotRecognized:
                    return (
                      <NotRecognizedComponent />
                    )
                default:
                    return (
                      <HomeComponent />
                    )
              }
          })()}
      </div>
        
      </div>
    );

  };
  
  
}

export default Demo;
