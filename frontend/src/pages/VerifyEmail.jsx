import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  // Prevent duplicate verification request in React StrictMode
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );

        setStatus("success");
        setMessage(response.data.message);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Unable to verify your email."
        );
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("Verification token is missing.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">

        {/* Verifying */}
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-6 h-12 w-12 rounded-full border-4 border-gray-200 border-t-black animate-spin"></div>

            <h1 className="text-3xl font-bold text-gray-900">
              Verifying Email
            </h1>

            <p className="text-gray-500 mt-3">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <span className="text-2xl text-green-600">
                ✓
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Email Verified
            </h1>

            <p className="text-gray-500 mt-3">
              {message}
            </p>

            <Link
              to="/login"
              className="inline-block w-full mt-7 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Continue to Login
            </Link>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl text-red-600">
                !
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Verification Failed
            </h1>

            <p className="text-red-500 mt-3">
              {message}
            </p>

            <Link
              to="/login"
              className="inline-block w-full mt-7 border border-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Back to Login
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;