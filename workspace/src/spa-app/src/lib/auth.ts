import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'ngochuongspa-super-secret-key');

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secretKey);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, secretKey, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function setSession(user: any) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const session = await encrypt({ user, expires });

  const cookieStore = await cookies();
  cookieStore.set('session', session, { expires, httpOnly: true, path: '/' });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0), path: '/' });
}
