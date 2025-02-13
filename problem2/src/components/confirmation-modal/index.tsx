import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TOKEN_FOLDER } from "../currency-swap-form/type";
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputAmount: string;
  inputCurrency: string;
  outputAmount: string;
  outputCurrency: string;
  handleConfirmAction: () => void;
  isSwapping?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  inputAmount,
  inputCurrency,
  outputAmount,
  outputCurrency,
  isSwapping,
  handleConfirmAction,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    handleConfirmAction();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Currency Swap</DialogTitle>
          <DialogDescription>
            Please review the details of your currency swap:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">You are about to swap:</p>
          <p className="font-semibold flex items-center">
            <img
              src={`${TOKEN_FOLDER}/${inputCurrency}.svg`}
              width={20}
              height={20}
              alt={inputCurrency}
              className="mr-2"
            />
            {inputAmount} {inputCurrency} for
            <img
              src={`${TOKEN_FOLDER}/${outputCurrency}.svg`}
              width={20}
              height={20}
              alt={outputCurrency}
              className="ml-2 mr-2"
            />
            {outputAmount} {outputCurrency}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSwapping}>
            {isSwapping && <Loader2 className="animate-spin" />} Confirm Swap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}