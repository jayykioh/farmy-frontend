import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const crops = {
  'lua-nuoc': 'rice paddy Oryza sativa plant',
  'lua-nep': 'glutinous rice grains',
  'lua-thom': 'jasmine rice field',
  robusta: 'Coffea canephora robusta coffee cherries',
  arabica: 'Coffea arabica coffee cherries',
  liberica: 'Coffea liberica plant',
  buoi: 'pomelo Citrus maxima fruit',
  cam: 'orange fruit Citrus sinensis',
  xoai: 'mango fruit Mangifera indica',
  'sau-rieng': 'durian fruit Durio zibethinus',
  'thanh-long': 'dragon fruit Hylocereus',
  'chom-chom': 'rambutan fruit Nephelium lappaceum',
  mit: 'jackfruit Artocarpus heterophyllus fruit',
  nhan: 'longan fruit Dimocarpus longan',
  'ca-chua': 'tomato fruit plant Solanum lycopersicum',
  'bap-cai': 'cabbage Brassica oleracea head',
  'dua-leo': 'fresh cucumber Cucumis sativus',
  ot: 'red chili pepper Capsicum annuum',
  hanh: 'onion Allium cepa bulbs',
  'rau-muong': 'water spinach Ipomoea aquatica',
  tieu: 'black pepper Piper nigrum plant berries',
  dieu: 'cashew Anacardium occidentale fruit',
  'cao-su': 'rubber tree plantation Hevea brasiliensis',
  mia: 'sugarcane Saccharum officinarum field',
  khac: 'green seedling growing in soil plant',
  chuoi: 'banana plant fruit Musa',
  dua: 'coconut palm fruit Cocos nucifera',
  'du-du': 'papaya fruit tree Carica papaya',
  oi: 'guava fruit Psidium guajava',
  bo: 'avocado fruit Persea americana',
  ngo: 'maize corn cobs Zea mays',
  'khoai-tay': 'potato tubers Solanum tuberosum',
  'khoai-lang': 'sweet potato tubers Ipomoea batatas',
  lac: 'peanut pods Arachis hypogaea',
  'dau-nanh': 'soybean pods Glycine max',
  che: 'tea plant Camellia sinensis leaves',
  san: 'cassava roots Manihot esculenta',
};
const exactFiles = {
  'cao-su': 'File:Rubber Plantation.jpg',
  khac: 'File:Seedling in soil.jpg',
};

const outputDir = path.resolve('public/crops');
await fs.mkdir(outputDir, { recursive: true });
const attributionPath = path.join(outputDir, 'ATTRIBUTION.json');
const attribution = await fs
  .readFile(attributionPath, 'utf8')
  .then((value) => JSON.parse(value))
  .catch(() => ({}));
const requestedIds = new Set(process.argv.slice(2));
const localAssetIds = new Set(['lua-nuoc', 'lua-thom']);

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(url, attempts = 5) {
  await wait(2500);
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'FarmDiaryCropImporter/1.0 (educational project)' },
    });
    if (response.ok || response.status !== 429) return response;
    await wait(5000 * (attempt + 1));
  }
  return fetch(url, {
    headers: { 'User-Agent': 'FarmDiaryCropImporter/1.0 (educational project)' },
  });
}

for (const [id, search] of Object.entries(crops)) {
  if (localAssetIds.has(id)) continue;
  if (requestedIds.size > 0 && !requestedIds.has(id)) continue;
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'imageinfo',
    iiprop: 'url|mime|size|extmetadata',
    iiurlwidth: '900',
  });
  if (exactFiles[id]) {
    params.set('titles', exactFiles[id]);
  } else {
    params.set('generator', 'search');
    params.set('gsrnamespace', '6');
    params.set('gsrsearch', `${search} filetype:bitmap -painting -drawing -illustration -museum`);
    params.set('gsrlimit', '10');
  }
  const response = await fetchWithRetry(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!response.ok) throw new Error(`${id}: Wikimedia API ${response.status}`);
  const payload = await response.json();
  const candidates = Object.values(payload.query?.pages ?? {})
    .map((page) => ({ page, info: page.imageinfo?.[0] }))
    .filter(({ info }) => info?.thumburl && info.mime?.startsWith('image/') && info.width >= 250 && info.height >= 250)
    .sort((a, b) => (a.page.index ?? 999) - (b.page.index ?? 999));
  const selected = candidates[0];
  if (!selected) throw new Error(`${id}: no suitable image found for ${search}`);

  const imageResponse = await fetchWithRetry(selected.info.thumburl);
  if (!imageResponse.ok) throw new Error(`${id}: image download ${imageResponse.status}`);
  const bytes = Buffer.from(await imageResponse.arrayBuffer());
  await sharp(bytes)
    .resize(640, 640, { fit: 'cover', position: 'attention' })
    .webp({ quality: 82 })
    .toFile(path.join(outputDir, `${id}.webp`));

  const metadata = selected.info.extmetadata ?? {};
  attribution[id] = {
    crop: search,
    file: selected.page.title,
    source: selected.info.descriptionurl,
    artist: metadata.Artist?.value ?? 'Wikimedia Commons contributor',
    license: metadata.LicenseShortName?.value ?? 'See source page',
    licenseUrl: metadata.LicenseUrl?.value ?? selected.info.descriptionurl,
  };
  console.log(`${id} <- ${selected.page.title}`);
}

await fs.writeFile(
  attributionPath,
  `${JSON.stringify(attribution, null, 2)}\n`,
  'utf8',
);
