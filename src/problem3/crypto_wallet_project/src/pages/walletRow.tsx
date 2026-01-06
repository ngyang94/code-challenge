

export default function WalletRow({amount,usdValue,formattedAmount,className}:{amount:number,usdValue:number,formattedAmount:string,className?:string}){

    return <>
        <div className={className}>
            <div>
                Amount: {amount}
            </div>
            <div>
                USD: {usdValue}
            </div>
            <div>
                Formatted Amount: {formattedAmount}
            </div>
        </div>
    </>;
}