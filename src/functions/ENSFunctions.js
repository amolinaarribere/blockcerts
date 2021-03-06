import ENS,  {getEnsAddress } from '@ensdomains/ensjs'

const Aux = require("./AuxiliaryFunctions.js");
const Contracts = require("./Contracts.js");
const EmptyAddress = "0x0000000000000000000000000000000000000000"
var ens = ""

export var ENSRegistryAddress = "";
export var ENSReverseRegistryAddress = "";
export var PrivatePoolNode = "";
export var ProviderNode = "";
export var PrivatePoolDomain = "";
export var ProviderDomain = "";

export var PendingENSRegistryAddress = "";
export var PendingENSReverseRegistryAddress = "";
export var PendingPrivatePoolNode = "";
export var PendingProviderNode = "";
export var PendingPrivatePoolDomain = "";
export var PendingProviderDomain = "";

export async function RetrieveENSConfig(contract){
    try{
      let result = await contract.methods.retrieveSettings().call();
      ENSRegistryAddress = result[0];
      ENSReverseRegistryAddress = result[1];
      PrivatePoolNode = result[2];
      ProviderNode = result[3];
      PrivatePoolDomain = result[4];
      ProviderDomain = result[5];
    }
    catch(e) { 
      console.log("error retrieving the ens config : " + JSON.stringify(e)); 
    }
    
  }

  export async function RetrievePendingENSConfig(contract){
    try{
      let result = await contract.methods.retrieveProposition().call();
      PendingENSRegistryAddress = "-"
      PendingENSReverseRegistryAddress = "-"
      PendingPrivatePoolNode = "-"
      PendingProviderNode = "-"
      PendingPrivatePoolDomain = "-"
      PendingProviderDomain = "-"
      
      if(result[0] != undefined)PendingENSRegistryAddress = Aux.Bytes32ToAddress(result[0])
      if(result[1] != undefined)PendingENSReverseRegistryAddress = Aux.Bytes32ToAddress(result[1])
      if(result[2] != undefined)PendingPrivatePoolNode = result[2]
      if(result[3] != undefined)PendingProviderNode = result[3]
      if(result[4] != undefined)PendingPrivatePoolDomain = Aux.BytesToString(result[4])
      if(result[5] != undefined)PendingProviderDomain = Aux.BytesToString(result[5])
    }
    catch(e) { 
      console.log("error retrieving the pending ens config : " + JSON.stringify(e)); 
    }
    
  }

  export async function UpgradeENSConfig(NewENSRegistryAddress, NewENSReverseRegistryAddress, NewPrivatePoolNode, NewProviderNode, contract){
    await Aux.CallBackFrame(contract.methods.sendProposition(
        [Aux.AddressToBytes32(NewENSRegistryAddress),
        Aux.AddressToBytes32(NewENSReverseRegistryAddress),
        NewPrivatePoolNode,
        NewProviderNode,
        ]).send({from: Aux.account }));
  }

export async function Resolution(name){
    try{
        await initENS();
        var address = await ens.name(name).getAddress();
        if(EmptyAddress == address)address = name;
        return address;
    }
    catch(e){
        console.log("error resolving the address : " + e)
        return name;
    }
    
}

export async function ReverseResolution(address){
    try{
        await initENS();
        var name = await ens.getName(address)
        if(name.name == null ||
            Aux.web3.utils.toChecksumAddress(address) != Aux.web3.utils.toChecksumAddress(await ens.name(name.name).getAddress())) return address;

        return name.name;
    }
    catch(e){
        console.log("error reversing the address : " + e)
        return address;
    }
   
}

async function initENS(){
  var provider = Aux.web3.currentProvider
  try{
    await RetrieveENSConfig(Contracts.ENS)[0];
    ens = new ENS({ provider, ensAddress: ENSRegistryAddress })
  }catch(e){
    ens = new ENS({ provider, ensAddress: getEnsAddress('1') })
  }
 
}

