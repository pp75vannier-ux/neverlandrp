const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const FIVEM_CODE = 'r6dlaj';
const FIVEM_URL = `https://servers-frontend.fivem.net/api/servers/single/${FIVEM_CODE}`;

// petit cache mémoire pour éviter de spammer l'API FiveM à chaque visite
let cache = { data: null, ts: 0 };
const CACHE_MS = 15000;

app.get('/api/status', async (req, res) => {
  try {
    if (cache.data && Date.now() - cache.ts < CACHE_MS) {
      return res.json(cache.data);
    }

    const r = await fetch(FIVEM_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(6000),
    });

    if (!r.ok) throw new Error('upstream ' + r.status);
    const json = await r.json();
    const data = json.Data || {};

    const maxRaw = data.sv_maxclients ?? data.svMaxclients ?? data.vars?.sv_maxClients ?? null;

    const payload = {
      online: true,
      hostname: data.hostname || null,
      players: typeof data.clients === 'number' ? data.clients
             : Array.isArray(data.players) ? data.players.length
             : null,
      maxPlayers: maxRaw !== null ? parseInt(maxRaw, 10) : null,
    };

    cache = { data: payload, ts: Date.now() };
    res.json(payload);
  } catch (err) {
    const payload = { online: false, hostname: null, players: null, maxPlayers: null };
    cache = { data: payload, ts: Date.now() };
    res.json(payload);
  }
});

// fichiers statiques du site (index.html, style.css, script.js, assets/...)
app.use(express.static(__dirname));

app.listen(PORT, () => console.log('Neverland RP server on port ' + PORT));
