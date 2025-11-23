import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useLocation } from "react-router-dom";

const EsewaPayment = () => {
  const location = useLocation();
  const passedAmount = location.state?.amount || "100";
  const [amount, setAmount] = useState(passedAmount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.amount) {
      setAmount(location.state.amount.toString());
    }
  }, [location.state]);

  // eSewa Config
  const isTestMode = true;
  const merchantCode = "EPAYTEST";
  const secretKey = "8gBm/:&EnhH.1/q";

  const successUrl = `${window.location.origin}/payment/success`;
  const failureUrl = `${window.location.origin}/payment/failed`;

  const transactionUuid = Date.now().toString();
  const totalAmount = (parseFloat(amount || "0")).toFixed(2);

  const generateSignature = () => {
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${merchantCode}`;
    const hash = CryptoJS.HmacSHA256(message, secretKey);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 10) return;

    setLoading(true);
    const signature = generateSignature();

    const form = document.createElement("form");
    form.method = "POST";
    form.action = isTestMode
      ? "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      : "https://epay.esewa.com.np/api/epay/main/v2/form";

    const fields = {
      amount: amount,
      tax_amount: "0",
      product_service_charge: "0",
      product_delivery_charge: "0",
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: merchantCode,
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature,
    };

    Object.keys(fields).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pay with eSewa</h1>
          <p className="text-gray-600 mt-2">Secure payment via eSewa Nepal</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6 text-center">
          <img
            src="https://esewa.com.np/common/images/esewa-logo.png"
            alt="eSewa"
            className="h-12 mx-auto"
          />
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (NPR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              min="10"
              required
            />
          </div>

          <div className="bg-gray-100 rounded-lg p-5 text-lg font-semibold text-right">
            Total: Rs. {totalAmount}
          </div>

          <button
            type="submit"
            disabled={loading || !amount || parseFloat(amount) < 10}
            className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
              loading || !amount || parseFloat(amount) < 10
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 active:scale-95"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Redirecting...
              </span>
            ) : (
              "Pay with eSewa"
            )}
          </button>

          {isTestMode && (
            <p className="text-center text-xs text-orange-600 mt-4 font-medium">
              TEST MODE • Use ID: 9800000000 | MPIN: 1111
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EsewaPayment;