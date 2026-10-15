const graphVersion = process.env.FACEBOOK_GRAPH_API_VERSION ?? "v23.0";

export function isFacebookConfigured() {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
}

export async function publishFacebookPost(pageId: string, message: string) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!accessToken) throw new Error("FACEBOOK_PAGE_ACCESS_TOKEN chưa được cấu hình.");

  const form = new URLSearchParams({ message, access_token: accessToken });
  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const payload = await response.json() as { id?: string; error?: { message?: string } };
  if (!response.ok || !payload.id) {
    throw new Error(payload.error?.message ?? `Facebook Graph API returned ${response.status}.`);
  }
  return payload.id;
}

export async function fetchFacebookInsights(postId: string) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!accessToken) throw new Error("FACEBOOK_PAGE_ACCESS_TOKEN chưa được cấu hình.");

  const params = new URLSearchParams({
    metric: "post_impressions,post_engaged_users,post_clicks",
    access_token: accessToken,
  });
  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${postId}/insights?${params}`);
  const payload = await response.json() as {
    data?: Array<{ name: string; values?: Array<{ value?: number }> }>;
    error?: { message?: string };
  };
  if (!response.ok) throw new Error(payload.error?.message ?? `Facebook Graph API returned ${response.status}.`);

  const metrics = Object.fromEntries((payload.data ?? []).map((metric) => [metric.name, metric.values?.[0]?.value ?? 0]));
  return {
    impressions: Number(metrics.post_impressions ?? 0),
    engagements: Number(metrics.post_engaged_users ?? 0),
    clicks: Number(metrics.post_clicks ?? 0),
    measuredAt: new Date().toISOString(),
  };
}