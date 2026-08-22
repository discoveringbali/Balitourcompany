const fs = require('fs');
const path = './src/app/admin/places/page.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove handleEditorInput
code = code.replace(/const handleEditorInput = \(e\) => {[\s\S]*?};\n/, '');

// 2. Remove onInput and onBlur from contentEditable
code = code.replace(/onInput=\{handleEditorInput\}\n\s*onBlur=\{handleEditorInput\}/, '');

// 3. Update handleSaveModal to grab innerHTML directly
code = code.replace(
  /const payload = \{ \.\.\.formData \};/,
  `const payload = { ...formData };\n    if (editorRef.current) {\n      payload.content = editorRef.current.innerHTML;\n    }`
);

fs.writeFileSync(path, code);
