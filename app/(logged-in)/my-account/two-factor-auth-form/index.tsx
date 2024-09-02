"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { get2faSecret } from "./action";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

type TwoFactorActivatedProps = {
  twoFactorActivated: boolean;
};

function TwoFactorAuthForm({ twoFactorActivated }: TwoFactorActivatedProps) {
  const { toast } = useToast();

  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");

  const handleEnableClick = async () => {
    const response = await get2faSecret();

    if (response?.error) {
      toast({
        variant: "destructive",
        title: response?.message,
      });
      return;
    }

    setStep(2);
    setCode(response?.twoFactorSecret ?? "");
  };

  return (
    <div>
      {!isActivated && (
        <div>
          {step === 1 && (
            <Button onClick={handleEnableClick}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === 2 && (
            <div>
              <p className="py-2 text-xs text-muted-foreground">
                Scan the QR code below in the Google Authenticator app to
                activate Two-Factor Authentication.
              </p>
              <QRCodeSVG value={code} />
              <Button onClick={() => setStep(3)} className="my-2 w-full">
                I have scanned the QR Code
              </Button>
              <Button
                variant="outline"
                className="my-2 w-full"
                onClick={() => setStep(1)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TwoFactorAuthForm;