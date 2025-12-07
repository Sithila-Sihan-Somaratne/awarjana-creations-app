import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { XCircle } from "lucide-react";

const ErrorAlert = ({ msg }: { msg: string }) => {
  return (
    <Alert className="border-red-500 bg-red-950 text-red-300">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{msg}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
