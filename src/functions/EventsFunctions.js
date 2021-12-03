
const Aux = require("./AuxiliaryFunctions.js");
const Contracts = require("./Contracts.js");

export var eventlogs = [];
export var eventNames = [];


export async function StartEvents(){
    const blockId = 0;
    eventNames = [];

    // Contracts
    const ListOfContracts = [Contracts.admin,
      Contracts.certificatePoolManager,
      Contracts.publicPool,
      Contracts.privatePoolFactory,
      Contracts.providerFactory,
      Contracts.Treasury,
      Contracts.CertisToken,
      Contracts.PriceConverter,
      Contracts.PropositionSettings,
      Contracts.ENS,
      Contracts.privatePool,
      Contracts.provider]

    for(let i=0; i < ListOfContracts.length; i++){
      let contractABI = ListOfContracts[i]._jsonInterface;
      if(contractABI != undefined){
        let eventsList = []
        let abisList = []
    
        Object.keys(contractABI).forEach((key) => {
          if("event" == contractABI[key]["type"]){
            eventsList.push(contractABI[key]["name"]);
            abisList.push(contractABI[key]["inputs"])
          }
        });

        eventNames.push(eventsList);
    
        await GetEvents(i, 
          blockId, 
          ListOfContracts[i], 
          eventNames[i], 
          abisList);
        } 
    }
      
  
}

export async function GetEvents(eventLogId, _block, contract, eventsList, abisList){
  eventlogs[eventLogId] = []

  var options = {
      fromBlock: _block
  };

  if("" != contract && undefined != contract.events){
    for(let i=0; i < eventsList.length; i++){
      ConnectEvent(Reflect.get(contract.events, eventsList[i]), options, eventLogId, i, abisList[i])
    }
  }

}

function ConnectEvent(func, option, Id1, Id2, Abi){
  eventlogs[Id1][Id2] = []
  let eventFunction = func(option);

  eventFunction.on('data', event => {eventlogs[Id1][Id2][eventlogs[Id1][Id2].length] = event})
  eventFunction.on('changed', changed => window.alert("event removed from blockchain : " + changed))
  eventFunction.on('error', err => window.alert("event error : " + err))
}

export async function StopEvents(){
  try{
    if(Aux.web3){
      await Aux.web3.eth.clearSubscriptions()
    }
  }
  catch(e){
    window.alert("error clearing subscription : " + e.message)
  }
    
}


