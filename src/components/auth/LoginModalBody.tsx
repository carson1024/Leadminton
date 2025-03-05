import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

function LoginModalBody({onClose}: {
  onClose: () => void
}) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(0);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pw,
    });

    if (error) {
      if (error.message === "Email not confirmed") {
        setStep(1);
      }
      return;
    }

    if (data.session) {
      // if (!data.user.email_confirmed_at) {
      //   setStep(1);
      // } else {
      // }
      onClose();
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      handleLogin();
    }
  };

  const handleConfirmCode = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: "signup",
    });

    if (error) {
      console.error("Error verifying OTP:", error.message);
      return;
    }
    onClose();
  };

  const requestNewCode = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email
    );

    if (error) {
      console.error("Error requesting new verification code:", error.message);
    } else {
      alert("A new verification code has been sent to your email.");
    }
  };

  return (
    <div>
      {step === 0 ? (
        <div className="space-y-4">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-0.5">
            <button
              onClick={async () => {
                await handleLogin();
              }}
              className="btn w-full"
            >
              Login
            </button>
            <button className="btn-outline w-full" onClick={async () => await requestNewCode()}>
              Forgot Password?
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            className="w-full"
            type="text"
            value={code}
            placeholder="Enter your confirmation code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="btn w-full"
            onClick={async () => {
              await handleConfirmCode();
            }}
          >
            Confirm Email
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginModalBody;