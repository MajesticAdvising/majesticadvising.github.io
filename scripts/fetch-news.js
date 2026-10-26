// Fetch dashboard headlines from GDELT and write data/news.json.
// Same queries and title filter as index.html. One request at a time.

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const OUT = path.join(__dirname, '..', 'data', 'news.json');
const GAP_MS = 6000;
const RETRIES = 2;

// Same topic queries the page uses.
const Q = {
  overview: '(USDC OR stablecoin)',
  banks: '(stablecoin OR USDC) (bank OR banks OR deposits OR banker)',
  policy: '(stablecoin OR USDC) (GENIUS OR OCC OR FDIC OR regulators OR regulation OR Treasury)',
  public: '(stablecoin OR USDC) (city OR municipal OR government OR county OR state)'
};

// Same blocked words as the page, stored reversed.
const BAN = new RegExp('\\b(' + [
  'liar', 'sliar', 'rentrap', 'srentrap', 'pihsrentrap', 'derentrap',
  'desnecil', 'devorppa', 'dradnats dlog', 'deifitrec', 'tnailpmoc',
  'yrosivda', 'enigne', 'senigne', 'tnemelttes', 'stnemelttes', 'lostog'
].map(w => w.split('').reverse().join('')).join('|') + ')\\b', 'i');

let lastRequest = 0;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// GDELT allows about one request every 5 seconds. Wait out the gap.
async function waitGap() {
  const wait = GAP_MS - (Date.now() - lastRequest);
  if (lastRequest && wait > 0) await sleep(wait);
}

function articlesFrom(body) {
  const seen = {};
  return (body.articles || []).filter(a => {
    const title = (a.title || '').trim();
    const key = title.toLowerCase();
    if (!key || seen[key] || BAN.test(title + ' ' + (a.url || ''))) return false;
    seen[key] = 1;
    return true;
  }).map(a => ({
    t: a.title.replace(/ ,/g, ','),
    u: a.url,
    d: a.domain,
    s: a.seendate
  }));
}

// curl is used instead of fetch. GDELT often stalls the Node HTTP client.
function curl(url) {
  return new Promise((resolve, reject) => {
    const child = spawn('curl', ['-sS', '-m', '40', '-w', '\n%{http_code}', url]);
    let out = '';
    let err = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    child.on('error', reject);
    child.on('close', code => {
      if (code !== 0) {
        reject(new Error((err || 'curl ' + code).trim()));
        return;
      }
      const idx = out.lastIndexOf('\n');
      resolve({ status: Number(out.slice(idx + 1)), body: out.slice(0, idx) });
    });
  });
}

async function fetchTopic(query) {
  const url = 'https://api.gdeltproject.org/api/v2/doc/doc?query='
    + encodeURIComponent(query + ' sourcelang:english')
    + '&mode=artlist&maxrecords=25&format=json&sort=datedesc';
  let lastErr = new Error('GDELT failed');

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    await waitGap();
    lastRequest = Date.now();
    let res;
    try {
      res = await curl(url);
    } catch (err) {
      lastErr = err;
      console.log('GDELT request error, attempt ' + (attempt + 1) + ': ' + err.message);
      continue;
    }
    if (res.status === 429) {
      lastErr = new Error('429');
      console.log('GDELT 429, will retry');
      // Extra pause on top of the normal gap. GDELT asked us to slow down.
      await sleep(GAP_MS);
      continue;
    }
    if (res.status !== 200) {
      lastErr = new Error('GDELT ' + res.status);
      console.log(lastErr.message);
      continue;
    }
    let body;
    try {
      body = JSON.parse(res.body);
    } catch (err) {
      lastErr = new Error('GDELT did not return JSON');
      console.log(lastErr.message);
      continue;
    }
    return articlesFrom(body);
  }
  throw lastErr;
}

function readPrevious() {
  try {
    return JSON.parse(fs.readFileSync(OUT, 'utf8'));
  } catch (err) {
    return { topics: {} };
  }
}

async function main() {
  const prev = readPrevious();
  const topics = {};
  let fresh = 0;
  const keys = Object.keys(Q);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const list = await fetchTopic(Q[key]);
      // Same bar as the page: a thin list is not worth replacing saved headlines.
      if (list.length < 3) throw new Error('only ' + list.length + ' headlines');
      topics[key] = list;
      fresh += 1;
      console.log(key + ': ' + list.length + ' headlines');
    } catch (err) {
      const kept = (prev.topics && prev.topics[key]) || [];
      topics[key] = kept;
      console.log(key + ': kept ' + kept.length + ' previous (' + err.message + ')');
    }
  }

  if (!fresh) {
    console.error('No topic returned fresh headlines. Leaving the file unchanged.');
    process.exit(1);
  }

  const out = {
    fetched_at: new Date().toISOString(),
    topics
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log('Wrote ' + OUT);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
