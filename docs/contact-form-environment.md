# Contact Form Environment

The contact form sends through Hostinger SMTP from the Node.js Web App. Keep the mailbox password in Hostinger environment variables only. Never commit real secrets to GitHub.

## Required Hostinger Variables

Use these values in the Hostinger Node.js Web App environment variable settings:

```txt
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@accessfreetools.com
SMTP_PASS=<the Hostinger mailbox password>
CONTACT_TO=contact@accessfreetools.com
```

## Hostinger Runtime

- Build command: `npm run build`
- Start command: `npm run start`
- Entry file if Hostinger asks for one: `app.js`
- Output directory if Hostinger asks for one: `dist`

The build also writes `dist/app.js`, so Hostinger can start `app.js` from either
the repository root or the `dist` output directory.

After changing variables, redeploy or restart the Hostinger Node.js Web App and send a test message from `/contact/`.
