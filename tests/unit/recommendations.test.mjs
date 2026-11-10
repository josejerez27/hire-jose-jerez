import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, { env = {}, fetch = globalThis.fetch, imports = {} } = {}) {
  const source = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  const exports = {};
  vm.runInNewContext(outputText, { exports, require: id => id in imports ? imports[id] : require(id), process: { env, cwd: () => process.cwd() }, fetch, Request, Response, AbortSignal, URL, Date, Map, Buffer, console });
  return exports;
}
const input = { name: "Test Colleague", email: "private@example.test", title: "IT Manager", relationship: "Worked together on an operations team", message: "Jose made our team’s support workflows easier to understand and maintain.", consent: true };
const request = (pathname, method = "GET", body, cookie = "", origin = "https://portfolio.test") => new Request(`https://portfolio.test${pathname}`, { method, headers: { origin, "content-type": "application/json", ...(cookie ? { cookie } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });

test("recommendation input requires consent and validates every public/private field", () => {
  const store = load("src/lib/recommendations.ts");
  assert.equal(store.validateRecommendation({ ...input, consent: false }), null);
  assert.equal(store.validateRecommendation({ ...input, message: "too short" }), null);
  assert.equal(store.validateRecommendation({ ...input, email: "bad-email" }), null);
  assert.equal(store.validateRecommendation({ ...input, name: "x".repeat(81) }), null);
  assert.equal(store.validateRecommendation({ ...input, title: "" }), null);
  const parsed = store.validateRecommendation({ ...input, status: "approved" });
  assert.equal(parsed.name, input.name); assert.equal(parsed.status, undefined);
});

test("real local submission stays private until authenticated approval and can be unpublished", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "jose-recommendations-"));
  try {
    const env = { RECOMMENDATIONS_DATA_DIR: directory, RECOMMENDATION_ADMIN_PASSWORD: "owner-test-password-very-long" };
    const store = load("src/lib/recommendations.ts", { env });
    const auth = load("src/lib/review-auth.ts", { env });
    const imports = { "@/lib/recommendations": store, "@/lib/review-auth": auth, "@/lib/rate-limit": { allowed: async () => true }, "@/lib/profile": { profile: { references: [], email: "jose@example.test" } } };
    const publicApi = load("src/app/api/recommendations/route.ts", { env, imports });
    const adminApi = load("src/app/api/admin/recommendations/route.ts", { env, imports });
    const sessionApi = load("src/app/api/admin/session/route.ts", { env, imports });
    assert.equal((await publicApi.POST(request("/api/recommendations", "POST", { ...input, status: "approved" }))).status, 201);
    let data = await (await publicApi.GET()).json();
    assert.deepEqual(data.items, []);
    const [saved] = await store.listRecommendations();
    assert.equal(saved.status, "pending"); assert.equal(saved.email, input.email);
    assert.equal((await adminApi.GET(request("/api/admin/recommendations"))).status, 401);
    assert.equal((await adminApi.PATCH(request("/api/admin/recommendations", "PATCH", { id: saved.id, status: "approved" }))).status, 401);
    assert.equal((await sessionApi.POST(request("/api/admin/session", "POST", { password: "wrong" }))).status, 401);
    const login = await sessionApi.POST(request("/api/admin/session", "POST", { password: env.RECOMMENDATION_ADMIN_PASSWORD }));
    assert.equal(login.status, 200); assert.match(login.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/); assert.match(login.headers.get("set-cookie"), /Secure/);
    const cookie = login.headers.get("set-cookie").split(";")[0];
    assert.equal((await adminApi.PATCH(request("/api/admin/recommendations", "PATCH", { id: saved.id, status: "approved" }, cookie, "https://foreign.test"))).status, 403);
    assert.equal((await adminApi.PATCH(request("/api/admin/recommendations", "PATCH", { id: saved.id, status: "approved" }, cookie))).status, 200);
    data = await (await publicApi.GET()).json();
    assert.equal(data.items.length, 1); assert.equal(data.items[0].message, input.message);
    assert.equal(data.items[0].email, undefined); assert.equal(data.items[0].createdAt, undefined);
    assert.doesNotMatch(JSON.stringify(data), /private@example/);
    assert.equal((await adminApi.PATCH(request("/api/admin/recommendations", "PATCH", { id: saved.id, status: "rejected" }, cookie))).status, 200);
    assert.deepEqual((await (await publicApi.GET()).json()).items, []);
    // A new module/process view reads the persisted decision from disk.
    const reloaded = load("src/lib/recommendations.ts", { env });
    assert.equal((await reloaded.listRecommendations())[0].status, "rejected");
    const logout = await sessionApi.DELETE(request("/api/admin/session", "DELETE", undefined, cookie));
    assert.match(logout.headers.get("set-cookie"), /Max-Age=0/);
  } finally {
    assert.ok(path.resolve(directory).startsWith(path.resolve(tmpdir()) + path.sep + "jose-recommendations-"));
    await rm(directory, { recursive: true, force: true });
  }
});

test("review sessions reject tampering and expiry and are disabled without an owner password", () => {
  const auth = load("src/lib/review-auth.ts", { env: { RECOMMENDATION_ADMIN_PASSWORD: "owner-test-password-very-long" } });
  const session = auth.createReviewSession(1000000);
  assert.equal(auth.authenticated(request("/api/admin/recommendations", "GET", undefined, `jose_review=${session}`), 1000000), true);
  assert.equal(auth.authenticated(request("/api/admin/recommendations", "GET", undefined, `jose_review=${session}f`), 1000000), false);
  assert.equal(auth.authenticated(request("/api/admin/recommendations", "GET", undefined, `jose_review=${session}`), 1000000 + 9 * 3600000), false);
  const missing = load("src/lib/review-auth.ts");
  assert.equal(missing.authenticated(request("/api/admin/recommendations")), false);
  assert.equal(missing.passwordMatches(""), false);
});

test("Vercel refuses ephemeral recommendation storage and partial Redis configuration", async () => {
  const store = load("src/lib/recommendations.ts", { env: { VERCEL: "1" } });
  await assert.rejects(store.submitRecommendation(input), /Durable storage/);
  const partial = load("src/lib/recommendations.ts", { env: { UPSTASH_REDIS_REST_URL: "https://example.test" } });
  await assert.rejects(partial.listRecommendations(), /both Redis/);
});

test("Redis storage preserves pending status and supports approval without local files", async () => {
  let record;
  const store = load("src/lib/recommendations.ts", { env: { VERCEL: "1", UPSTASH_REDIS_REST_URL: "https://redis.test", UPSTASH_REDIS_REST_TOKEN: "test-only" }, fetch: async (_url, options) => {
    const command = JSON.parse(options.body);
    if (command[0] === "EVAL") { record = JSON.parse(command[5]); return Response.json({ result: 1 }); }
    if (command[0] === "HVALS") return Response.json({ result: record ? [JSON.stringify(record)] : [] });
    if (command[0] === "HGET") return Response.json({ result: record ? JSON.stringify(record) : null });
    if (command[0] === "HSET") { record = JSON.parse(command[3]); return Response.json({ result: 0 }); }
    throw new Error("Unexpected Redis operation");
  } });
  const saved = await store.submitRecommendation(input);
  assert.equal(record.status, "pending");
  await store.reviewRecommendation(saved.id, "approved");
  assert.equal((await store.listRecommendations())[0].status, "approved");
  assert.equal(store.publicRecommendation(record).email, undefined);
});
