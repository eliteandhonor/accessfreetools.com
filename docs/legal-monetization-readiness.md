# Legal and Monetization Readiness

This is an implementation checklist for AdSense, affiliate links, and product callouts. It is not legal advice. Before applying for monetization or publishing affiliate campaigns, the site owner should confirm the live site, working contact email, consent setup, and applicable local laws.

## Implemented Site Pages

- `/privacy-policy/` explains browser-first tools, local storage, cookies, Google AdSense, personalized advertising opt-out choices, EEA/UK/Swiss consent expectations, affiliate links, third-party services, children's privacy, and contact options.
- `/terms/` explains informational use, no professional advice, accuracy limits, random tool limits, ads, affiliate links, third-party products, intellectual property, feedback, privacy, changes, and contact.
- `/advertising-disclosure/` explains ads, affiliate commissions, disclosure placement, tool independence, and third-party store responsibility.
- `/contact/` now uses one contact address and a server-side form for general feedback, corrections, privacy questions, and disclosure questions.

## Google AdSense Checklist

- Privacy policy clearly discloses Google and third-party advertising cookies.
- Privacy policy links to Google's partner-sites data explanation.
- Privacy policy links to Google Ads Settings and aboutads.info for personalized-ad choices.
- Sitemap includes the legal/disclosure pages.
- No fake ad boxes are shown before AdSense is approved and connected.
- Before serving ads to users in the EEA, UK, or Switzerland, configure a Google-certified Consent Management Platform where required.
- Do not pass personally identifiable information to Google ad code.
- Keep ads visually separate from calculator controls and results.

## Affiliate Checklist

- Disclose affiliate commissions close to affiliate links and product previews.
- Do not rely only on the global disclosure page.
- Use clear wording, such as: "I may earn a commission if you buy through this link, at no extra cost to you."
- Keep tool formulas and recommendations independent from affiliate revenue.
- Link to third-party store policies when promoting products.
- Avoid claims about product quality, shipping, pricing, or guarantees unless verified.

## Owner Actions Before Launching Ads or Affiliate Links

- Create or route `contact@accessfreetools.com` for all site, privacy, advertising, affiliate, and correction messages.
- Store the Hostinger SMTP password only in Hostinger environment variables, never in GitHub.
- Add AdSense publisher details only after the account is approved.
- Configure the Google-certified CMP for regions where consent is required.
- Confirm live `/privacy-policy/`, `/terms/`, `/advertising-disclosure/`, and `/contact/` pages after each Hostinger deployment.
- Have a qualified professional review the policies if the site starts collecting more personal data, selling products directly, running accounts, or targeting specific regulated audiences.

## Reference Sources

- Google AdSense Required Content: https://support.google.com/adsense/answer/1348695
- Google Publisher Policies privacy disclosures: https://support.google.com/adsense/answer/10502938
- Google EU User Consent Policy guidance: https://support.google.com/adsense/answer/7670013
- FTC Endorsement Guides: https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking
- FTC Disclosures 101: https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers
