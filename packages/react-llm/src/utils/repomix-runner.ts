import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runRepoMix(): Promise<string> {
  try {
    // Run RepoMix command to get codebase context
    const command = 'repomix && cat repomix-output.txt';
    const { stdout } = await execAsync(command);
    
    // Clean up the output file
    await execAsync('rm repomix-output.txt');
    
    return stdout;
  } catch (error) {
    console.error('Failed to run RepoMix:', error);
    return '';
  }
}
