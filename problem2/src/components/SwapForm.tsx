import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    SnackbarCloseReason,
    TextField,
    Typography,
  } from "@mui/material";
  import { useQuery } from "@tanstack/react-query";
  import axios from "axios";
  import { useEffect, useState } from "react";
  import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { API_PRICES_URL, TOKEN_ICONS_URL } from "../constants";
  
  // Fetch function to retrieve prices data
  const fetchPrices = async () => {
    const { data } = await axios.get(API_PRICES_URL);
    return data;
  };
  
  interface Price {
    currency: string;
    date: string;
    price: number;
  }
  
  interface FormData {
    amount: string;
    from: string;
    to: string;
  }
  
  const SwapForm = () => {
    const [open, setOpen] = useState(false);
  
    const handleClose = (
      event: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason
    ) => {
      if (reason === "clickaway") {
        return;
      }
      reset();
      setConvertedAmount("");
      setOpen(false);
    };
  
    // Query hook for fetching prices data
    const { data: prices, isLoading } = useQuery({
      queryKey: ["prices"],
      queryFn: fetchPrices,
    }) as { data: Price[]; isLoading: boolean };
  
    const {
      control,
      handleSubmit,
      watch,
      reset,
      formState: { errors },
    } = useForm<FormData>();
    const [convertedAmount, setConvertedAmount] = useState<string>("");
  
    // Watch form values
    const amount = watch("amount");
    const from = watch("from");
    const to = watch("to");
  
    // Function to convert amount based on selected currencies
    useEffect(() => {
      if (amount && from && to && prices) {
        const fromPrice = prices.find((price) => price.currency === from)?.price;
        const toPrice = prices.find((price) => price.currency === to)?.price;
  
        if (fromPrice && toPrice) {
          const result = (parseFloat(amount) * fromPrice) / toPrice;
          setConvertedAmount(result.toFixed(2));
        }
      }
    }, [amount, from, to, prices]);
  
    const onSubmit: SubmitHandler<FormData> = () => {
      setOpen(true);
    };
  
    if (isLoading) {
      return <Typography>Loading...</Typography>;
    }
  
    return (
      <Box
        width={560}
        mx="auto"
        p={3}
        borderRadius={2}
        boxShadow={3}
        bgcolor="white"
        gap={2}
        display={"flex"}
        flexDirection={"column"}
      >
        <Typography
          style={{
            color: "black",
          }}
          variant="h5"
          fontWeight="bold"
          display={"flex"}
          justifyContent={"center"}
          mb={2}
        >
          Swap
        </Typography>
  
        {/* Amount Input */}
        <Controller
          name="amount"
          control={control}
          defaultValue=""
          rules={{ required: "Amount is required", pattern: /^[0-9]*\.?[0-9]+$/ }}
          render={({ field }) => (
            <TextField
              fullWidth
              label="Amount to send"
              type="number"
              variant="outlined"
              {...field}
              margin="normal"
              error={!!errors.amount}
              helperText={errors.amount ? String(errors.amount.message) : ""}
            />
          )}
        />
  
        {/* From Currency Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="from">From</InputLabel>
          <Controller
            name="from"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                labelId="from"
                sx={{
                  ".MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              >
                {prices?.map((price) => (
                  <MenuItem
                    key={price.currency}
                    value={price.currency}
                    style={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={`${TOKEN_ICONS_URL}/${price.currency}.svg`}
                      alt={price.currency}
                      width={16}
                      height={16}
                      style={{ marginRight: 8 }}
                    />
                    {price.currency}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
  
        {/* To Currency Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="to">To</InputLabel>
          <Controller
            name="to"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                labelId="to"
                sx={{
                  ".MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              >
                {prices?.map((price) => (
                  <MenuItem
                    key={price.currency}
                    value={price.currency}
                    style={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={`${TOKEN_ICONS_URL}/${price.currency}.svg`}
                      alt={price.currency}
                      width={16}
                      height={16}
                      style={{ marginRight: 8 }}
                    />
                    {price.currency}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
  
        {/* Amount to Receive */}
        <TextField
          fullWidth
          label="Amount to receive"
          variant="outlined"
          value={convertedAmount}
          margin="normal"
          InputProps={{ readOnly: true }}
        />
  
        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || open}
          sx={{ mt: 2 }}
        >
          {isLoading ? "Loading..." : "Confirm Swap"}
        </Button>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          message={`Swap confirmed! From ${from} to ${to} for ${convertedAmount}`}
        />
      </Box>
    );
  };
  
  export default SwapForm;