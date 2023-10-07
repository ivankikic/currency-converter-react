import './App.css';
import CurrencyRow from './CurrencyRow';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_OLFoGRVthUQIZ2EnmChfqDB4VhYdUWU5lvIYoKYV';

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [amout, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [exchangeRate, setExchangeRate] = useState();

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amout;
    toAmount = amout * exchangeRate;
  } else {
    toAmount = amout;
    fromAmount = amout / exchangeRate;
  }

  useEffect(() => {
    axios.get(BASE_URL).then(res => {
      const currencies = res.data.data;
      let keys = Object.keys(currencies);
      let values = Object.values(currencies);
      const currencyArray = [];
      for (let i = 0; i < keys.length; i++) {
        currencyArray.push({ key: keys[i], value: values[i] });
      }
      const baseCurrency = currencyArray.find(currency => currency.value === 1);
      keys = keys.filter(key => key !== baseCurrency.key);
      values = values.filter(value => value !== 1);
      setCurrencyOptions([baseCurrency.key, ...keys])
      setFromCurrency(baseCurrency.key);
      setToCurrency(keys[0]);
      setExchangeRate(values[0]);
    })
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      axios.get(`${BASE_URL}&base_currency=${fromCurrency}&currencies=${toCurrency}`).then(res => {
        setExchangeRate(res.data.data[toCurrency]);
      })
    }
  }, [fromCurrency, toCurrency]);

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  const handleToAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className='equal'>=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
