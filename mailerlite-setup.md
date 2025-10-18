# MailerLite Setup Guide for Desktop Pet

## Step 1: Create MailerLite Account

1. **Go to [mailerlite.com](https://mailerlite.com)**
2. **Click "Start Free"**
3. **Sign up with your email** (use `support@desktoppet.app` if possible)
4. **Verify your email address**

## Step 2: Set Up Your Domain

### A. Add Your Domain
1. In MailerLite dashboard, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `desktoppet.app`
4. Click **"Add Domain"**

### B. Verify Domain Ownership
1. **Copy the TXT record** provided by MailerLite
2. **Add to your DNS settings** (wherever you manage desktoppet.app DNS)
3. **Wait for verification** (usually 5-15 minutes)
4. **Click "Verify Domain"** in MailerLite

## Step 3: Create Your First Form

### A. Create Embedded Form
1. Go to **Forms** → **Create Form**
2. Choose **"Embedded Form"**
3. **Form Name**: "Desktop Pet Newsletter"
4. **Form Type**: "Subscribe"

### B. Customize Your Form
1. **Form Fields**: Keep just "Email" (remove name if added)
2. **Styling**: Match your website's pixelated theme
3. **Colors**: Use black/white to match your site
4. **Button Text**: "Subscribe"

### C. Get Form Code
1. Click **"Get Code"**
2. **Copy the HTML code**
3. **Save for later use**

## Step 4: Update Your Website

### A. Replace Current Form
Replace the subscription form in your `index.html` with the MailerLite form code.

### B. Test the Form
1. **Open your website**
2. **Try subscribing** with a test email
3. **Check MailerLite dashboard** to see if subscriber appears

## Step 5: Configure Email Settings

### A. Set Sender Information
1. Go to **Settings** → **Sender Information**
2. **From Name**: "Desktop Pet"
3. **From Email**: `support@desktoppet.app`
4. **Reply To**: `support@desktoppet.app`

### B. Set Up Your First Campaign
1. Go to **Campaigns** → **Create Campaign**
2. **Choose "Regular Campaign"**
3. **Subject**: "Desktop Pet Update - New Version Available!"
4. **Design your email** with your branding

## Step 6: Test Everything

### A. Send Test Email
1. **Create a test campaign**
2. **Send to yourself** first
3. **Check that it comes from** `support@desktoppet.app`

### B. Verify Subscriber List
1. **Check your subscriber count** in dashboard
2. **Ensure emails are being collected** properly

## Troubleshooting

### Domain Verification Issues
- **Check DNS propagation**: Use [whatsmydns.net](https://whatsmydns.net)
- **Wait longer**: DNS changes can take up to 24 hours
- **Contact your domain provider** if needed

### Form Not Working
- **Check form code**: Make sure it's properly embedded
- **Test in different browsers**
- **Check browser console** for errors

## Next Steps

1. **Set up automation** for new releases
2. **Create welcome email** for new subscribers
3. **Design email templates** matching your site
4. **Plan your email schedule**

## Free Tier Limits
- ✅ **1,000 subscribers**
- ✅ **12,000 emails per month**
- ✅ **Unlimited campaigns**
- ✅ **Basic automation**

This should be more than enough for your Desktop Pet project!
