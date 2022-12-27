import * as fs from 'fs';
import { configuration } from './configuration';

export const httpsOptions = configuration().httpsEnabled == true
  ? {
    // private-key.pem
    key: fs.readFileSync(`${configuration().httpsKeyFile}`),
    // public-certificate.pem
    cert: fs.readFileSync(`${configuration().httpsCertFile}`),
  }
  : undefined;
