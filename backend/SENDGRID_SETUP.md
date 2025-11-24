# 📧 SendGrid Email Setup Guide

## Why SendGrid?

Render blocks direct SMTP connections (ports 465/587), which prevents Nodemailer + Gmail from working. SendGrid uses HTTP APIs instead of SMTP, which works perfectly on Render.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create SendGrid Account

1. Go to: https://signup.sendgrid.com/
2. Sign up for **FREE account** (100 emails/day forever)
3. Verify your email address

### Step 2: Create API Key

1. Login to SendGrid Dashboard
2. Go to: **Settings** → **API Keys**
3. Click **Create API Key**
4. Name: `JSP Detailing Production`
5. Permissions: Select **Full Access** (or just **Mail Send**)
6. Click **Create & View**
7. **COPY THE API KEY** (you can only see it once!)
   - It looks like: `SG.xxxxxxxxxxxxxxxxxxxxx`

### Step 3: Verify Sender Email

**IMPORTANT**: SendGrid requires you to verify the "from" email address.

#### Option A: Single Sender Verification (Easiest - Free)
1. Go to: **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Click **Create New Sender**
3. Fill in:
   - **From Name**: JSP Detailing
   - **From Email**: noreply@jspdetailing.cl (or any email you own)
   - **Reply To**: Same as above
   - **Company Address**: Your address
4. Click **Create**
5. **Check your email** and click the verification link
6. ✅ Wait for approval (usually instant)

#### Option B: Domain Authentication (Better - Requires DNS Access)
1. Go to: **Settings** → **Sender Authentication** → **Authenticate Your Domain**
2. Follow the wizard to add DNS records to your domain
3. This allows you to send from any email at your domain

### Step 4: Add to Render Environment Variables

1. Go to Render Dashboard → Your Service
2. Click **Environment** tab
3. Add these variables:

```bash
SENDGRID_API_KEY=SG.your_actual_api_key_here
EMAIL_FROM=noreply@jspdetailing.cl
```

**Important**: 
- `EMAIL_FROM` must match the verified sender email from Step 3
- No quotes needed in Render environment variables
- If you verified a different email, use that instead

### Step 5: Install & Deploy

Run these commands locally:

```bash
cd backend
npm install
git add .
git commit -m "Add SendGrid email support"
git push
```

Render will automatically redeploy with the new package.

---

## ✅ Testing

### Test 1: Check Logs
After deployment, check Render logs. You should see:
```
📧 Email service configured: SendGrid
```

### Test 2: Test Password Reset
1. Go to your website
2. Click "Forgot Password"
3. Enter your email
4. Check your email inbox (and spam folder)
5. You should receive the password reset email!

### Test 3: Test Registration
1. Register a new account
2. Check for verification email

---

## 📊 SendGrid Dashboard

Monitor your emails:
- **Activity**: See sent emails and delivery status
- **Stats**: View email metrics
- **Suppressions**: See bounced/spam reports

---

## 🔄 Switching Back to Nodemailer (Local Dev)

The code automatically uses:
- **SendGrid** if `SENDGRID_API_KEY` is set (production)
- **Nodemailer** if `EMAIL_USER` and `EMAIL_PASS` are set (local dev)

Your local `.env` can keep using Gmail:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

---

## 🆓 Other Free Alternatives

If you want more than 100 emails/day:

### Brevo (formerly Sendinblue) - 300 emails/day
```bash
npm install @getbrevo/brevo
```

### Resend - 100 emails/day
```bash
npm install resend
```

### Mailgun - 5,000 emails/month (first 3 months)
```bash
npm install mailgun.js
```

---

## ❓ Troubleshooting

### Error: "The from address does not match a verified Sender Identity"
**Solution**: You forgot Step 3. Verify your sender email in SendGrid.

### Error: "Unauthorized"
**Solution**: Check that `SENDGRID_API_KEY` is correct in Render.

### Emails not arriving
**Solution**: 
1. Check SendGrid Activity Feed for delivery status
2. Check spam folder
3. Try a different email address

### Still using Nodemailer?
**Solution**: Make sure `SENDGRID_API_KEY` is set in Render. The code prioritizes SendGrid over Nodemailer.

---

## 📝 Summary

1. ✅ Create SendGrid account (free)
2. ✅ Create API Key
3. ✅ Verify sender email (noreply@jspdetailing.cl)
4. ✅ Add `SENDGRID_API_KEY` to Render
5. ✅ Add `EMAIL_FROM` to Render
6. ✅ Install package: `npm install`
7. ✅ Push to GitHub
8. ✅ Test password reset

**That's it!** Your emails will now work on Render. 🎉

