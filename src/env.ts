import envJson from './env.json';
const envKey = import.meta.env.MODE === 'development' ? 'development' : 'production';
let env = envJson[envKey];

export default env;