  // Treasury
const Contracts = require("./Contracts.js");
const Aux = require("./AuxiliaryFunctions.js");
const Manager = require("./ManagerFunctions.js");
const PriceConverter = require("./PriceConverterFunctions.js");
const BigNumber = require('bignumber.js');

export var LastAssigned = new BigNumber(0);
export var AccountBalance = new BigNumber(0);
export var TreasuryBalance = new BigNumber(0);
export var TreasuryAggregatedBalance = new BigNumber(0);

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

  export async function RetrievePricesTreasury(){
    let response = await Contracts.Treasury.methods.retrievePrices().call();
    PublicPriceUSD = response[0];
    PrivatePriceUSD = response[1];
    ProviderPriceUSD = response[2];
    CertificatePriceUSD = response[3];
    OwnerRefundFeeUSD = response[4];
    let exchangeRate = await PriceConverter.USDToEther(1);
    PublicPriceWei = PublicPriceUSD * exchangeRate;
    PrivatePriceWei = PrivatePriceUSD * exchangeRate;
    ProviderPriceWei = ProviderPriceUSD * exchangeRate;
    CertificatePriceWei = CertificatePriceUSD * exchangeRate;
    OwnerRefundFeeWei = OwnerRefundFeeUSD * exchangeRate;
  }

  export async function RetrievePendingPricesTreasury(){
    let response = await Contracts.Treasury.methods.retrieveProposition().call();
    PendingPublicPriceUSD = Number(response[0]);
    PendingPrivatePriceUSD = Number(response[1]);
    PendingProviderPriceUSD = Number(response[2]);
    PendingCertificatePriceUSD = Number(response[3]);
    PendingOwnerRefundFeeUSD = Number(response[4]);
  }
    

  export async function UpgradePricesTreasury(NewPublicPriceUSD, NewPrivatePriceUSD, NewProviderPriceUSD, NewCertificatePriceUSD, NewOwnerRefundFeeUSD){
    await Aux.CallBackFrame(Contracts.Treasury.methods.updatePrices(
      (new BigNumber(100 * NewPublicPriceUSD)).decimalPlaces(0),
      (new BigNumber(100 * NewPrivatePriceUSD)).decimalPlaces(0), 
      (new BigNumber(100 * NewProviderPriceUSD)).decimalPlaces(0),
      (new BigNumber(100 * NewCertificatePriceUSD)).decimalPlaces(0), 
      (new BigNumber(100 * NewOwnerRefundFeeUSD)).decimalPlaces(0)
    ).send({from: Aux.account }));
  }

  export async function RetrieveLastAssigned(address){
    LastAssigned = new BigNumber(await Contracts.Treasury.methods.retrieveLastAssigned(address).call());
  }

  export async function RetrieveBalance(address){
    AccountBalance = new BigNumber(await Contracts.Treasury.methods.retrieveBalance(address).call());
  }

  export async function RetrieveTreasuryBalance(){
    TreasuryBalance = new BigNumber(await Aux.web3.eth.getBalance(Manager.TreasuryAddressProxy));
    TreasuryAggregatedBalance = new BigNumber(await Contracts.Treasury.methods.retrieveAggregatedAmount().call());
  }

  export async function AssignDividends(){
    await Aux.CallBackFrame(Contracts.Treasury.methods.AssignDividends().send({from: Aux.account }));
  }

  export async function WithdrawAmount(amount){
    await Aux.CallBackFrame(Contracts.Treasury.methods.withdraw(amount).send({from: Aux.account }));
  }