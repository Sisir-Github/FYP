import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

// Hardcoded baseline conversion logic (NPR is baseline mapping point where 1 NPR = X Currency)
const exchangeRates = {
    NPR: 1,
    USD: 0.0075,
    EUR: 0.0069,
    GBP: 0.0059,
    INR: 0.625,
    AUD: 0.011
};

const currencySymbols = {
    NPR: 'Rs.',
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AUD: 'A$'
};

export const CurrencyProvider = ({ children }) => {
    // Read from localStorage or fallback to NPR
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('app_currency') || 'NPR';
    });

    useEffect(() => {
        localStorage.setItem('app_currency', currency);
    }, [currency]);

    // Format a base NPR price into the active localized view
    const formatPrice = (amountInNPR) => {
        const rate = exchangeRates[currency] || 1;
        const symbol = currencySymbols[currency] || 'Rs.';
        const converted = (amountInNPR * rate).toFixed(2);
        
        // Minor formatting logic dropping .00 if clean
        const cleanAmount = converted.endsWith('.00') ? converted.slice(0, -3) : converted;
        return `${symbol}${cleanAmount}`;
    };

    // Calculate raw numeric value for math (like Khalti displays vs API bodies)
    const getConvertedValue = (amountInNPR) => {
        const rate = exchangeRates[currency] || 1;
        return Number((amountInNPR * rate).toFixed(2));
    };

    const value = {
        currency,
        setCurrency,
        formatPrice,
        getConvertedValue,
        conversionRateUsed: exchangeRates[currency] || 1
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
