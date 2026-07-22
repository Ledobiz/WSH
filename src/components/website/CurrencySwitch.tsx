'use client';

import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";

import { useCart, currencies, CurrencyCode } from "@/src/providers/CartProvider"

const CurrencySwitch = () => {
    const { currency, changeCurrency, allCurrencies } = useCart();
    const current = currencies[currency as CurrencyCode];

    const handleCurrencyChange = (newCurrency: string) => {
        // Fire-and-forget; internal logic will fetch rates if needed
        void changeCurrency(newCurrency as CurrencyCode);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors cursor-pointer">
                    <img src={current.flag} className="w-5 h-5" />
                    <span className="text-foreground">{current.code}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                {allCurrencies.map((code) => {
                    const info = currencies[code];

                    return (
                        <DropdownMenuItem
                            key={code}
                            onClick={() => handleCurrencyChange(code)}
                            className={`flex items-center gap-3 cursor-pointer ${currency === code ? "bg-primary/10 text-primary" : ""}`}
                        >
                            <img src={info.flag} className="w-5 h-5" />
                            <div className="flex-1">
                                <span className="font-medium">{info.code}</span>
                                <span className="text-muted-foreground text-xs ml-1.5">{info.symbol}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{info.name.split(" ").pop()}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CurrencySwitch;
