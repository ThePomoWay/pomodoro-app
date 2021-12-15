import envJson from './env.json';
let env = envJson[process.env.REACT_APP_API_ENV];
console.log(env);
export default env;