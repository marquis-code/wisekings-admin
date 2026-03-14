import { GATEWAY_ENDPOINT } from "../axios.config";

export const currencies_api = {
  getRates: () => GATEWAY_ENDPOINT.get("/currencies/rates"),
  getCurrencies: () => GATEWAY_ENDPOINT.get("/currencies"),
};
