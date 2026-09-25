import fs from 'node:fs';
import crypto from 'node:crypto';
import { unzipSync, strFromU8 } from 'fflate';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, trimValues: false, parseTagValue: false });
const children = (nodes, tag) => nodes.filter(n => tag in n).map(n => n[tag]);
const descendants = (nodes, tag) => nodes.flatMap(n => Object.entries(n).flatMap(([k,v]) => k === tag ? [v] : Array.isArray(v) ? descendants(v,tag) : []));
const text = nodes => nodes.map(n => Object.entries(n).map(([k,v]) => k === '#text' ? v : k === 'w:tab' ? '\t' : k === 'w:br' ? '\n' : k === ':@' || k.endsWith('Pr') ? '' : Array.isArray(v) ? text(v) : '').join('')).join('');
const property = (cell, tag) => descendants(cell, 'w:tcPr')[0]?.find(n => tag in n)?.[':@']?.['@_w:val'] ?? null;
const dayNames = { Dushanba:'monday', Seshanba:'tuesday', Chorshanba:'wednesday', Chorsahnba:'wednesday', Payshanba:'thursday', Juma:'friday' };
export const sourceFiles = ['1-kurs.2026-2027 .docx','2-kurs 2026-2027 .docx'];

export function readSources() {
  return sourceFiles.map(file => {
    const bytes = fs.readFileSync(file);
    const xml = strFromU8(unzipSync(bytes)['word/document.xml']);
    const root = parser.parse(xml);
    const tables = descendants(root,'w:tbl').map(table => children(table,'w:tr').map(row => children(row,'w:tc').map(cell => ({
      paragraphs: children(cell,'w:p').map(text), span: property(cell,'w:gridSpan'),
      merge: property(cell,'w:vMerge'), xmlCell: cell,
    }))));
    return { file, sha256:crypto.createHash('sha256').update(bytes).digest('hex'), tables };
  });
}

function parseOption(cell, context, parallel, index, warnings) {
  const raw = cell.paragraphs;
  const lines = raw.map(s=>s.trim()).filter(Boolean);
  const option = { subject:'',teacher:'',room:'', sourceText:raw, sourceColumn:index + 1, ...(parallel ? { variant: index === 0 ? 'A' : 'B' } : {}) };
  if (!lines.length || lines.every(s=>/^[-–—\s]+$/.test(s))) return {...option, empty:true};
  // A teacher-only cell is present in the original: never infer its subject.
  let teacherLine;
  if (lines.length === 1 && /Saidaxmedova Z\.\s+302$/.test(lines[0])) {
    teacherLine = lines[0];
    option.issue = 'missing-subject';
    warnings.push({ ...context, kind:option.issue, raw });
  } else {
    option.subject = lines[0];
    teacherLine = lines.slice(1).join(' ');
  }
  const match = teacherLine.match(/^(.*?)\s*\(\s*([^()]*)\s*\)\s*(`?)$/) || teacherLine.match(/^(.*?)\s+(\d{3})\s*$/);
  if (match) { option.teacher = match[1].trim(); option.room = match[2].trim(); }
  else {
    option.teacher = teacherLine;
    option.issue = teacherLine ? 'missing-room' : 'missing-teacher-room';
    warnings.push({...context,kind:option.issue,raw});
  }
  if(match?.[3]) {
    option.sourceSuffix=match[3];
    warnings.push({...context,kind:'trailing-source-character',raw});
  }
  return option;
}

export function extract() {
  const sources = readSources();
  const warnings = [];
  const groups = sources.flatMap(source => source.tables.map((rows, tableIndex) => {
    const header = rows[0].flatMap(c=>c.paragraphs).join('\n');
    const group = header.match(/Guruh:\s*(\d+)/)?.[1];
    const course = Number(header.match(/Bosqich:\s*(\d)/)?.[1]);
    const academicYear = header.match(/\d{4}\/\d{4}/)?.[0];
    const semester = Number(header.match(/Semestr:\s*(\d)/)?.[1]);
    if (!group || !course || !academicYear || !semester) throw Error('Unrecognized header: '+header);
    const result = { group, course, groupLanguage: /Rus guruhi/.test(header) ? 'ru' : 'uz', academicYear, semester, sourceFile:source.file, sourceTable:tableIndex, schedule:[] };
    let day;
    rows.slice(2).forEach((cells, rowOffset) => {
      const dayText = cells[0].paragraphs.join('').trim();
      if (dayText) {
        if (!dayNames[dayText]) throw Error('Unknown weekday '+dayText);
        day = {day:dayNames[dayText],sourceDay:dayText,lessons:[]}; result.schedule.push(day);
      }
      const period = Number(cells[1].paragraphs.join(''));
      const rawTime = cells[2].paragraphs.join('').trim();
      const times = rawTime.match(/^(\d{1,2})(\d{2})\s*[-–]\s*(\d{1,2})(\d{2})$/);
      if (!times) throw Error('Unrecognized time '+rawTime);
      const context = {group,day:day.day,period,row:rowOffset+2};
      const options = cells.slice(3).map((cell,index)=>parseOption(cell,context,cells.length>4,index,warnings));
      day.lessons.push({period,startTime:`${times[1].padStart(2,'0')}:${times[2]}`,endTime:`${times[3].padStart(2,'0')}:${times[4]}`,sourceTime:rawTime,sourceRow:rowOffset+2,options});
    });
    return result;
  }));
  return { groups, warnings, sources };
}

if (process.argv[1]?.endsWith('extract.mjs')) {
  const { groups, warnings, sources } = extract();
  fs.mkdirSync('src/data',{recursive:true});fs.mkdirSync('source-audit',{recursive:true});
  for(const course of [1,2]) fs.writeFileSync(`src/data/${course===1?'firstCourse':'secondCourse'}.json`,JSON.stringify(groups.filter(g=>g.course===course),null,2)+'\n');
  fs.writeFileSync('source-audit/source-cells.json',JSON.stringify(sources.map(s=>({...s,tables:s.tables.map(t=>t.map(r=>r.map(({xmlCell,...c})=>c)))})),null,2)+'\n');
  fs.writeFileSync('source-audit/source-warnings.json',JSON.stringify(warnings,null,2)+'\n');
  const esc = s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  fs.writeFileSync('source-audit/tables.html',`<!doctype html><meta charset="utf-8"><title>Original Word table cell audit</title><style>body{font:14px system-ui;margin:30px}table{border-collapse:collapse;width:100%;margin-bottom:40px}td{border:1px solid #aaa;padding:8px;vertical-align:top}caption{text-align:left;font-size:20px;font-weight:bold;padding:20px}</style>`+sources.map(s=>s.tables.map((t,i)=>`<table><caption>${esc(s.file)} · table ${i+1}</caption>${t.map(r=>`<tr>${r.map(c=>`<td colspan="${c.span??1}">${c.paragraphs.map(esc).join('<br>')}</td>`).join('')}</tr>`).join('')}</table>`).join('')).join(''));
  console.log(JSON.stringify({groups:groups.length,periods:groups.reduce((n,g)=>n+g.schedule.reduce((n,d)=>n+d.lessons.length,0),0),warnings},null,2));
}
