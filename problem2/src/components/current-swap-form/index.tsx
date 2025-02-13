"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, ArrowDownUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ConfirmationModal from "../confirmation-modal";
import { usePriceData } from "@/utils/usePriceData";
import { SwapState, TOKEN_FOLDER } from "./type";

export default function CurrencySwapForm() {
  const { priceData, loading, error } = usePriceData();
  const [swapState, setSwapState] = useState<SwapState>({
    input: {
      amount: "",
      currency: "USD",
    },
    output: {
      amount: "",
      currency: "ETH",
    },
  });
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const currencyPrices = useMemo(() => {
    return priceData.reduce((acc, curr) => {
      acc[curr.currency] = curr.price;
      return acc;
    }, {} as Record<string, number>);
  }, [priceData]);

  useEffect(() => {
    const { amount: inputAmount, currency: inputCurrency } = swapState.input;
    const { currency: outputCurrency } = swapState.output;

    if (inputAmount && inputCurrency && outputCurrency) {
      const inputPrice = currencyPrices[inputCurrency] || 0;
      const outputPrice = currencyPrices[outputCurrency] || 0;

      if (inputPrice && outputPrice) {
        const result = (parseFloat(inputAmount) * inputPrice) / outputPrice;
        setSwapState((prev) => ({
          ...prev,
          output: {
            ...prev.output,
            amount: result.toFixed(6),
          },
        }));
      }
    }
  }, [swapState.input, swapState.output.currency, currencyPrices]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setSwapState((prev) => ({
        ...prev,
        input: {
          ...prev.input,
          amount: value,
        },
        output: {
          ...prev.output,
          amount: value ? prev.output.amount : "",
        },
      }));
      setFormError("");
    }
  };

  const handleSwap = () => {
    setSwapState((prev) => ({
      input: {
        amount: prev.output.amount,
        currency: prev.output.currency,
      },
      output: {
        amount: prev.input.amount,
        currency: prev.input.currency,
      },
    }));
  };

  const handleCurrencyChange = (type: "input" | "output", value: string) => {
    setSwapState((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        currency: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    if (!swapState.input.amount || parseFloat(swapState.input.amount) <= 0) {
      setFormError("Please enter a valid amount");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsModalOpen(true);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Currency Swap</CardTitle>
        <CardDescription>
          Exchange your currency quickly and easily
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-amount">Amount to send</Label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <Input
                  id="input-amount"
                  type="text"
                  value={swapState.input.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <img
                    src={`${TOKEN_FOLDER}/${swapState.input.currency}.svg`}
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <Select
                value={swapState.input.currency}
                onValueChange={(value) => handleCurrencyChange("input", value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {priceData.map((data) => (
                    <SelectItem
                      key={data.currency}
                      value={data.currency}
                      onChange={handleInputChange}
                    >
                      <div className="flex items-center">
                        <img
                          src={`${TOKEN_FOLDER}/${data.currency}.svg`}
                          width={16}
                          height={16}
                          alt={data.currency}
                          className="mr-2"
                        />
                        {data.currency}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleSwap}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="output-amount">Amount to receive</Label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <Input
                  id="output-amount"
                  type="text"
                  value={swapState.output.amount}
                  readOnly
                  className="pl-10"
                  placeholder="0.00"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <img
                    src={`${TOKEN_FOLDER}/${swapState.output.currency}.svg`}
                    width={16}
                    height={16}
                    alt={swapState.output.currency}
                  />
                </div>
              </div>
              <Select
                value={swapState.output.currency}
                onValueChange={(value) => handleCurrencyChange("output", value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {priceData.map((data) => (
                    <SelectItem key={data.currency} value={data.currency}>
                      <div className="flex items-center">
                        <img
                          src={`${TOKEN_FOLDER}/${data.currency}.svg`}
                          width={16}
                          height={16}
                          alt={data.currency}
                          className="mr-2"
                        />
                        {data.currency}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            CONFIRM SWAP
          </Button>
        </form>
      </CardContent>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isSwapping={isSwapping}
        handleConfirmAction={async () => {
          setIsSwapping(true);
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 4000));
          setIsSwapping(false);
          setIsModalOpen(false);
        }}
        inputAmount={swapState.input.amount}
        inputCurrency={swapState.input.currency}
        outputAmount={swapState.output.amount}
        outputCurrency={swapState.output.currency}
      />
    </Card>
  );
}