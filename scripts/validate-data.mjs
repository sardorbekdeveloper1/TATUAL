import fs from 'node:fs';
import assert from 'node:assert/strict';
import { extract } from './extract.mjs';

const { groups:expected, warnings, sources } = extract();
const groups = ['firstCourse','secondCourse'].flatMap(f=>JSON.parse(fs.readFileSync(`src/data/${f}.json`,'utf8')));
// Full regeneration equality covers every source cell, including empty variants,
// teacher punctuation, rooms, paragraph boundaries, source coordinates and times.
assert.deepEqual(groups,expected,'Committed data differs from original DOCX files; run npm run extract and review changes.');
const expectedIds = [101,102,103,104,105,106,107,108,109,201,202,203,204,205,206,207,208,209,210].map(String);
assert.deepEqual(groups.map(g=>g.group),expectedIds);
let periods=0, variants=0, free=0, parallel=0;
const routes=[];
for(const g of groups) {
  assert.equal(g.course,Number(g.group[0]));assert.equal(g.academicYear,'2026/2027');assert.equal(g.semester,1);
  assert.ok(['uz','ru'].includes(g.groupLanguage));
  assert.deepEqual(g.schedule.map(d=>d.day),['monday','tuesday','wednesday','thursday','friday']);
  routes.push(`/${g.course}-kurs/${g.group}`);
  for(const day of g.schedule) {
    assert.deepEqual(day.lessons.map(l=>l.period),[1,2,3,4]);
    for(const lesson of day.lessons) {
      periods++;if(lesson.options.length>1)parallel++;
      for(const t of [lesson.startTime,lesson.endTime])assert.match(t,/^(?:[01]\d|2[0-3]):[0-5]\d$/);
      assert.ok(lesson.startTime<lesson.endTime);
      const sourceCells=sources[g.course-1].tables[g.sourceTable][lesson.sourceRow].slice(3);
      assert.equal(sourceCells.length,lesson.options.length);
      for(const [i,o] of lesson.options.entries()) {
        variants++;if(o.empty)free++;
        assert.deepEqual(o.sourceText,sourceCells[i].paragraphs);
        const raw=o.sourceText.join(' ').trim();
        assert.ok(!o.teacher || raw.includes(o.teacher));assert.ok(!o.room || raw.includes(o.room));
        assert.ok(!/\d{3}/.test(o.teacher),`Room mixed into teacher: ${g.group} ${day.day} ${lesson.period}`);
        assert.ok(o.empty || o.subject || o.issue==='missing-subject');
        if(o.empty)assert.match(raw,/^[-–—\s]*$/);
      }
    }
  }
}
assert.equal(new Set(routes).size,19);
const summary={status:'PASS',groups:groups.length,days:groups.length*5,periods,sourceOptions:variants,parallelPeriods:parallel,emptyOptions:free,routes,sources:sources.map(({file,sha256})=>({file,sha256})),warnings,checks:['All 19 group IDs and metadata verified','Monday–Friday and periods 1–4 verified','Every normalized field compared to DOCX regeneration','All separate cells and empty options retained in source order','Teacher and room text checked against their original cell','No accidental duplicate group/day/period records','Every group route enumerated (browser tests verify rendering)']};
fs.writeFileSync('source-audit/validation-summary.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
