  // Treasury
import { USDFactor, ETHFactor } from '../config';

const Aux = require("./AuxiliaryFunctions.js");
const Manager = require("./ManagerFunctions.js");
const PriceConverter = require("./PriceConverterFunctions.js");
const Contracts = require("./Contracts.js");
const BigNumber = require('bignumber.js');
const ValidationFunc = require("./ValidationFunctions.js");

export var AccountBalanceWei = new BigNumber(0);
export var TreasuryBalanceWei = new BigNumber(0);
export var TreasuryAggregatedBalanceWei = new BigNumber(0);

export var PublicPriceUSDCents = "";
export var PrivatePriceUSDCents = "";
export var CertificatePriceUSDCents = "";
export var ProviderPriceUSDCents = "";
export var OwnerRefundFeeUSDCents = "";

export var PublicPriceUSD = "";
export var PrivatePriceUSD = "";
export var CertificatePriceUSD = "";
export var ProviderPriceUSD = "";
export var OwnerRefundFeeUSD = "";

export var PublicPriceWei = "";
export var PrivatePriceWei = "";
export var CertificatePriceWei = "";
export var ProviderPriceWei = "";
export var OwnerRefundFeeWei = "";

export var PendingPublicPriceUSD = "";
export var PendingPrivatePriceUSD = "";
export var PendingCertificatePriceUSD = "";
export var PendingProviderPriceUSD = "";
export var PendingOwnerRefundFeeUSD = "";

  export async function RetrievePricesTreasury(contract){
    try{
      let response = await contract.methods.retrieveSettings().call();

      PublicPriceUSDCents = new BigNumber(response[0]);
      PrivatePriceUSDCents = new BigNumber(response[1]);
      ProviderPriceUSDCents = new BigNumber(response[2]);
      CertificatePriceUSDCents = new BigNumber(response[3]);
      OwnerRefundFeeUSDCents = new BigNumber(response[4]);

      PublicPriceUSD = PublicPriceUSDCents.dividedBy(USDFactor).dp(2,0).toString();
      PrivatePriceUSD = PrivatePriceUSDCents.dividedBy(USDFactor).dp(2,0).toString();
      ProviderPriceUSD = ProviderPriceUSDCents.dividedBy(USDFactor).dp(2,0).toString();
      CertificatePriceUSD = CertificatePriceUSDCents.dividedBy(USDFactor).dp(2,0).toString();
      OwnerRefundFeeUSD = OwnerRefundFeeUSDCents.dividedBy(USDFactor).dp(2,0).toString();

      let result = await PriceConverter.USDsToWeis(new BigNumber(1).dividedBy(USDFactor), Contracts.PriceConverter);
      let exchangeRate = result[0];
      PublicPriceWei = PublicPriceUSDCents.multipliedBy(exchangeRate).dp(0,1);
      PrivatePriceWei = PrivatePriceUSDCents.multipliedBy(exchangeRate).dp(0,1);
      ProviderPriceWei = ProviderPriceUSDCents.multipliedBy(exchangeRate).dp(0,1);
      CertificatePriceWei = CertificatePriceUSDCents.multipliedBy(exchangeRate).dp(0,1);
      OwnerRefundFeeWei = OwnerRefundFeeUSDCents.multipliedBy(exchangeRate).dp(0,1);
    }
    catch(e){
      window.alert("error retrieving the prices : " + JSON.stringify(e))
    }
  }

  export async function RetrievePendingPricesTreasury(contract){
    try{
      let response = await contract.methods.retrieveProposition().call();
      PendingPublicPriceUSD = "-";
      PendingPrivatePriceUSD = "-";
      PendingProviderPriceUSD = "-";
      PendingCertificatePriceUSD = "-";
      PendingOwnerRefundFeeUSD = "-";

      if(response[0] != undefined)PendingPublicPriceUSD = new BigNumber(response[0]).dividedBy(USDFactor).dp(2,0).toString();
      if(response[1] != undefined)PendingPrivatePriceUSD = new BigNumber(response[1]).dividedBy(USDFactor).dp(2,0).toString();
      if(response[2] != undefined)PendingProviderPriceUSD = new BigNumber(response[2]).dividedBy(USDFactor).dp(2,0).toString();
      if(response[3] != undefined)PendingCertificatePriceUSD = new BigNumber(response[3]).dividedBy(USDFactor).dp(2,0).toString();
      if(response[4] != undefined)PendingOwnerRefundFeeUSD = new BigNumber(response[4]).dividedBy(USDFactor).dp(2,0).toString();
    }
    catch(e){
      window.alert("error retrieving the pending prices : " + JSON.stringify(e))
    }
    
  }

  export async function RetrieveBalance(address, contract){
    try{
      AccountBalanceWei = new BigNumber(0);
      if(address)AccountBalanceWei = new BigNumber(await contract.methods.retrieveFullBalance(address).call());
    }
    catch(e){
      window.alert("error retrieving the account's balance : " + JSON.stringify(e))
    }
  }

  export async function RetrieveTreasuryBalance(contract){
    try{
      TreasuryBalanceWei = new BigNumber(await Aux.web3.eth.getBalance(Manager.TreasuryAddressProxy));
      TreasuryAggregatedBalanceWei = new BigNumber(await contract.methods.retrieveAggregatedAmount().call());
    }
    catch(e){
      window.alert("error retrieving the treasury balance : " + JSON.stringify(e))
    }
  }

  export async function AssignDividends(contract){
    await Aux.CallBackFrame(contract.methods.AssignDividends().send({from: Aux.account }));
  }

  export async function WithdrawAmount(amount, contract){
    let CheckAmount = ValidationFunc.validatePositiveFloat(amount);

    if(true == CheckAmount[1]){
      await Aux.CallBackFrame(contract.methods.withdraw(CheckAmount[0].multipliedBy(ETHFactor).dp(0, 1).toString()).send({from: Aux.account }));
    }
    else{
      ValidationFunc.FormatErrorMessage([CheckAmount[1]], ["Amount"]);
    }
  }

  export async function WithdrawAll(contract){
    await Aux.CallBackFrame(contract.methods.withdrawAll().send({from: Aux.account }));
  }