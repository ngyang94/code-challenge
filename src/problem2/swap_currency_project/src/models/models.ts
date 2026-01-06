export type swapCurFormType = {
  inputAmount:{
    value:string,
    validated:boolean,
    invalidFeedback:string,
  },
  inputAmountExchangeCurrency:{
    currency:string,
    price:number|"",
    validated:boolean,
    invalidFeedback:string,
  },
  outputAmountExchangeCurrency:{
    currency:string,
    price:number|"",
    validated:boolean,
    invalidFeedback:string,
  },
  outputAmount:{
    value:number|"",
  }
}

export type currencyExchangeType = {
  currency:string,
  price:number|""
}