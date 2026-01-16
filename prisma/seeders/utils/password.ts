import bcrypt from 'bcryptjs';

/**
 * Hashes a password using bcrypt
 * @param password - The plain text password to hash
 * @param saltRounds - The number of salt rounds (default: 12)
 * @returns The hashed password
 */
export async function hashPassword(password: string, saltRounds: number = 12): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Compares a plain text password with a hashed password
 * @param password - The plain text password
 * @param hash - The hashed password to compare against
 * @returns True if the password matches the hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    throw new Error(`Password comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generates a random password
 * @param length - The length of the password (default: 12)
 * @returns A randomly generated password
 */
export function generatePassword(length: number = 12): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}
