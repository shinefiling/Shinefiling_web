import { useState } from 'react';
import { loadRazorpayScript } from '../utils/razorpay';
import { createRazorpayOrder, RAZORPAY_KEY_ID } from '../api';

export const useRazorpay = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const processPayment = async ({ amount, description, prefill, onSuccess, onDismiss }) => {
        setIsProcessing(true);
        try {
            // 1. Load Razorpay Script
            const res = await loadRazorpayScript();
            if (!res) {
                alert("Razorpay SDK failed to load. Please check your connection.");
                setIsProcessing(false);
                return;
            }

            // 2. Create Order
            const order = await createRazorpayOrder(amount);
            if (!order || !order.id) {
                alert("Failed to create payment order.");
                setIsProcessing(false);
                return;
            }

            // 3. Configure Checkout
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "ShineFiling India",
                description: description || "Service Payment",
                order_id: order.id,
                handler: (response) => {
                    setIsProcessing(false);
                    onSuccess(response);
                },
                prefill: prefill || {},
                theme: {
                    color: "#043E52",
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        if (onDismiss) onDismiss();
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Razorpay Error:", error);
            alert("Payment initialization failed: " + error.message);
            setIsProcessing(false);
        }
    };

    return { processPayment, isProcessing };
};
