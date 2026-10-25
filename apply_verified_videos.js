require('dotenv').config();
const db = require('./src/config/db');
const fs = require('fs');
const path = require('path');
const { invalidateCourseTreeCache } = require('./src/controllers/courseController');

async function applyFixes() {
  console.log('Applying video fixes to database...');

  // 1. Recursion fixes from JSON
  const recPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\b011d1ed-3980-47fc-b55c-b05191f21f3c\\scratch\\resolved_recursion.json';
  if (fs.existsSync(recPath)) {
    const recList = JSON.parse(fs.readFileSync(recPath, 'utf8'));
    for (const item of recList) {
      const res = await db.query(
        'UPDATE problems SET external_link = $1 WHERE id = $2 RETURNING title',
        [item.url, item.id]
      );
      if (res.rowCount > 0) {
        console.log(`[Recursion Fixed] ${item.title} -> ${item.url}`);
      }
    }
  }

  // 2. Arrays verified fixes
  const arrayFixes = [
    { pattern: '%Set Matrix Zero%', url: 'https://www.youtube.com/watch?v=N0MgLvceX7M' },
    { pattern: '%Rotate%Matrix%', url: 'https://www.youtube.com/watch?v=Z0R2u6gd3GU' },
    { pattern: '%Count subarray%sum%', url: 'https://www.youtube.com/watch?v=fFVZt-6sgyo' },
    { pattern: '%Count%subarrays%xor%k%', url: 'https://www.youtube.com/watch?v=eZr-6p0B7ME' },
    { pattern: '%Repeating%missing%', url: 'https://www.youtube.com/watch?v=OTkoJOP6m6w' },
  ];

  for (const f of arrayFixes) {
    const res = await db.query(
      'UPDATE problems SET external_link = $1 WHERE title ILIKE $2 RETURNING title',
      [f.url, f.pattern]
    );
    if (res.rowCount > 0) {
      console.log(`[Array Fixed] ${res.rows[0].title} -> ${f.url}`);
    }
  }

  // 3. Heaps verified fixes
  const heapFixes = [
    { pattern: '%K-th Largest%Array%', url: 'https://www.youtube.com/watch?v=XEmy13g1Qxc' },
    { pattern: '%Merge K sorted Lists%', url: 'https://www.youtube.com/watch?v=q5a5OiGbT6Q' },
    { pattern: '%Replace Elements by Rank%', url: 'https://www.youtube.com/watch?v=f1nZp5Mr3XE' },
    { pattern: '%Design Twitter%', url: 'https://www.youtube.com/watch?v=pNichitDD2E' },
    { pattern: '%Min Cost%Connect Sticks%', url: 'https://www.youtube.com/watch?v=SYcHZEnKX8M' },
    { pattern: '%Max Sum Combination%', url: 'https://www.youtube.com/watch?v=KWgh9keTRAU' },
    { pattern: '%Top K Frequent Elements%', url: 'https://www.youtube.com/watch?v=YPTqKIgVk-k' },
  ];

  for (const f of heapFixes) {
    const res = await db.query(
      'UPDATE problems SET external_link = $1 WHERE title ILIKE $2 RETURNING title',
      [f.url, f.pattern]
    );
    if (res.rowCount > 0) {
      console.log(`[Heap Fixed] ${res.rows[0].title} -> ${f.url}`);
    }
  }

  // 4. DLL fundamental fixes
  const dllRes = await db.query(
    "UPDATE problems SET external_link = 'https://www.youtube.com/watch?v=0eKMU10uEDI' WHERE title ILIKE '%Doubly Linked List%' AND (title ILIKE '%Delete%' OR title ILIKE '%Insert%') RETURNING title"
  );
  console.log(`[DLL Fixed] Updated ${dllRes.rowCount} DLL problems to Striver L3`);

  // 5. Inorder Traversal
  const btRes = await db.query(
    "UPDATE problems SET external_link = 'https://www.youtube.com/watch?v=RlUu72JrOCQ' WHERE title ILIKE '%Inorder Traversal%' AND external_link ILIKE '%Z_NEgB8dWio%' RETURNING title"
  );
  if (btRes.rowCount > 0) {
    console.log(`[BT Fixed] Updated Inorder Traversal to verified video`);
  }

  // Invalidate cache
  invalidateCourseTreeCache('dsa');
  console.log('Course tree cache invalidated.');
  process.exit(0);
}

applyFixes().catch(err => {
  console.error('Error applying fixes:', err);
  process.exit(1);
});
