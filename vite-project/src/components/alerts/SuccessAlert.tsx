import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle } from "lucide-react";

const SuccessAlert = ({ msg }: { msg: string }) => {
  return (
    <Alert className="border-green-500 bg-green-950 text-green-300">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{msg}</AlertDescription>
    </Alert>
  );
};

export default SuccessAlert;
