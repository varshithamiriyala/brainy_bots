const { execSync } = require('child_process');
const path = require('path');

const repoPath = `C:\\Users\\varsh\\Downloads\\brandcraft-vscode (1)`;

try {
  // Change to repo directory
  process.chdir(repoPath);
  
  console.log('='.repeat(60));
  console.log('Git Status:');
  console.log('='.repeat(60));
  let output = execSync('git status', { encoding: 'utf-8' });
  console.log(output);
  
  console.log('\n' + '='.repeat(60));
  console.log('Adding all changes...');
  console.log('='.repeat(60));
  execSync('git add -A', { encoding: 'utf-8' });
  console.log('Changes staged');
  
  const commitMessage = `feat: Add brand selection confirmation with celebration and PDF download

- Enhanced App.jsx with motivational messages array
- Added celebration modal with confetti animation for completing all selections
- Implemented selection progress tracking in Dashboard
- Added PDF download option for complete brand package
- Includes congratulations modal with random celebration messages
- Confetti effects for both individual selections and completion

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`;
  
  console.log('\n' + '='.repeat(60));
  console.log('Creating commit...');
  console.log('='.repeat(60));
  output = execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { encoding: 'utf-8' });
  console.log(output);
  
  console.log('\n' + '='.repeat(60));
  console.log('Final Git Log:');
  console.log('='.repeat(60));
  output = execSync('git log --oneline -3', { encoding: 'utf-8' });
  console.log(output);
  
  console.log('\n✅ Commit completed successfully!');
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stdout:', error.stdout?.toString());
  console.error('Stderr:', error.stderr?.toString());
  process.exit(1);
}
