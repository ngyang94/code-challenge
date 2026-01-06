import type {WalletBalance} from "../models/models"

export const useWalletBalances = ():WalletBalance[]=>{

    return [
        {
            currency: "Osmosis",
            amount: -1000,
            blockchain:"Osmosis",
        },
        {
            currency: "Ethereum",
            amount: 1000,
            blockchain:"Ethereum",
        },
        {
            currency: "Arbitrum",
            amount: -1000,
            blockchain:"Arbitrum",
        },
        {
            currency: "Neo",
            amount: 1000,
            blockchain:"Neo",
        },
        {
            currency: "Zilliqa",
            amount: 1000,
            blockchain:"Zilliqa",
        },
    ]
}

export const usePrices = ()=>{
    return {
        "Osmosis":100,
        "Ethereum":100,
        "Arbitrum":100,
        "Neo":100,
        "Zilliqa":100,
    }
}