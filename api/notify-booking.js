// File: /api/notify-booking.js
// Sends booking confirmation emails to customers and admin

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const SENDER_EMAIL = process.env.SENDER_EMAIL || 'Maid To Clean <onboarding@resend.dev>';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'stephanie.maidtoclean@gmail.com';
  const BASE_URL = process.env.BASE_URL || 'https://maid-to-clean-ashen.vercel.app';

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const { 
      customerEmail, 
      customerName, 
      serviceName, 
      appointmentDate, 
      appointmentTime, 
      notes,
      type // 'new_booking', 'approved', 'payment_confirmed'
    } = req.body;

    let customerSubject, customerHtml, adminSubject, adminHtml;

    if (type === 'new_booking') {
      customerSubject = 'Booking Request Received - Maid To Clean';
      customerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0F172A 0%, #1e293b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .details p { margin: 8px 0; }
            .label { font-weight: 600; color: #0F172A; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Maid To Clean</h1>
            </div>
            <div class="content">
              <h2>Thank You, ${customerName || 'Valued Customer'}!</h2>
              <p>We've received your booking request and will review it shortly. You'll receive a confirmation email once approved.</p>
              <div class="details">
                <p><span class="label">Service:</span> ${serviceName}</p>
                <p><span class="label">Date:</span> ${appointmentDate}</p>
                <p><span class="label">Time:</span> ${appointmentTime}</p>
                ${notes ? `<p><span class="label">Notes:</span> ${notes}</p>` : ''}
              </div>
              <p>If you have any questions, feel free to reach out:</p>
              <p>📞 <a href="tel:+13344254566">(334) 425-4566</a></p>
              <p>📧 <a href="mailto:stephanie.maidtoclean@gmail.com">stephanie.maidtoclean@gmail.com</a></p>
            </div>
            <div class="footer">
              <p>Polishing Homes, Empowering Communities, Building Relationships That Last.</p>
              <p>&copy; 2026 Maid To Clean</p>
            </div>
          </div>
        </body>
        </html>
      `;

      adminSubject = `🆕 New Booking Request - ${customerName || customerEmail}`;
      adminHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0F172A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #06B6D4; }
            .btn { display: inline-block; background: #06B6D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Booking Request</h1>
            </div>
            <div class="content">
              <p>A new booking request has been submitted:</p>
              <div class="details">
                <p><strong>Customer:</strong> ${customerName || 'Not provided'}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                <p><strong>Service:</strong> ${serviceName}</p>
                <p><strong>Date:</strong> ${appointmentDate}</p>
                <p><strong>Time:</strong> ${appointmentTime}</p>
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
              </div>
              <a href="${BASE_URL}/admin/admin-customers.html" class="btn">Review in Admin Panel</a>
            </div>
          </div>
        </body>
        </html>
      `;

    } else if (type === 'approved') {
      customerSubject = '✅ Booking Approved - Maid To Clean';
      customerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .btn { display: inline-block; background: linear-gradient(90deg, #06B6D4 0%, #3B82F6 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; margin-top: 15px; font-weight: 600; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Approved!</h1>
            </div>
            <div class="content">
              <h2>Great news, ${customerName || 'Valued Customer'}!</h2>
              <p>Your cleaning appointment has been approved and is ready for payment.</p>
              <div class="details">
                <p><strong>Service:</strong> ${serviceName}</p>
                <p><strong>Date:</strong> ${appointmentDate}</p>
                <p><strong>Time:</strong> ${appointmentTime}</p>
              </div>
              <p>Please complete your payment to confirm your booking:</p>
              <a href="${BASE_URL}/dashboard/payments.html" class="btn">Complete Payment</a>
              <p style="margin-top: 20px; color: #64748b;">Questions? Call us at (334) 425-4566</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Maid To Clean</p>
            </div>
          </div>
        </body>
        </html>
      `;
      adminHtml = null;

    } else if (type === 'payment_confirmed') {
      customerSubject = '💳 Payment Confirmed - Maid To Clean';
      customerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0F172A 0%, #1e293b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Maid To Clean</h1>
            </div>
            <div class="content">
              <h2>Payment Confirmed!</h2>
              <p>Thank you for your payment. Your cleaning service is now scheduled and confirmed.</p>
              <div class="details">
                <p><strong>Service:</strong> ${serviceName}</p>
                <p><strong>Date:</strong> ${appointmentDate}</p>
                <p><strong>Time:</strong> ${appointmentTime}</p>
              </div>
              <p>We look forward to serving you! Our team will arrive at the scheduled time.</p>
              <p style="margin-top: 20px;">Questions? Contact us:</p>
              <p>📞 (334) 425-4566</p>
              <p>📧 stephanie.maidtoclean@gmail.com</p>
            </div>
            <div class="footer">
              <p>Polishing Homes, Empowering Communities, Building Relationships That Last.</p>
              <p>&copy; 2026 Maid To Clean</p>
            </div>
          </div>
        </body>
        </html>
      `;

      adminSubject = `💰 Payment Received - ${customerName || customerEmail}`;
      adminHtml = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Payment Received!</h2>
          <p><strong>Customer:</strong> ${customerName || customerEmail}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date:</strong> ${appointmentDate} at ${appointmentTime}</p>
          <p><a href="${BASE_URL}/admin/admin-billing.html">View in Admin</a></p>
        </body>
        </html>
      `;
    }

    // Send customer email
    const customerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: [customerEmail],
        subject: customerSubject,
        html: customerHtml
      })
    });

    if (!customerResponse.ok) {
      const error = await customerResponse.json();
      console.error('Customer email failed:', error);
    }

    // Send admin email (if applicable)
    if (adminHtml) {
      const adminResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: [ADMIN_EMAIL],
          subject: adminSubject,
          html: adminHtml
        })
      });

      if (!adminResponse.ok) {
        const error = await adminResponse.json();
        console.error('Admin email failed:', error);
      }
    }

    return res.status(200).json({ success: true, message: 'Notification emails sent' });

  } catch (error) {
    console.error('Notification error:', error);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
}
