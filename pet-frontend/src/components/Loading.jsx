import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {/* <p className="text-sm text-muted-foreground">Loading, please wait...</p> */}
      </div>
    </div>
  );
};

export default Loading;
