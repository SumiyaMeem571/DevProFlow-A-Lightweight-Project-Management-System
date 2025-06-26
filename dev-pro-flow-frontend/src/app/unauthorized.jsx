import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Unauthorized() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Alert className="max-w-md bg-white shadow-md">
        <AlertTitle className="text-xl font-bold text-red-600">
          Access Denied
        </AlertTitle>
        <AlertDescription className="mt-2 text-gray-600">
          You do not have permission to view this page. Please contact your
          administrator if you believe this is a mistake.
        </AlertDescription>
      </Alert>
    </div>
  );
}
