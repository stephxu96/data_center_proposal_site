# University AI Data Center Decision Explorer

The customer-demo Site is [Global Datacenter Design Explorer — Test](https://global-datacenter-design-explorer-test.stephxu700296.chatgpt.site). The [Country Comparison](https://global-datacenter-design-explorer-test.stephxu700296.chatgpt.site/countries#live-electricity) page retrieves published electricity data from Our World in Data, validates it on the backend, and saves accepted values and retrieval times in Sites D1. This data source needs **no API key**.

## Adding the OpenAI key for the adviser

The challenge brief's Step 15 says the **instructor configures any required API keys as hosted secrets before the exercise**. The browser calls the Sites backend; the backend reads the secret and calls the external service. The key must never be returned to the browser or committed to source control. The brief also says students do not need to create their own OpenAI API keys for this assignment.

When an instructor-provided key is available:

1. In the OpenAI Sites project that will run the adviser, add a **runtime secret** named `OPENAI_API_KEY` using Sites' environment-variable/secret control. Mark it secret. Configure the test and production Sites separately if both need the adviser. Do not add the value to `.openai/hosting.json`, a source file, a client-side variable, a local `.env` committed to Git, or this README.
2. Deploy a new saved Site version after changing runtime environment variables so the Worker receives the new environment revision.
3. Complete and test the Phase 8 adviser route's server-side model call and the Phase 7 sign-in/role checks before making the adviser available. **Adding a key alone does not activate the current guided-question page**; `/api/ask` is not yet a model-backed route.
4. Test with a signed-in registered viewer: ask for the current PUE, confirm the answer comes from D1, and verify citations resolve to actual source records. Never display or log the key during the test.

See the challenge brief, Steps 15 and 18–21, and the [OpenAI API authentication guidance](https://developers.openai.com/api/reference/overview#authentication). If no instructor key is available, retain the guided-question adviser page for the demo and describe it as guided content, not a live AI conversation.

## Demo access and final access control

The `/workspace` page includes the four role experiences from brief Steps 16–17: public visitor access, first-visit registration, registered-user adviser access, editor evidence controls, and administrator design/role controls. With `AUTH_ENABLED` absent, its registration and editing forms operate as in-memory previews. Preview role selection never authorizes an API request or creates a real account.

The real `/api/register`, `/api/roles`, `/api/design` and `/api/metrics` handlers are implemented and remain inactive until the final authentication hookup. They use server identity and team-scoped database records; the browser cannot select its real role. At that final step, configure `AUTH_ENABLED=1` and `INITIAL_ADMIN_USER_ID` with the intended administrator's Sites-authenticated user ID, then redeploy and verify the signed-in registration and role matrix. The first registrant is never automatically made administrator. The final hookup remains deferred.

The separate test Site currently has `DEMO_PUBLIC_REFRESH=1` as a **temporary hosted environment variable** so the fixed, three-country refresh can be demonstrated without sign-in. The main Site does not have that switch. At the final authentication phase, remove it from the test Site, redeploy, and verify that anonymous refresh returns `401` and non-editor refresh returns `403`. Do not treat the temporary public test setting as a production access policy.

## Local checks

```sh
npm test
npx tsc --noEmit
npm run build
```
