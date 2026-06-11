// One-shot RST -> Markdown migration from the old ReadTheDocs repo.
// Usage: node scripts/convert-rst.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';

const SRC = resolve(import.meta.dirname, '../../readthedocs-portfolio/source');
const OUT = resolve(import.meta.dirname, '../src/content/notes');

// series + order mirror the toctree in source/index.rst
const files = [
  // [rst path relative to SRC, out series dir, slug, title, order, tags]
  ['htb-cpts/boxes.rst', 'htb-cpts', 'boxes', 'Boxes Pwned', 1, ['htb', 'ctf', 'walkthrough']],
  ['htb-cpts/pentesting_process.rst', 'htb-cpts', 'pentesting-process', 'Pentesting Process', 2, ['htb', 'methodology']],
  ['htb-cpts/getting_started_with_hackthebox.rst', 'htb-cpts', 'getting-started-with-hackthebox', 'Getting Started with HackTheBox', 3, ['htb', 'basics']],
  ['htb-cpts/nmap.rst', 'htb-cpts', 'nmap', 'Nmap', 4, ['htb', 'recon', 'nmap']],
  ['htb-cpts/footprinting.rst', 'htb-cpts', 'footprinting', 'Footprinting', 5, ['htb', 'recon', 'enumeration']],
  ['htb-cpts/shells-and-payloads.rst', 'htb-cpts', 'shells-and-payloads', 'Shells and Payloads', 6, ['htb', 'shells', 'payloads']],
  ['htb-cpts/attacking-common-services.rst', 'htb-cpts', 'attacking-common-services', 'Attacking Common Services', 7, ['htb', 'services']],
  ['htb-cpts/using-web-proxies.rst', 'htb-cpts', 'using-web-proxies', 'Using Web Proxies', 8, ['htb', 'web', 'burp']],
  ['htb-cpts/attacking-web-applications-with-ffuf.rst', 'htb-cpts', 'attacking-web-applications-with-ffuf', 'Attacking Web Apps with ffuf', 9, ['htb', 'web', 'fuzzing']],
  ['htb-cpts/sql-injection-fundamentals.rst', 'htb-cpts', 'sql-injection-fundamentals', 'SQL Injection Fundamentals', 10, ['htb', 'web', 'sqli']],
  ['htb-cpts/sqlmap-essentials.rst', 'htb-cpts', 'sqlmap-essentials', 'SQLMap Essentials', 11, ['htb', 'web', 'sqli', 'sqlmap']],
  ['htb-cpts/xss.rst', 'htb-cpts', 'xss', 'Cross-Site Scripting (XSS)', 12, ['htb', 'web', 'xss']],
  ['htb-cpts/file-inclusion.rst', 'htb-cpts', 'file-inclusion', 'File Inclusion', 13, ['htb', 'web', 'lfi']],
  ['htb-cpts/file-upload-attacks.rst', 'htb-cpts', 'file-upload-attacks', 'File Upload Attacks', 14, ['htb', 'web', 'upload']],
  ['htb-cpts/command-injections.rst', 'htb-cpts', 'command-injections', 'Command Injections', 15, ['htb', 'web', 'injection']],
  ['htb-cpts/web-attacks.rst', 'htb-cpts', 'web-attacks', 'Web Attacks', 16, ['htb', 'web']],
  ['htb-cpts/attacking-common-applications.rst', 'htb-cpts', 'attacking-common-applications', 'Attacking Common Applications', 17, ['htb', 'web', 'applications']],
  ['projects/duke-nukem.rst', 'projects', 'duke-nukem', 'Reverse Engineering Duke Nukem', 1, ['reversing', 'binary-exploitation', 'ghidra']],
  ['projects/sbom-admission-controller.rst', 'projects', 'sbom-admission-controller', 'SBOM Admission Controller', 2, ['kubernetes', 'supply-chain', 'sbom', 'cosign']],
  ['projects/homelabbing.rst', 'projects', 'homelab-setup', 'Homelab Setup', 3, ['homelab', 'proxmox', 'networking']],
  ['htb-cpts/aws-cloud-practitioner.rst', 'aws', 'aws-cloud-practitioner', 'AWS Cloud Practitioner', 1, ['aws', 'cloud', 'certification']],
];

const missingImages = [];

function resolveImage(ref, rstDir) {
  // Sphinx path conventions: leading "/" is relative to source root.
  if (ref.startsWith('/')) return join(SRC, ref.slice(1));
  return resolve(rstDir, ref);
}

for (const [rstRel, seriesDir, slug, title, order, tags] of files) {
  const rstPath = join(SRC, rstRel);
  const outDir = join(OUT, seriesDir);
  const imgDir = join(outDir, 'images');
  mkdirSync(imgDir, { recursive: true });

  let md = execFileSync('pandoc', ['-f', 'rst', '-t', 'gfm', '--wrap=none', rstPath], {
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
  });

  // Drop the first H1 (rendered by the page layout from frontmatter).
  md = md.replace(/^# .+\n+/, '');

  // Rewrite/copy images. Pandoc emits: <img src="..." ...> or ![...](...)
  const rstDir = dirname(rstPath);
  const rewriteRef = (ref) => {
    const abs = resolveImage(ref, rstDir);
    if (!existsSync(abs)) {
      missingImages.push(`${rstRel}: ${ref}`);
      return null;
    }
    const name = basename(abs);
    copyFileSync(abs, join(imgDir, name));
    return `./images/${name}`;
  };

  md = md.replace(/<img src="([^"]+)"([^>]*)\/?>(?:<\/img>)?/g, (m, ref, rest) => {
    const next = rewriteRef(ref);
    if (!next) return '';
    const alt = /alt="([^"]*)"/.exec(rest)?.[1] ?? '';
    return `![${alt}](${next})`;
  });
  md = md.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, ref) => {
    if (ref.startsWith('./images/') || ref.startsWith('http')) return m;
    const next = rewriteRef(ref);
    if (!next) return '';
    return `![${alt}](${next})`;
  });

  // Strip raw-html artifacts and leftover Sphinx fragments pandoc sometimes emits.
  md = md
    .replace(/```\{=html\}[\s\S]*?```/g, '')
    .replace(/^:::+.*$/gm, '')
    .replace(/\n{3,}/g, '\n\n');

  // Untagged opening code fences -> ```text (Shiki wants a language).
  {
    const lines = md.split('\n');
    let inFence = false;
    for (let i = 0; i < lines.length; i++) {
      if (/^```/.test(lines[i])) {
        if (!inFence && lines[i].trim() === '```') lines[i] = '```text';
        inFence = !inFence;
      }
    }
    md = lines.join('\n');
  }

  const fm = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    'description: ""',
    `series: ${seriesDir}`,
    `order: ${order}`,
    `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
    '---',
    '',
  ].join('\n');

  writeFileSync(join(outDir, `${slug}.md`), fm + md);
  console.log(`✓ ${rstRel} -> ${seriesDir}/${slug}.md`);
}

if (missingImages.length) {
  console.log('\nMissing images (references dropped):');
  for (const m of missingImages) console.log(`  - ${m}`);
}
