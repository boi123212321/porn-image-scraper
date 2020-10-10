var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Axios from "axios";
import { JSDOM } from "jsdom";
export function createDomFromURL(url, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield Axios.get(url, {
            headers: opts.headers || {}
        });
        const html = response.data;
        return new JSDOM(html);
    });
}
export function qsAll(dom, query) {
    return dom.window.document.querySelectorAll(query);
}
