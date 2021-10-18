var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARKETS = exports.TOKEN_MINTS  = void 0;
const web3_js_1 = require("@solana/web3.js");
const markets_json_1 = __importDefault(require("./markets.json"));
const token_mints_json_1 = __importDefault(require("./token-mints.json"));

exports.TOKEN_MINTS = token_mints_json_1.default.map((mint) => {
    return {
        address: new web3_js_1.PublicKey(mint.address),
        name: mint.name,
    };
});
exports.MARKETS = markets_json_1.default.map((market) => {
    return {
        address: new web3_js_1.PublicKey(market.address),
        name: market.name,
        programId: new web3_js_1.PublicKey(market.programId),
        deprecated: market.deprecated,
    };
});
