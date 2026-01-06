import { useMemo } from "react";

import WalletRow from "./walletRow"; //(refactor) : created the missing WalletRow component
import type {WalletBalance,FormattedWalletBalance,Props} from "../models/models" // (refactor) : moved the data type/interface to models file and imported for use
import {useWalletBalances,usePrices} from "../utils/utils"; // (refactor) : created dummy data at util file and import for use

// (refactor) : moved the data type/interface to models/model.ts file

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances(); 
    const prices:any = usePrices();

    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
        case 'Osmosis':
            return 100
        case 'Ethereum':
            return 50
        case 'Arbitrum':
            return 30
        case 'Zilliqa':
            return 20
        case 'Neo':
            return 20
        default:
            return -99
        }
    }

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (balancePriority > -99) { //(refactor) : changed lhsPriority to balancePriority
                if (balance.amount <= 0) {
                return true;
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }else{
                return 0; // (anti-patterns): possible rightPriority==leftPriority and caused no return, so add else with return 0 
            }
        });
    }, [balances]);// (computational inefficiencies): removed prices from checking because price will not cause any changes to this sortedBalances variable
    
    const formattedBalances:FormattedWalletBalance[] = sortedBalances.map((balance: WalletBalance) => { // (refactor) : added data type FormattedWalletBalance[] to variable formattedBalances
        return {
        ...balance,
        formatted: balance.amount.toFixed()
        }
    })

    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => { // (anti-patterns): changed sortedBalances variable to formattedBalances because formattedBalances has all the data for render
        const usdValue = prices[balance.currency] * balance.amount;

        const classes = {
            row:"card"
        }// (refactor) : added missing variable classes
        
        return (
            <WalletRow 
                className={classes.row}
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })

    return (
        <div {...rest}>
        {rows}
        </div>
    )
}

export default WalletPage;