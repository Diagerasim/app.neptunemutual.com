export const MULTIPLIER = 10_000;
export const DAYS = 86400;

export const DEFAULT_GAS_LIMIT = "6000000";
export const ADDRESS_ONE = "0x0000000000000000000000000000000000000001";
export const ROWS_PER_PAGE = 50;
export const COVERS_PER_PAGE = 6;
export const GAS_MARGIN_MULTIPLIER = 1.5;

export const CoverStatus = {
  0: "Normal",
  1: "Stopped",
  2: "Incident Happened",
  3: "False Reporting",
  4: "Claimable",
};

export const ReportStatus = {
  Reporting: "Incident Happened",
  Claimable: "Claimable",
  FalseReporting: "False Reporting",
};

export const PoolTypes = {
  TOKEN: "token",
  POD: "pod",
};

export const languageKey = {
  "zh-CN": "Chinese - 中文",
  "en-US": "English",
  "fr-FR": "French - français",
  "id-ID": "Indonesian - Bahasa Indonesia",
  "ja-JP": "Japanese - 日本語",
  "ko-KR": "Korean - 한국어",
  "ru-RU": "Russian - русский",
  "es-ES": "Spanish - Español",
  "tr-TR": "Turkish - Türkçe",
};

export const localesKey = {
  "Chinese - 中文": "zh-CN",
  "English": "en-US",
  "French - français": "fr-FR",
  "Indonesian - Bahasa Indonesia": "id-ID",
  "Japanese - 日本語": "ja-JP",
  "Korean - 한국어": "ko-KR",
  "Russian - русский": "ru-RU",
  "Spanish - Español": "es-ES",
  "Turkish - Türkçe": "tr-TR",
};

// Will end with `/`
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).toString()
  : "/";

export const PRICING_URL = `${API_BASE_URL}pricing/{networkId}`;
export const POOL_INFO_URL = `${API_BASE_URL}protocol/staking-pools/info/{type}/{networkId}/{key}/{account}`;
export const UNSTAKE_INFO_URL = `${API_BASE_URL}protocol/consensus/unstake-info/{networkId}/{coverKey}/{account}/{incidentDate}`;

export const BOND_INFO_URL = `${API_BASE_URL}protocol/bond/info/{networkId}/{account}`;

export const FAUCET_URL = "https://faucet.neptunemutual.com/";
export const LEADERBOARD_URL = "https://leaderboard.neptunemutual.com/";

export const POOL_URLS = {
  3: "https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}",
  42: "https://app.sushi.com/add/{liquidityTokenAddress}/{NPMTokenAddress}",
  80001:
    "https://quickswap.exchange/#/add/{liquidityTokenAddress}/{NPMTokenAddress}",
};

export const SUBGRAPH_API_URLS = {
  3: process.env.NEXT_PUBLIC_ROPSTEN_SUBGRAPH_URL,
  42: process.env.NEXT_PUBLIC_KOVAN_SUBGRAPH_URL,
  80001: process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
};

export const NetworkUrlParam = {
  97: "bsc-testnet",
  80001: "mumbai",
  1: "",
  3: "ropsten",
};

export const GET_CONTRACTS_INFO_URL = `${API_BASE_URL}protocol/contracts/{networkName}`;
export const COVER_INFO_URL = `${API_BASE_URL}protocol/cover/info/{networkId}/{coverKey}/{account}`;
export const VAULT_INFO_URL = `${API_BASE_URL}protocol/vault/info/{networkId}/{coverKey}/{account}`;

