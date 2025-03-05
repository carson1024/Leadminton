import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

function RegisterModalBody({onClose}: {
  onClose: () => void
}) {
  const [errorText, setErrorText] = useState('');
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [code, setCode] = useState("");
  const [managerName, setManagerName] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [step, setStep] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    setErrorText('');
    setManagerName('');
    setName('');
    setSurname('');
    setEmail('');
    setPw('');
    setConfirmPw('');
    const checkUserSession = async () => {
      if (user && !user.email_confirmed_at) {
        setStep(1);
        setEmail(user.email as string);
      }
    };

    checkUserSession();
  }, []);

  const handleRegister = async () => {
    if (!managerName || !name || !surname) {
      setErrorText('Name Fields required');
      return;
    }
    if (!email) {
      setErrorText('Email required');
      return;
    }
    if (!pw) {
      setErrorText('Password required');
      return;
    }
    if (pw.length < 6) {
      setErrorText('Password length must be at least 6.');
      return;
    }
    if (!confirmPw) {
      setErrorText('Password does not match');
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: pw,
      options: {
        data: {
          manager_name: managerName,
          name: name,
          surname: surname
        },
      }
    });
    if (error) {
      console.error("Registration Error:", error.message);
    } else if (data.user) {
      onClose();
      // setStep(1);
    }
  };

  const handleCode = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: "signup",
    });

    if (error) {
      console.error("Error verifying OTP:", error);
    } else {
      onClose();
    }
  };

  return (
    <div>
      {step === 0 ? (
        <div className="space-y-4">
          <div className="form-group">
            <label>Manager Name</label>
            <input
              type="text"
              value={managerName}
              placeholder="Manager Name"
              onChange={(e) => {
                setManagerName(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              placeholder="Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Surname</label>
            <input
              type="text"
              value={surname}
              placeholder="Surname"
              onChange={(e) => {
                setSurname(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={pw}
              placeholder="Password"
              onChange={(e) => {
                setPw(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPw}
              placeholder="Confirm Password"
              onChange={(e) => {
                setConfirmPw(e.target.value);
              }}
            />
          </div>
          <div className="error">{errorText}</div>
          
          <button className="btn w-full"
            onClick={async () => {
              await handleRegister();
            }}
          >
            Register
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            className="w-full"
            type="text"
            value={code}
            placeholder="VERIFICATION CODE"
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
          <button className="btn w-full"
            onClick={async () => {
              await handleCode();
            }}
          >
            Confirm Email
          </button>
        </div>
      )}
    </div>
  );
}

export default RegisterModalBody;