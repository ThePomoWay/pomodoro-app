import envJson from './env.json';
let env = envJson[process.env.NODE_ENV];

export default env;