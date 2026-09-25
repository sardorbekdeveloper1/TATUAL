import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { extract } from './extract.mjs';

const { groups: expected, warnings, sources } = extract();

const groups = ['firstCourse', 'secondCourse'].flatMap((file) =>
  JSON.parse(
    fs.readFileSync(`src/data/${file}.json`, 'utf8')
  )
);

// Full regeneration equality covers every source cell, including empty variants,
// teacher punctuation, rooms, paragraph boundaries, source coordinates and times.
assert.deepEqual(
  groups,
  expected,
  'Committed data differs from original DOCX files; run npm run extract and review changes.'
);

const expectedIds = [
  101, 102, 103, 104, 105, 106, 107, 108, 109,
  201, 202, 203, 204, 205, 206, 207, 208, 209, 210
].map(String);

assert.deepEqual(
  groups.map((g) => g.group),
  expectedIds
);

let periods = 0;
let variants = 0;
let free = 0;
let parallel = 0;

const routes = [];

for (const g of groups) {
  assert.equal(g.course, Number(g.group[0]));
  assert.equal(g.academicYear, '2026/2027');
  assert.equal(g.semester, 1);

  assert.ok(
    ['uz', 'ru'].includes(g.groupLanguage),
    `Invalid group language: ${g.group}`
  );

  assert.deepEqual(
    g.schedule.map((d) => d.day),
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  );

  routes.push(`/${g.course}-kurs/${g.group}`);

  for (const day of g.schedule) {
    assert.deepEqual(
      day.lessons.map((l) => l.period),
      [1, 2, 3, 4]
    );

    for (const lesson of day.lessons) {
      periods++;

      if (lesson.options.length > 1) {
        parallel++;
      }

      for (const time of [lesson.startTime, lesson.endTime]) {
        assert.match(
          time,
          /^(?:[01]\d|2[0-3]):[0-5]\d$/,
          `Invalid time format: ${g.group} ${day.day} ${lesson.period} => ${time}`
        );
      }

      assert.ok(
        lesson.startTime < lesson.endTime,
        `Invalid lesson time range: ${g.group} ${day.day} ${lesson.period}`
      );

      const sourceCells =
        sources[g.course - 1]
          .tables[g.sourceTable]
        [lesson.sourceRow]
          .slice(3);

      assert.equal(
        sourceCells.length,
        lesson.options.length,
        `Source option count mismatch: ${g.group} ${day.day} ${lesson.period}`
      );

      for (const [i, option] of lesson.options.entries()) {
        variants++;

        if (option.empty) {
          free++;
        }

        assert.deepEqual(
          option.sourceText,
          sourceCells[i].paragraphs,
          `Source text mismatch: ${g.group} ${day.day} ${lesson.period} option ${i + 1}`
        );

        const raw = option.sourceText
          .join(' ')
          .trim();

        assert.ok(
          !option.teacher || raw.includes(option.teacher),
          `Teacher not found in source cell: ${g.group} ${day.day} ${lesson.period}`
        );

        assert.ok(
          !option.room || raw.includes(option.room),
          `Room not found in source cell: ${g.group} ${day.day} ${lesson.period}`
        );

        assert.ok(
          !/\d{3}/.test(option.teacher || ''),
          `Room mixed into teacher: ${g.group} ${day.day} ${lesson.period}`
        );

        assert.ok(
          option.empty ||
          option.subject ||
          option.issue === 'missing-subject',
          `Missing subject: ${g.group} ${day.day} ${lesson.period}`
        );

        if (option.empty) {
          assert.match(
            raw,
            /^[-–—\s]*$/,
            `Empty option contains unexpected text: ${g.group} ${day.day} ${lesson.period}`
          );
        }
      }
    }
  }
}

assert.equal(
  new Set(routes).size,
  19,
  'Expected 19 unique group routes.'
);

const summary = {
  status: 'PASS',
  groups: groups.length,
  days: groups.length * 5,
  periods,
  sourceOptions: variants,
  parallelPeriods: parallel,
  emptyOptions: free,
  routes,
  sources: sources.map(({ file, sha256 }) => ({
    file,
    sha256
  })),
  warnings,
  checks: [
    'All 19 group IDs and metadata verified',
    'Monday–Friday and periods 1–4 verified',
    'Every normalized field compared to DOCX regeneration',
    'All separate cells and empty options retained in source order',
    'Teacher and room text checked against their original cell',
    'No accidental duplicate group/day/period records',
    'Every group route enumerated (browser tests verify rendering)'
  ]
};

// Resolve output directory from project root.
// This works reliably in local development and Vercel build environments.
const auditDir = path.join(
  process.cwd(),
  'source-audit'
);

const summaryFile = path.join(
  auditDir,
  'validation-summary.json'
);

// Create source-audit folder automatically if it does not exist.
fs.mkdirSync(auditDir, {
  recursive: true
});

// Save validation summary.
fs.writeFileSync(
  summaryFile,
  JSON.stringify(summary, null, 2) + '\n',
  'utf8'
);

console.log(
  JSON.stringify(summary, null, 2)
);