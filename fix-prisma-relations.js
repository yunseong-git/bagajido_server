const fs = require('fs');

const path = './prisma/schema.prisma';

let schema = fs.readFileSync(path, 'utf8');

schema = schema.replace(
  /@relation\(\s*([\s\S]*?)\s*\)/g,
  (match, content) => {
    const normalized = content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ')
      .replace(/,\s*/g, ', ');

    return `@relation(${normalized})`;
  },
);

fs.writeFileSync(path, schema, 'utf8');

console.log('Prisma relation formatting fixed.');