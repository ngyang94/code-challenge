import { type ReactNode } from "react";

export interface WalletBalance {
    currency: string;
    amount: number;
    blockchain:string;
}
export interface FormattedWalletBalance extends WalletBalance{
    formatted: string;
}

export interface Props extends BoxProps {
    children: ReactNode;
}

export interface BoxProps {

}