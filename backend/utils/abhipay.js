const crypto = require('crypto');

class AbhipayService {
  constructor() {
    this.merchantId = process.env.ABHIPAY_MERCHANT_ID;
    this.apiKey = process.env.ABHIPAY_API_KEY;
    this.secretKey = process.env.ABHIPAY_SECRET_KEY;
    this.baseUrl = process.env.ABHIPAY_BASE_URL || 'https://api.abhipay.com';
  }

  // Generate signature for API requests
  generateSignature(data, secretKey) {
    const sortedData = Object.keys(data)
      .sort()
      .reduce((result, key) => {
        result[key] = data[key];
        return result;
      }, {});

    const queryString = Object.keys(sortedData)
      .map(key => `${key}=${sortedData[key]}`)
      .join('&');

    return crypto
      .createHmac('sha256', secretKey)
      .update(queryString)
      .digest('hex');
  }

  // Create payment request
  async createPayment(paymentData) {
    try {
      const {
        amount,
        currency = 'USD',
        orderId,
        customerEmail,
        customerPhone,
        description,
        returnUrl,
        cancelUrl
      } = paymentData;

      const requestData = {
        merchant_id: this.merchantId,
        amount: amount.toString(),
        currency,
        order_id: orderId,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        description: description || 'Ecommerce Store Payment',
        return_url: returnUrl,
        cancel_url: cancelUrl,
        timestamp: Math.floor(Date.now() / 1000).toString()
      };

      // Generate signature
      const signature = this.generateSignature(requestData, this.secretKey);
      requestData.signature = signature;

      // Make API request to Abhipay
      const response = await fetch(`${this.baseUrl}/api/v1/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Payment creation failed');
      }

      return {
        success: true,
        paymentId: result.payment_id,
        paymentUrl: result.payment_url,
        qrCode: result.qr_code,
        data: result
      };
    } catch (error) {
      console.error('Abhipay payment creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify payment status
  async verifyPayment(paymentId) {
    try {
      const requestData = {
        merchant_id: this.merchantId,
        payment_id: paymentId,
        timestamp: Math.floor(Date.now() / 1000).toString()
      };

      const signature = this.generateSignature(requestData, this.secretKey);
      requestData.signature = signature;

      const response = await fetch(`${this.baseUrl}/api/v1/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Payment verification failed');
      }

      return {
        success: true,
        status: result.status,
        amount: result.amount,
        currency: result.currency,
        orderId: result.order_id,
        data: result
      };
    } catch (error) {
      console.error('Abhipay payment verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund payment
  async refundPayment(paymentId, amount, reason = 'Customer request') {
    try {
      const requestData = {
        merchant_id: this.merchantId,
        payment_id: paymentId,
        amount: amount.toString(),
        reason,
        timestamp: Math.floor(Date.now() / 1000).toString()
      };

      const signature = this.generateSignature(requestData, this.secretKey);
      requestData.signature = signature;

      const response = await fetch(`${this.baseUrl}/api/v1/payments/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Refund failed');
      }

      return {
        success: true,
        refundId: result.refund_id,
        status: result.status,
        data: result
      };
    } catch (error) {
      console.error('Abhipay refund error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payment history
  async getPaymentHistory(filters = {}) {
    try {
      const {
        startDate,
        endDate,
        status,
        page = 1,
        limit = 10
      } = filters;

      const requestData = {
        merchant_id: this.merchantId,
        page: page.toString(),
        limit: limit.toString(),
        timestamp: Math.floor(Date.now() / 1000).toString()
      };

      if (startDate) requestData.start_date = startDate;
      if (endDate) requestData.end_date = endDate;
      if (status) requestData.status = status;

      const signature = this.generateSignature(requestData, this.secretKey);
      requestData.signature = signature;

      const response = await fetch(`${this.baseUrl}/api/v1/payments/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch payment history');
      }

      return {
        success: true,
        payments: result.payments,
        pagination: result.pagination,
        data: result
      };
    } catch (error) {
      console.error('Abhipay payment history error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Validate webhook signature
  validateWebhookSignature(payload, signature, secretKey) {
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
}

module.exports = new AbhipayService();