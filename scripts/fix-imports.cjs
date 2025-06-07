const fs = require('fs');
const path = require('path');

// Function to process a file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix Radix UI imports
    content = content.replace(
      /import\s+(.*?)\s+from\s+["']@radix-ui\/([^@"']+)@[^"']+["']/g,
      'import $1 from "@radix-ui/$2"'
    );
    
    // Fix lucide-react imports
    content = content.replace(
      /import\s+({[^}]*})\s+from\s+["']lucide-react@[^"']+["']/g,
      'import $1 from "lucide-react"'
    );
    
    // Fix class-variance-authority imports
    content = content.replace(
      /import\s+({[^}]*}|[^\s,{}]+)\s+from\s+["']class-variance-authority@[^"']+["']/g,
      'import $1 from "class-variance-authority"'
    );
    
    // Fix other common package imports with versions
    content = content.replace(
      /import\s+([^\s]+)\s+from\s+["']([^@"']+)@[^"']+["']/g,
      'import $1 from "$2"'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to process all files in a directory recursively
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.match(/\.(js|jsx|ts|tsx)$/)) {
      processFile(fullPath);
    }
  });
}

// Start processing from the src directory
const srcDir = path.join(__dirname, '../src');
console.log('Fixing imports in:', srcDir);
processDirectory(srcDir);

console.log('Import fixing completed!');
