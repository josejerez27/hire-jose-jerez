# Reference letters and recommendations

The Professional tab includes a “People I’ve Worked With” section. It shows up to three approved recommendations or reference excerpts; the full collection and submission form live at `/recommendations`.

## Add letters you already have

1. Confirm permission to publish the author’s name and words. Redact private contact details or other sensitive material from the PDF first.
2. Create `public/references/` and add the public PDF, for example `public/references/reference-letter.pdf`.
3. Add an entry to the `references` array in `src/data/profile.json`:

```json
{
  "id": "your-unique-letter-id",
  "name": "The author’s name",
  "title": "Their professional title",
  "relationship": "How you worked together",
  "message": "An accurate, approved excerpt from their letter.",
  "letterUrl": "/references/reference-letter.pdf"
}
```

Use the author’s real information and words, not these example labels. `letterUrl` is optional. Entries in this array are owner-curated and published immediately after saving/redeploying; they do not enter the visitor review queue. Never put an unapproved/private letter in `public/`.

## Visitor submissions

The “Worked with Jose? Leave a recommendation” invitation opens the form. Visitors supply their name, title, relationship, private email, message, and explicit permission to publish. The server always creates a **pending** record; a submitted `status` field cannot bypass review.

Public responses include only approved, consented records and omit email addresses, creation dates, and moderation metadata. Recommendations are plain text, not executable HTML. No notification email is sent automatically; check the review inbox for submissions.

## Open the private review inbox

1. Copy `.env.example` to `.env.local` if you have not already created a local environment file. Preserve any existing settings.
2. Set `RECOMMENDATION_ADMIN_PASSWORD` to a unique password of at least 16 characters. Keep it out of GitHub and chat.
3. Restart the local server after changing environment variables. In Vercel, set the password in project environment settings and redeploy.
4. Open `/admin/recommendations`, enter that password, and select **Approve & publish** or **Do not publish**.
5. Use the Published view’s **Unpublish** button to remove an approved recommendation from public responses. Rejected records can return to review.

Approval publishes the submitted wording as-is. Verify the sender and message before approving. The public form does not verify email ownership automatically. To correct text, request a new submission or edit your owner-curated references; no automatic rewriting or fabricated endorsement is included.

The inbox uses an eight-hour signed HttpOnly/SameSite session cookie and adds Secure over HTTPS. Login and submission routes have rate limits and same-origin checks. Sign out when finished. Changing the owner password invalidates existing signed sessions. With no configured password, owner authentication stays disabled; there is no default password.

## Where submissions are stored

- **Local:** an ignored `.data/recommendations.json`, outside `public/`. Local writes are serialized and replace the file atomically. This is intended for a single local server process.
- **Vercel:** configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. The backend refuses to store submissions on ephemeral serverless disk. It returns an unavailable message instead of pretending to save them.
- Before Vercel storage is configured, owner-curated letters remain visible and the visitor submission page offers direct email instead of a form that cannot save. The form becomes available after configuring storage and redeploying.
- Use separate Redis databases for Preview and Production. Records use the Redis hash `hire-jose:recommendations:v1`; keep credentials server-only. Do not expose a database token in client code.

An inbox accepts up to 1,000 records. Manage stored submissions and any deletion/retention requests privately through the owner’s local file or Redis console; rejected entries are retained for review rather than automatically deleted. These private records must not be included in source archives or public assets.

The Redis integration follows [Upstash’s REST command API](https://upstash.com/docs/redis/features/restapi). Redis credentials can also provide the existing shared rate limiter; without them, local rate limits apply per running instance.
