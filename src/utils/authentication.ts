import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

const scryptAsync = promisify(scrypt);

export class HashPassword {
  async pwdToHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }
  async pwdCompare(storedPassword: string, supliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(supliedPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }
}

export const hashPassword = new HashPassword();
