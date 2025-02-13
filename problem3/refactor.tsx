interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
  }
  
  interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
  }
  
  interface Props extends BoxProps {}
  
  const WalletPage: React.FC<Props> = (props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();
  
    // Define blockchain priority
    const getPriority = (blockchain: string): number => {
      const priorities: Record<string, number> = {
        Osmosis: 100,
        Ethereum: 50,
        Arbitrum: 30,
        Zilliqa: 20,
        Neo: 20,
      };
      return priorities[blockchain] ?? -99;
    };
  
    // Sort balances based on priority
    const sortedBalances = useMemo(() => {
      return balances
        .filter((balance) => {
          const priority = getPriority(balance.blockchain);
          return priority > -99 && balance.amount > 0;
        })
        .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
    }, [balances]);
  
    // Format balances
    const formattedBalances: FormattedWalletBalance[] = useMemo(
      () =>
        sortedBalances.map((balance) => ({
          ...balance,
          formatted: balance.amount.toFixed(2),
        })),
      [sortedBalances]
    );
  
    return (
      <div {...rest}>
        {formattedBalances.map((balance, index) => {
          const usdValue = prices[balance.currency] * balance.amount;
          return (
            <WalletRow
              className={classes.row}
              key={index}
              amount={balance.amount}
              usdValue={usdValue}
              formattedAmount={balance.formatted}
            />
          );
        })}
      </div>
    );
  };