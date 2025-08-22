const stremioAPIBase = 'https://api.strem.io/api/';

export async function getAddonCollection(authKey) {
  const res = await fetch(`${stremioAPIBase}addonCollectionGet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'AddonCollectionGet', authKey, update: true })
  });
  if (!res.ok) throw new Error(`fetchAddonCollection failed (${res.status})`);
  return res.json();
}

export async function setAddonCollection(addons, authKey) {
  const res = await fetch(`${stremioAPIBase}addonCollectionSet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'AddonCollectionSet', authKey, addons })
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `setAddonCollection failed (${res.status})`);
  }
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${stremioAPIBase}login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authKey: null, email, password })
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `loginUser failed (${res.status})`);
  }
  return res.json();
}

export async function createUser(email, password) {
  const gdpr_consent = {
    from: 'browser',
    time: new Date().toISOString(),
    tos: true,
    privacy: true,
    marketing: true
  };
  const res = await fetch(`${stremioAPIBase}register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      authKey: null,
      email,
      password,
      gdpr_consent
    })
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || `createUser failed (${res.status})`);
  }
  return res.json();
}
