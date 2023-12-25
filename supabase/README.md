# github-workflow-webhook

## Local run
```bash
$ deno run --allow-net --allow-read github-workflow-webhook/index.ts
```

## Deployment command
```bash
$ supabase functions deploy github-workflow-webhook --no-verify-jwt --project-ref nmgklmsdzbdruerlwuop

```

## ENVs for local testing
```dotenv
SUPABASE_URL=<SUPABASE_URL>
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
```
