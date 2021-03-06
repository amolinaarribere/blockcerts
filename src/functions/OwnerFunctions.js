// Owner
const Aux = require("./AuxiliaryFunctions.js");
const load = require("./LoadFunctions.js");
const ENSFunc = require("./ENSFunctions.js");
const ValidationFunc = require("./ValidationFunctions.js");


export var isOwner = false
export var MinOwners = ""
export var PendingMinOwners = ""
export var TotalOwners = ""
export var Owners = []
export var pendingOwnersAdd = []
export var pendingOwnersRemove = []



export async function AddOwner(address, info, contract){
  await ManageOwner(address, contract, 0, info);
}
  
  export async function RemoveOwner(address, contract){
    await ManageOwner(address, contract, 1, "");
  }

  export async function ValidateOwner(address, contract){
    await ManageOwner(address, contract, 2, "");
  }

  export async function RejectOwner(address, contract){
    await ManageOwner(address, contract, 3, "");
  }

  async function ManageOwner(address, contract, id, info){
    let CheckAddress = ValidationFunc.validateAddress(address);

    if(true == CheckAddress){
      if(id == 0) await Aux.CallBackFrame(contract.methods.addOwner(address, info).send({from: Aux.account }));
      else if(id == 1) await Aux.CallBackFrame(contract.methods.removeOwner(address).send({from: Aux.account }));
      else if(id == 2) await Aux.CallBackFrame(contract.methods.validateOwner(address).send({from: Aux.account }));
      else if(id == 3) await Aux.CallBackFrame(contract.methods.rejectOwner(address).send({from: Aux.account }));
    }
    else{
      ValidationFunc.FormatErrorMessage([CheckAddress], ["Address"]);
    }
  }

  export function resetOwners(){
    isOwner = false
    MinOwners = ""
    PendingMinOwners = ""
    TotalOwners = ""
    Owners = []
    pendingOwnersAdd = []
    pendingOwnersRemove = []
  }

  export async function RetrieveOwners(contract){
    try{
        MinOwners = await contract.methods.retrieveMinOwners().call()
        Owners = []
        let listOfOwners = await contract.methods.retrieveAllOwners().call()
        TotalOwners = listOfOwners.length

        for (let i = 0; i < TotalOwners; i++) { 
          Owners.push(await ENSFunc.ReverseResolution(Aux.Bytes32ToAddress(listOfOwners[i])))
        }

        pendingOwnersAdd = []
        let pendingOwnersAddAddresses = await contract.methods.retrievePendingOwners(true).call();
        for (let i = 0; i < pendingOwnersAddAddresses.length; i++) {
          let Address = Aux.Bytes32ToAddress(pendingOwnersAddAddresses[i])
          let {0:Info} = await contract.methods.retrieveOwner(Address).call();
          pendingOwnersAdd[i] = [await ENSFunc.ReverseResolution(Address), Info]
        }
  
        pendingOwnersRemove = []
        let pendingOwnersRemoveAddresses = await contract.methods.retrievePendingOwners(false).call();
        for (let i = 0; i < pendingOwnersRemoveAddresses.length; i++) {
          let Address = Aux.Bytes32ToAddress(pendingOwnersRemoveAddresses[i])
          let {0:Info} = await contract.methods.retrieveOwner(Address).call();
          pendingOwnersRemove[i] = [await ENSFunc.ReverseResolution(Address), Info]
        }
  
        PendingMinOwners = await contract.methods.retrievePendingMinOwners().call();

        if(load.Admin && Aux.account){
          let result = await contract.methods.retrieveOwner(Aux.account).call();
          isOwner = result[1];
        }
        else if(!Aux.account) isOwner = false;
        else isOwner = true;
    }
    catch(e){
      window.alert("error retrieving the owners : " + JSON.stringify(e))
    }
  }

  export async function UpdateMinOwner(minOwner, contract){
    let CheckMinOwners = ValidationFunc.validatePositiveInteger(minOwner);

    if(true == CheckMinOwners[1]){
      await Aux.CallBackFrame(contract.methods.changeMinOwners(CheckMinOwners[0]).send({from: Aux.account }));
    }
    else{
      ValidationFunc.FormatErrorMessage([CheckMinOwners[1]], ["Min Owners"]);
    }
  }

  export async function ValidateMinOwner(contract){
    await Aux.CallBackFrame(contract.methods.validateMinOwners().send({from: Aux.account }));
  }

  export async function RejectMinOwner(contract){
    await Aux.CallBackFrame(contract.methods.rejectMinOwners().send({from: Aux.account }));
  }

  