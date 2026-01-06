import { useMemo } from "react";

import WalletRow from "./walletRow"; //created the missing WalletRow component
import type {WalletBalance,FormattedWalletBalance,Props} from "../models/models" //imported the data type/interface from models/models.ts
import {useWalletBalances,usePrices} from "../utils/utils";

// moved the data type/interface to models/model.ts file

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances(); 
    const prices = usePrices();

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
            if (balancePriority > -99) { //changed lhsPriority to balancePriority
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
            }
        });
    }, [balances, prices]);

    const formattedBalances:FormattedWalletBalance[] = sortedBalances.map((balance: WalletBalance) => { // added data type FormattedWalletBalance[] to variable formattedBalances
        return {
        ...balance,
        formatted: balance.amount.toFixed()
        }
    })

    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => { // changed sortedBalances variable to formattedBalances
        const usdValue = prices[balance.currency] * balance.amount;

        const classes = {
            row:["wallet"]
        }
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