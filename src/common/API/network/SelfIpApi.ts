import { NetworkService } from "./NetworkService";

const IP_LS_KEY = "self_ip";
let tries = 1;

export async function getIp() {
  let lsIP = localStorage.getItem(IP_LS_KEY);
  if (!lsIP) {
    try {
      lsIP = await NetworkService.getIpURL();
      lsIP = lsIP.substring(2, 4) || "US";
      localStorage.setItem(IP_LS_KEY, lsIP);
    } catch (e) {
      setTimeout(() => {
        if (tries < 10) {
          tries += 1;
          getIp();
        }
      }, 100);
    }
  }
  return lsIP;
}

