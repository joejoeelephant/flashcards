import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
}

export function validateToken(token: string, secretKey: string): DecodedToken | null {
  try {
    const decodedToken = jwt.verify(token, secretKey);

    // If the token is not valid, jwt.verify will throw an error, so if we've gotten this far,
    // we know the token is good.
    return decodedToken as DecodedToken;
  } catch (error) {
    console.log('Error validating token:', error);
    return null;
  }
}

export function getTokenData(token: string) {
  const JWT_KEY = process.env.JWT_SECRET_KEY;
  if (!JWT_KEY) {
    throw new Error('JWT_SECRET is not defined');
  }
  try {
    const decodedToken = jwt.verify(token, JWT_KEY);

    // If the token is not valid, jwt.verify will throw an error, so if we've gotten this far,
    // we know the token is good.
    return decodedToken as DecodedToken;
  } catch (error) {
    return null;
  }

}