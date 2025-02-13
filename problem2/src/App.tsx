import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SwapForm from "./components/SwapForm";
const queryClient = new QueryClient();

export default function App() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100%"
    >
      <QueryClientProvider client={queryClient}>
        <SwapForm />
      </QueryClientProvider>
    </Box>
  );
}