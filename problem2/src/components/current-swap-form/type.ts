export const TOKEN_FOLDER =
  "https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens";

export interface CurrencyData {
  currency: string;
  price: number;
}

export interface SwapState {
  input: {
    amount: string;
    currency: string;
  };
  output: {
    amount: string;
    currency: string;
  };
}