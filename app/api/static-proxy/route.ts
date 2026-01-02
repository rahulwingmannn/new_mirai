import { NextResponse } from 'next/server';
import path from 'path';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const p = url.searchParams.get('path');
    if (!p) return NextResponse.json({ error: 'missing path' }, { status: 400 });

    // Prevent proxying arbitrary external URLs - only allow relative paths
    if (!p.startsWith('/')) return NextResponse.json({ error: 'only relative paths allowed' }, { status: 400 });

    // Normalize and block directory traversal
    const normalized = path.posix.normalize(p);
    if (normalized.includes('..')) return NextResponse.json({ error: 'invalid path' }, { status: 400 });

    // Redirect to the static file URL so the file is served by Vercel's static hosting
    const staticUrl = new URL(normalized, url.origin);
    return NextResponse.redirect(staticUrl, 307);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
