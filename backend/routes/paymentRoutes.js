const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');



router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    console.log('📝 Creating Razorpay order:', { amount, currency, receipt });

    // Call Razorpay API
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: amount, // in paise
        currency: currency,
        receipt: receipt,
        payment_capture: 1 // auto-capture
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET
        }
      }
    );

    console.log('✅ Order created:', response.data.id);

    return res.json({
      success: true,
      orderId: response.data.id,
      amount: response.data.amount,
      currency: response.data.currency
    });

  } catch (error) {
    console.error('❌ Error creating order:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// ============================================
// VERIFY RAZORPAY PAYMENT
// ============================================

/**
 * POST /api/payments/verify-payment
 * Verify Razorpay payment signature
 * 
 * Body:
 * {
 *   orderId: string,
 *   paymentId: string,
 *   signature: string,
 *   bookingData: object
 * }
 */

router.post('/verify-payment', async (req, res) => {
  try {
    const { orderId, paymentId, signature, bookingData } = req.body;

    console.log('🔐 Verifying payment:', { orderId, paymentId });

    // Verify signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('❌ Signature verification failed');
      return res.status(400).json({
        success: false,
        message: 'Signature verification failed'
      });
    }

    console.log('✅ Payment verified successfully');

    // TODO: Save booking to database
    // TODO: Send confirmation email
    // TODO: Update user's bookings

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      bookingData: bookingData
    });

  } catch (error) {
    console.error('❌ Error verifying payment:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

// ============================================
// GET PAYMENT STATUS
// ============================================

/**
 * GET /api/payments/status/:paymentId
 * Get payment status from Razorpay
 */

router.get('/status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const response = await axios.get(
      `https://api.razorpay.com/v1/payments/${paymentId}`,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET
        }
      }
    );

    return res.json({
      success: true,
      status: response.data.status,
      amount: response.data.amount,
      currency: response.data.currency,
      createdAt: new Date(response.data.created_at * 1000)
    });

  } catch (error) {
    console.error('❌ Error getting payment status:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment status'
    });
  }
});

// ============================================
// REFUND PAYMENT
// ============================================

/**
 * POST /api/payments/refund
 * Refund a payment
 * 
 * Body:
 * {
 *   paymentId: string,
 *   amount: number (optional, in paise)
 * }
 */

router.post('/refund', async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    console.log('💰 Processing refund:', { paymentId, amount });

    const refundData = {
      payment_id: paymentId
    };

    if (amount) {
      refundData.amount = amount; // in paise
    }

    const response = await axios.post(
      'https://api.razorpay.com/v1/payments/' + paymentId + '/refund',
      refundData,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET
        }
      }
    );

    console.log('✅ Refund processed:', response.data.id);

    return res.json({
      success: true,
      refundId: response.data.id,
      status: response.data.status,
      amount: response.data.amount
    });

  } catch (error) {
    console.error('❌ Error processing refund:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
});

module.exports = router;


