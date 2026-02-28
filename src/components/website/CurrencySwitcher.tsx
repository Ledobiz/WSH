'use client'

import { useCart } from "@/src/providers/CartProvider"

const CurrencySwitcher = ({ className }: { className?: string }) => {
    const { currency, changeCurrency } = useCart();
    const currencies = ['NGN', 'GHS', 'KES', 'UGX', 'XAF', 'XOF', 'ZAR', 'ZMW', 'ZWL', 'USD', 'GBP', 'EUR', 'CAD'];

    const handleCurrencyChange = (newCurrency: string) => {
        // Fire-and-forget; internal logic will fetch rates if needed
        void changeCurrency(newCurrency);
    };

    return (
        <div className={`currency-switcher ${className}`}>
            <select 
                value={currency} 
                onChange={(e) => handleCurrencyChange(e.target.value)}
                style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    cursor: 'pointer'
                }}
            >
                {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                        {curr}
                    </option>
                ))}
            </select>
        </div>
    )
}
export default CurrencySwitcher