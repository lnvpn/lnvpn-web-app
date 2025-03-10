/* eslint-disable @typescript-eslint/no-explicit-any */

function gf(init?: number[]): Float64Array {
  const r = new Float64Array(16);
  if (init) {
    for (let i = 0; i < init.length; ++i) r[i] = init[i];
  }
  return r;
}

function pack(o: Uint8Array, n: Float64Array): void {
  let b: number;
  const m = gf();
  const t = gf();
  for (let i = 0; i < 16; ++i) t[i] = n[i];
  carry(t);
  carry(t);
  carry(t);
  for (let j = 0; j < 2; ++j) {
    m[0] = t[0] - 0xffed;
    for (let i = 1; i < 15; ++i) {
      m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1);
      m[i - 1] &= 0xffff;
    }
    m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1);
    b = (m[15] >> 16) & 1;
    m[14] &= 0xffff;
    cswap(t, m, 1 - b);
  }
  for (let i = 0; i < 16; ++i) {
    o[2 * i] = t[i] & 0xff;
    o[2 * i + 1] = t[i] >> 8;
  }
}

function carry(o: Float64Array): void {
  for (let i = 0; i < 16; ++i) {
    o[(i + 1) % 16] += (i < 15 ? 1 : 38) * Math.floor(o[i] / 65536);
    o[i] &= 0xffff;
  }
}

function cswap(p: Float64Array, q: Float64Array, b: number): void {
  let t: number;
  const c = ~(b - 1);
  for (let i = 0; i < 16; ++i) {
    t = c & (p[i] ^ q[i]);
    p[i] ^= t;
    q[i] ^= t;
  }
}

function add(o: Float64Array, a: Float64Array, b: Float64Array): void {
  for (let i = 0; i < 16; ++i) o[i] = (a[i] + b[i]) | 0;
}

function subtract(o: Float64Array, a: Float64Array, b: Float64Array): void {
  for (let i = 0; i < 16; ++i) o[i] = (a[i] - b[i]) | 0;
}

function multmod(o: Float64Array, a: Float64Array, b: Float64Array): void {
  const t = new Float64Array(31);
  for (let i = 0; i < 16; ++i) {
    for (let j = 0; j < 16; ++j) {
      t[i + j] += a[i] * b[j];
    }
  }
  for (let i = 0; i < 15; ++i) t[i] += 38 * t[i + 16];
  for (let i = 0; i < 16; ++i) o[i] = t[i];
  carry(o);
  carry(o);
}

function invert(o: Float64Array, i: Float64Array): void {
  const c = gf();
  for (let a = 0; a < 16; ++a) c[a] = i[a];
  for (let a = 253; a >= 0; --a) {
    multmod(c, c, c);
    if (a !== 2 && a !== 4) multmod(c, c, i);
  }
  for (let a = 0; a < 16; ++a) o[a] = c[a];
}

function clamp(z: Uint8Array): void {
  z[31] = (z[31] & 127) | 64;
  z[0] &= 248;
}

function generatePublicKey(privateKey: Uint8Array): Uint8Array {
  let r: number;
  const z = new Uint8Array(32);
  const a = gf([1]);
  const b = gf([9]);
  const c = gf();
  const d = gf([1]);
  const e = gf();
  const f = gf();
  const _121665 = gf([0xdb41, 1]);
  const _9 = gf([9]);
  for (let i = 0; i < 32; ++i) z[i] = privateKey[i];
  clamp(z);
  for (let i = 254; i >= 0; --i) {
    r = (z[i >>> 3] >>> (i & 7)) & 1;
    cswap(a, b, r);
    cswap(c, d, r);
    add(e, a, c);
    subtract(a, a, c);
    add(c, b, d);
    subtract(b, b, d);
    multmod(d, e, e);
    multmod(f, a, a);
    multmod(a, c, a);
    multmod(c, b, e);
    add(e, a, c);
    subtract(a, a, c);
    multmod(b, a, a);
    subtract(c, d, f);
    multmod(a, c, _121665);
    add(a, a, d);
    multmod(c, c, a);
    multmod(a, d, f);
    multmod(d, b, _9);
    multmod(b, e, e);
    cswap(a, b, r);
    cswap(c, d, r);
  }
  invert(c, c);
  multmod(a, a, c);
  const result = new Uint8Array(32);
  pack(result, a);
  return result;
}

function generatePresharedKey(): Uint8Array {
  const key = new Uint8Array(32);
  crypto.getRandomValues(key);
  return key;
}

function generatePrivateKey(): Uint8Array {
  const privateKey = generatePresharedKey();
  clamp(privateKey);
  return privateKey;
}

function encodeBase64(dest: Uint8Array, src: Uint8Array): void {
  const input = Uint8Array.from([
    (src[0] >> 2) & 63,
    ((src[0] << 4) | (src[1] >> 4)) & 63,
    ((src[1] << 2) | (src[2] >> 6)) & 63,
    src[2] & 63,
  ]);
  for (let i = 0; i < 4; ++i) {
    dest[i] =
      input[i] +
      65 +
      (((25 - input[i]) >> 8) & 6) -
      (((51 - input[i]) >> 8) & 75) -
      (((61 - input[i]) >> 8) & 15) +
      (((62 - input[i]) >> 8) & 3);
  }
}

function keyToBase64(key: Uint8Array): string {
  const base64 = new Uint8Array(44);
  let i: number;
  for (i = 0; i < Math.floor(32 / 3); ++i) {
    encodeBase64(base64.subarray(i * 4), key.subarray(i * 3));
  }
  encodeBase64(
    base64.subarray(i * 4),
    Uint8Array.from([key[i * 3 + 0], key[i * 3 + 1], 0])
  );
  base64[43] = 61; // '=' character
  return String.fromCharCode.apply(null, base64 as unknown as number[]);
}

export function generateKeypair(): {
  publicKey: string;
  privateKey: string;
  presharedKey: string;
} {
  const presharedKey = generatePresharedKey();
  const privateKey = generatePrivateKey();
  const publicKey = generatePublicKey(privateKey);
  return {
    publicKey: keyToBase64(publicKey),
    privateKey: keyToBase64(privateKey),
    presharedKey: keyToBase64(presharedKey),
  };
}

export function buildConfigFile(
  keyPair: { publicKey: string; privateKey: string; presharedKey: string },
  serverResponse: any,
  timestamp: string,
  location: string
): string {
  const configArray = [
    "[Interface]",
    "PrivateKey = " + keyPair.privateKey,
    "Address = " + serverResponse.ipv4Address,
    "DNS = " + serverResponse.dns,
    " ",
    "# Valid until: " + timestamp,
    "# Location: " + location,
    " ",
    "[Peer]",
    "PublicKey = " + serverResponse.publicKey,
    "PresharedKey = " + keyPair.presharedKey,
    "Endpoint = " + serverResponse.ipAddress + ":" + serverResponse.listenPort,
    "AllowedIPs = " + serverResponse.allowedIPs,
  ];
  return configArray.join("\n");
}
