// Benchmark values for the page-native Web Search charts.
// These are copied from the all-eight repetition and the Octen anchor run.

export const PROVIDERS = ["brave", "context", "exa", "kagi_session", "octen", "parallel", "perplexity", "tavily"] as const;
export type ProviderId = (typeof PROVIDERS)[number];

export const PROVIDER_LABELS: Record<ProviderId, string> = {
  "brave": "Brave",
  "context": "Context",
  "exa": "Exa",
  "kagi_session": "Kagi",
  "octen": "Octen",
  "parallel": "Parallel",
  "perplexity": "Perplexity",
  "tavily": "Tavily"
};

export const PROVIDER_COLORS: Record<ProviderId, string> = {
  "brave": "#4F30AB",
  "context": "#5E6AD2",
  "exa": "#1840ED",
  "kagi_session": "#FFB319",
  "octen": "#60FF70",
  "parallel": "#FB631B",
  "perplexity": "#1FB8CD",
  "tavily": "#7EAE9A"
};

export const CATEGORY_IDS = ["known_item", "primary_source", "technical_exact", "semantic_long_tail", "niche_small_web", "multi_constraint", "exploratory_diversity", "multilingual_regional", "robustness_noisy", "freshness_rolling"] as const;
export type BenchmarkCategory = (typeof CATEGORY_IDS)[number];

export const CATEGORY_LABELS: Record<BenchmarkCategory, string> = {
  "known_item": "Known item",
  "primary_source": "Primary source",
  "technical_exact": "Technical exact",
  "semantic_long_tail": "Semantic long tail",
  "niche_small_web": "Niche small web",
  "multi_constraint": "Multi-constraint",
  "exploratory_diversity": "Exploratory diversity",
  "multilingual_regional": "Multilingual regional",
  "robustness_noisy": "Robustness noisy",
  "freshness_rolling": "Freshness rolling"
};

export type ProviderSummary = {
  id: ProviderId;
  cost: number;
  p50: number;
  p95: number;
  meanResults: number;
  shortListRate: number;
  shortListCount: number;
  heuristic: number;
  heuristicLow: number;
  heuristicHigh: number;
  ai: number;
  aiLow: number;
  aiHigh: number;
};

export const PROVIDER_SUMMARIES: ProviderSummary[] = [
  { id: "brave", cost: 0.48, p50: 427.18, p95: 820.452, meanResults: 10, shortListRate: 0, shortListCount: 0, heuristic: 0.658591, heuristicLow: 0.616748, heuristicHigh: 0.700887, ai: 0.763355, aiLow: 0.730696, aiHigh: 0.796436 },
  { id: "context", cost: 0.144, p50: 2399.53, p95: 3854.07, meanResults: 9.219, shortListRate: 0.645833, shortListCount: 62, heuristic: 0.569333, heuristicLow: 0.532532, heuristicHigh: 0.6045, ai: 0.652954, aiLow: 0.615727, aiHigh: 0.689542 },
  { id: "exa", cost: 0.672, p50: 1102.01, p95: 1792.301, meanResults: 9.99, shortListRate: 0.010417, shortListCount: 1, heuristic: 0.523182, heuristicLow: 0.467802, heuristicHigh: 0.576692, ai: 0.724965, aiLow: 0.686789, aiHigh: 0.762572 },
  { id: "kagi_session", cost: 1.152, p50: 1271.573, p95: 1639.933, meanResults: 10, shortListRate: 0, shortListCount: 0, heuristic: 0.634164, heuristicLow: 0.598651, heuristicHigh: 0.670347, ai: 0.713753, aiLow: 0.674903, aiHigh: 0.752634 },
  { id: "octen", cost: 0.096, p50: 359.079, p95: 941.228, meanResults: 10, shortListRate: 0, shortListCount: 0, heuristic: 0.496206, heuristicLow: 0.452908, heuristicHigh: 0.540486, ai: 0.622943, aiLow: 0.57522, aiHigh: 0.669987 },
  { id: "parallel", cost: 0.484948, p50: 973.885, p95: 1755.199, meanResults: 9.99, shortListRate: 0.010417, shortListCount: 1, heuristic: 0.675343, heuristicLow: 0.63629, heuristicHigh: 0.713077, ai: 0.740286, aiLow: 0.697638, aiHigh: 0.781749 },
  { id: "perplexity", cost: 0.484948, p50: 814.504, p95: 1224.246, meanResults: 9.99, shortListRate: 0.010417, shortListCount: 1, heuristic: 0.576988, heuristicLow: 0.537109, heuristicHigh: 0.617021, ai: 0.775179, aiLow: 0.746001, aiHigh: 0.804397 },
  { id: "tavily", cost: 0.768, p50: 1295.519, p95: 2564.39, meanResults: 9.542, shortListRate: 0.3125, shortListCount: 30, heuristic: 0.556943, heuristicLow: 0.506143, heuristicHigh: 0.602074, ai: 0.631161, aiLow: 0.58269, aiHigh: 0.677887 },
];

export type QualityCell = {
  provider: ProviderId;
  category: BenchmarkCategory;
  heuristic: number;
  ai: number;
  delta: number;
};

export const QUALITY_CELLS: QualityCell[] = [
  { provider: "brave", category: "known_item", heuristic: 0.752677, ai: 0.683037, delta: -0.06964 },
  { provider: "brave", category: "primary_source", heuristic: 0.618262, ai: 0.604478, delta: -0.013784 },
  { provider: "brave", category: "technical_exact", heuristic: 0.70614, ai: 0.968374, delta: 0.262234 },
  { provider: "brave", category: "semantic_long_tail", heuristic: 0.598187, ai: 0.806571, delta: 0.208384 },
  { provider: "brave", category: "niche_small_web", heuristic: 0.604302, ai: 0.747303, delta: 0.143002 },
  { provider: "brave", category: "multi_constraint", heuristic: 0.654196, ai: 0.682982, delta: 0.028786 },
  { provider: "brave", category: "exploratory_diversity", heuristic: 0.560683, ai: 0.829486, delta: 0.268803 },
  { provider: "brave", category: "multilingual_regional", heuristic: 0.534976, ai: 0.788297, delta: 0.253322 },
  { provider: "brave", category: "robustness_noisy", heuristic: 0.61678, ai: 0.859942, delta: 0.243163 },
  { provider: "brave", category: "freshness_rolling", heuristic: 0.939712, ai: 0.663082, delta: -0.27663 },
  { provider: "context", category: "known_item", heuristic: 0.709563, ai: 0.584933, delta: -0.12463 },
  { provider: "context", category: "primary_source", heuristic: 0.617451, ai: 0.479211, delta: -0.13824 },
  { provider: "context", category: "technical_exact", heuristic: 0.608854, ai: 0.908526, delta: 0.299671 },
  { provider: "context", category: "semantic_long_tail", heuristic: 0.431831, ai: 0.695977, delta: 0.264146 },
  { provider: "context", category: "niche_small_web", heuristic: 0.476207, ai: 0.544733, delta: 0.068526 },
  { provider: "context", category: "multi_constraint", heuristic: 0.616334, ai: 0.599535, delta: -0.016799 },
  { provider: "context", category: "exploratory_diversity", heuristic: 0.587878, ai: 0.677916, delta: 0.090039 },
  { provider: "context", category: "multilingual_regional", heuristic: 0.505627, ai: 0.78666, delta: 0.281034 },
  { provider: "context", category: "robustness_noisy", heuristic: 0.464616, ai: 0.749493, delta: 0.284877 },
  { provider: "context", category: "freshness_rolling", heuristic: 0.674969, ai: 0.50256, delta: -0.172409 },
  { provider: "exa", category: "known_item", heuristic: 0.778902, ai: 0.71681, delta: -0.062092 },
  { provider: "exa", category: "primary_source", heuristic: 0.737904, ai: 0.790245, delta: 0.052341 },
  { provider: "exa", category: "technical_exact", heuristic: 0.499005, ai: 0.840728, delta: 0.341722 },
  { provider: "exa", category: "semantic_long_tail", heuristic: 0.371964, ai: 0.847792, delta: 0.475828 },
  { provider: "exa", category: "niche_small_web", heuristic: 0.403156, ai: 0.663665, delta: 0.260509 },
  { provider: "exa", category: "multi_constraint", heuristic: 0.315463, ai: 0.410464, delta: 0.095001 },
  { provider: "exa", category: "exploratory_diversity", heuristic: 0.506305, ai: 0.601301, delta: 0.094996 },
  { provider: "exa", category: "multilingual_regional", heuristic: 0.531256, ai: 0.783379, delta: 0.252123 },
  { provider: "exa", category: "robustness_noisy", heuristic: 0.29924, ai: 0.833862, delta: 0.534622 },
  { provider: "exa", category: "freshness_rolling", heuristic: 0.788627, ai: 0.761404, delta: -0.027224 },
  { provider: "kagi_session", category: "known_item", heuristic: 0.77038, ai: 0.630332, delta: -0.140048 },
  { provider: "kagi_session", category: "primary_source", heuristic: 0.5656, ai: 0.508539, delta: -0.057061 },
  { provider: "kagi_session", category: "technical_exact", heuristic: 0.67638, ai: 0.965999, delta: 0.289618 },
  { provider: "kagi_session", category: "semantic_long_tail", heuristic: 0.576866, ai: 0.803564, delta: 0.226698 },
  { provider: "kagi_session", category: "niche_small_web", heuristic: 0.543873, ai: 0.609077, delta: 0.065204 },
  { provider: "kagi_session", category: "multi_constraint", heuristic: 0.708912, ai: 0.7023, delta: -0.006612 },
  { provider: "kagi_session", category: "exploratory_diversity", heuristic: 0.647731, ai: 0.760149, delta: 0.112418 },
  { provider: "kagi_session", category: "multilingual_regional", heuristic: 0.459798, ai: 0.778425, delta: 0.318628 },
  { provider: "kagi_session", category: "robustness_noisy", heuristic: 0.552943, ai: 0.7977, delta: 0.244757 },
  { provider: "kagi_session", category: "freshness_rolling", heuristic: 0.839158, ai: 0.581443, delta: -0.257715 },
  { provider: "octen", category: "known_item", heuristic: 0.634079, ai: 0.504218, delta: -0.129861 },
  { provider: "octen", category: "primary_source", heuristic: 0.566756, ai: 0.457995, delta: -0.108761 },
  { provider: "octen", category: "technical_exact", heuristic: 0.422229, ai: 0.803138, delta: 0.380909 },
  { provider: "octen", category: "semantic_long_tail", heuristic: 0.361579, ai: 0.727702, delta: 0.366124 },
  { provider: "octen", category: "niche_small_web", heuristic: 0.374188, ai: 0.483776, delta: 0.109588 },
  { provider: "octen", category: "multi_constraint", heuristic: 0.514825, ai: 0.513904, delta: -0.00092 },
  { provider: "octen", category: "exploratory_diversity", heuristic: 0.566361, ai: 0.817121, delta: 0.250759 },
  { provider: "octen", category: "multilingual_regional", heuristic: 0.388752, ai: 0.767549, delta: 0.378798 },
  { provider: "octen", category: "robustness_noisy", heuristic: 0.384184, ai: 0.687367, delta: 0.303183 },
  { provider: "octen", category: "freshness_rolling", heuristic: 0.749106, ai: 0.466653, delta: -0.282453 },
  { provider: "parallel", category: "known_item", heuristic: 0.634408, ai: 0.683824, delta: 0.049417 },
  { provider: "parallel", category: "primary_source", heuristic: 0.537812, ai: 0.580644, delta: 0.042832 },
  { provider: "parallel", category: "technical_exact", heuristic: 0.7434, ai: 0.945776, delta: 0.202376 },
  { provider: "parallel", category: "semantic_long_tail", heuristic: 0.714756, ai: 0.832609, delta: 0.117853 },
  { provider: "parallel", category: "niche_small_web", heuristic: 0.640078, ai: 0.686717, delta: 0.046639 },
  { provider: "parallel", category: "multi_constraint", heuristic: 0.700699, ai: 0.654302, delta: -0.046396 },
  { provider: "parallel", category: "exploratory_diversity", heuristic: 0.70969, ai: 0.868549, delta: 0.158859 },
  { provider: "parallel", category: "multilingual_regional", heuristic: 0.582694, ai: 0.77799, delta: 0.195296 },
  { provider: "parallel", category: "robustness_noisy", heuristic: 0.58546, ai: 0.838832, delta: 0.253372 },
  { provider: "parallel", category: "freshness_rolling", heuristic: 0.904433, ai: 0.533621, delta: -0.370813 },
  { provider: "perplexity", category: "known_item", heuristic: 0.740208, ai: 0.681496, delta: -0.058713 },
  { provider: "perplexity", category: "primary_source", heuristic: 0.611379, ai: 0.700417, delta: 0.089038 },
  { provider: "perplexity", category: "technical_exact", heuristic: 0.545415, ai: 0.939341, delta: 0.393927 },
  { provider: "perplexity", category: "semantic_long_tail", heuristic: 0.477161, ai: 0.859067, delta: 0.381906 },
  { provider: "perplexity", category: "niche_small_web", heuristic: 0.548722, ai: 0.793983, delta: 0.245261 },
  { provider: "perplexity", category: "multi_constraint", heuristic: 0.572041, ai: 0.667805, delta: 0.095764 },
  { provider: "perplexity", category: "exploratory_diversity", heuristic: 0.536457, ai: 0.806133, delta: 0.269676 },
  { provider: "perplexity", category: "multilingual_regional", heuristic: 0.468119, ai: 0.784219, delta: 0.3161 },
  { provider: "perplexity", category: "robustness_noisy", heuristic: 0.400812, ai: 0.824734, delta: 0.423923 },
  { provider: "perplexity", category: "freshness_rolling", heuristic: 0.869568, ai: 0.694593, delta: -0.174975 },
  { provider: "tavily", category: "known_item", heuristic: 0.593283, ai: 0.494086, delta: -0.099197 },
  { provider: "tavily", category: "primary_source", heuristic: 0.573345, ai: 0.425502, delta: -0.147843 },
  { provider: "tavily", category: "technical_exact", heuristic: 0.646198, ai: 0.81675, delta: 0.170553 },
  { provider: "tavily", category: "semantic_long_tail", heuristic: 0.450362, ai: 0.737065, delta: 0.286703 },
  { provider: "tavily", category: "niche_small_web", heuristic: 0.546644, ai: 0.651105, delta: 0.104461 },
  { provider: "tavily", category: "multi_constraint", heuristic: 0.635553, ai: 0.594218, delta: -0.041335 },
  { provider: "tavily", category: "exploratory_diversity", heuristic: 0.618266, ai: 0.746278, delta: 0.128012 },
  { provider: "tavily", category: "multilingual_regional", heuristic: 0.495697, ai: 0.635232, delta: 0.139535 },
  { provider: "tavily", category: "robustness_noisy", heuristic: 0.476227, ai: 0.713888, delta: 0.237661 },
  { provider: "tavily", category: "freshness_rolling", heuristic: 0.533852, ai: 0.497483, delta: -0.036369 },
];

export const LATENCY_VALUES: Record<ProviderId, number[]> = {
  brave: [380.83, 381.811, 382.02, 383.014, 383.133, 385.828, 387.084, 388.105, 388.115, 390.134, 392.004, 392.017, 392.171, 392.808, 393.197, 394.849, 399.974, 400.163, 400.573, 403.446, 404.948, 405.558, 407.564, 407.768, 408.354, 408.618, 408.66, 408.697, 410.698, 410.713, 411.294, 412.743, 413.289, 413.919, 414.915, 415.503, 417.066, 417.196, 418.812, 419.763, 421.621, 422.271, 422.932, 423.052, 423.828, 424.655, 426.251, 427.136, 427.223, 427.61, 428.783, 429.331, 434.551, 434.698, 435.713, 436.016, 437.617, 439.233, 439.794, 440.055, 440.727, 442.999, 443.074, 444.205, 444.824, 446.606, 448.666, 449.984, 451.702, 454.086, 458.146, 488.993, 544.654, 564.752, 625.133, 718.727, 737.234, 745.413, 747.251, 749.714, 759.15, 762.201, 762.544, 763.321, 771.256, 782.229, 787.524, 789.667, 799.476, 803.442, 818.206, 827.191, 853.456, 877.72, 883.1, 900.362],
  context: [1722.541, 1769.358, 1772.33, 1796.905, 1829.957, 1880.682, 1892.494, 1913.459, 1950.615, 1954.503, 1958.738, 1966.588, 1971.94, 1972.763, 1973.417, 1987.034, 2037.252, 2046.661, 2053.686, 2062.672, 2068.106, 2079.868, 2084.698, 2085.166, 2091.168, 2106.427, 2108.794, 2133.957, 2140.054, 2184.872, 2202.353, 2216.651, 2222.64, 2237.996, 2279.969, 2288.271, 2288.609, 2296.356, 2313.008, 2314.702, 2321.369, 2326.077, 2332.753, 2334.153, 2354.136, 2371.717, 2373.56, 2384.733, 2414.326, 2433.292, 2437.428, 2453.851, 2495.91, 2524.571, 2554.21, 2554.683, 2593.428, 2605.031, 2649.617, 2649.793, 2679.411, 2686.155, 2692.295, 2735.714, 2746.06, 2746.945, 2762.377, 2767.642, 2814.514, 2825.342, 2925.279, 2955.664, 2986.623, 3014.033, 3025.764, 3085.349, 3091.985, 3097.181, 3147.063, 3159.572, 3175.401, 3181.037, 3223.816, 3227.679, 3227.723, 3266.605, 3498.487, 3613.115, 3628.634, 3769.489, 3839.432, 3897.983, 4022.902, 4090.578, 4264.65, 6686.651],
  exa: [116.455, 119.575, 634.795, 696.355, 697.695, 701.456, 701.772, 703.349, 728.795, 734.591, 769.706, 771.222, 777.778, 790.911, 791.971, 793.182, 811.166, 817.61, 839.564, 885.687, 887.968, 895.012, 898.727, 902.819, 904.174, 922.207, 922.664, 924.481, 934.297, 943.349, 953.508, 958.335, 958.994, 964.326, 966.032, 967.241, 982.79, 984.201, 1020.464, 1024.081, 1028.78, 1031.069, 1032.192, 1054.205, 1058.899, 1062.577, 1081.061, 1084.141, 1119.878, 1124.7, 1138.182, 1173.453, 1191.452, 1201.707, 1211.968, 1226.631, 1243.113, 1250.048, 1254.737, 1261.104, 1285.683, 1285.939, 1286.129, 1299.46, 1357.082, 1357.964, 1360.869, 1364.949, 1377.584, 1385.534, 1386.487, 1430.15, 1432.669, 1433.664, 1441.681, 1457.538, 1467.374, 1482.317, 1489.518, 1512.678, 1534.873, 1536.317, 1659.69, 1671.094, 1678.362, 1685.881, 1699.472, 1724.07, 1734.916, 1749.446, 1756.988, 1898.241, 2085.642, 2265.713, 2583.51, 3153.348],
  kagi_session: [169.813, 331.731, 843.362, 850.271, 976.908, 1036.02, 1090.678, 1103.005, 1129.016, 1149.872, 1183.799, 1185.887, 1201.905, 1206.079, 1206.086, 1206.446, 1212.012, 1218.17, 1218.43, 1223.001, 1226.846, 1230.199, 1235.459, 1235.757, 1236.896, 1236.983, 1238.435, 1242.098, 1242.756, 1243.236, 1243.462, 1243.948, 1244.712, 1246.011, 1246.728, 1248.444, 1249.198, 1249.331, 1254.379, 1257.253, 1259.438, 1262.881, 1263.282, 1265.85, 1266.631, 1268.253, 1268.438, 1271.052, 1272.095, 1272.116, 1274.091, 1276.841, 1280.453, 1284.537, 1285.348, 1285.856, 1286.964, 1297.094, 1298.413, 1302.677, 1305.823, 1308.941, 1317.872, 1320.465, 1321.631, 1323.596, 1325.784, 1327.83, 1332.466, 1347.433, 1354.21, 1360.385, 1362.334, 1363.756, 1364.026, 1369.828, 1376.008, 1376.043, 1381.691, 1396.215, 1399.109, 1402.809, 1405.023, 1418.235, 1439.729, 1446.597, 1489.054, 1522.947, 1622.078, 1624.846, 1635.68, 1652.69, 1661.558, 1667.61, 1828.066, 1852.085],
  octen: [224.114, 225.596, 230.622, 230.626, 234.767, 241.288, 252.709, 275.09, 279.167, 280.54, 282.801, 283.199, 284.028, 284.356, 284.402, 285.193, 285.659, 285.676, 286.342, 286.367, 286.389, 286.593, 287.516, 287.576, 288.28, 289.102, 289.107, 289.661, 290.25, 290.358, 291.014, 292.535, 293.994, 294.337, 296.951, 298.051, 300.049, 301.398, 304.907, 306.184, 309.433, 309.891, 310.367, 314.203, 317.014, 317.334, 358.715, 358.812, 359.346, 364.036, 365.806, 368.047, 368.785, 371.657, 374.283, 377.506, 379.883, 386.954, 389.497, 390.381, 392.312, 397.682, 403.315, 489.988, 506.893, 517.724, 529.874, 539.205, 550.853, 563.069, 803.89, 817.41, 834.196, 836.504, 841.033, 841.579, 843.114, 854.536, 856.359, 860.36, 875.482, 885.118, 898.161, 906.034, 908.955, 910.4, 914.566, 914.88, 927.113, 931.805, 939.977, 944.98, 955.762, 1070.356, 1098.15, 1099.807],
  parallel: [723.371, 745.683, 771.952, 804.237, 812.118, 817.132, 836.557, 837.362, 840.764, 844.564, 855.528, 855.868, 859.836, 860.595, 861.388, 861.646, 863.677, 865.724, 866.789, 870.657, 870.922, 876.935, 888.595, 889.007, 890.677, 893.011, 897.634, 899.119, 899.708, 902.143, 905.658, 906.626, 911.8, 916.443, 918.705, 925.79, 928.798, 929.858, 937.748, 941.696, 944.631, 948.696, 949.224, 953.614, 961.902, 963.419, 964.605, 971.075, 976.695, 983.481, 990.443, 991.187, 992.774, 993.02, 996.563, 1001.279, 1003.864, 1015.177, 1020.092, 1031.589, 1033.661, 1042.432, 1045.724, 1055.18, 1064.398, 1069.396, 1077.927, 1080.855, 1082.427, 1100.63, 1106.339, 1121.485, 1147.84, 1154.902, 1159.619, 1180.287, 1200.895, 1204.485, 1273.065, 1277.595, 1281.994, 1299.775, 1333.361, 1368.253, 1400.218, 1404.144, 1413.468, 1418.302, 1574.523, 1686.908, 1745.581, 1784.055, 1900.42, 1903.728, 1997.961, 2552.436],
  perplexity: [571.012, 575.754, 599.764, 603.476, 621.25, 629.473, 653.628, 657.374, 663.812, 670.72, 672.925, 674.247, 676.815, 677.025, 683.823, 687.174, 688.212, 688.944, 691.799, 697.07, 707.013, 714.559, 722.26, 723.951, 724.854, 729.602, 730.172, 731.032, 731.417, 734.862, 739.509, 746.479, 746.838, 747.452, 753.305, 758.984, 766.293, 769.521, 770.207, 770.987, 777.253, 777.336, 779.302, 788.496, 791.893, 795.326, 796.809, 809.593, 819.415, 820.893, 820.923, 824.634, 826.87, 827.455, 831.386, 833.296, 833.868, 851.638, 852.094, 854.528, 861.937, 863.178, 877.071, 887.597, 888.347, 889.218, 892.193, 893.435, 893.697, 896.564, 909.246, 922.581, 941.559, 943.111, 961.157, 963.235, 972.343, 998.291, 1013.274, 1019.887, 1021.015, 1035.726, 1059.251, 1070.203, 1074.169, 1080.116, 1105.916, 1115.18, 1187.206, 1198.212, 1219.05, 1239.833, 1271.723, 1391.802, 1405.907, 1450.856],
  tavily: [687.786, 738.889, 761.172, 762.117, 769.177, 793.715, 833.458, 874.21, 879.169, 887.661, 888.891, 891.207, 898.047, 916.402, 925.984, 934.439, 947.677, 953.223, 963.994, 966.958, 969.381, 976.923, 989.994, 990.405, 1003.856, 1006.854, 1008.739, 1065.423, 1067.711, 1069.75, 1075.656, 1091.387, 1098.069, 1113.817, 1114.869, 1130.64, 1142.535, 1152.108, 1166.14, 1188.474, 1206.707, 1220.459, 1227.732, 1235.172, 1252.899, 1267.913, 1286.411, 1290.22, 1300.818, 1395.658, 1401.582, 1417.329, 1428.289, 1465.961, 1466.339, 1483.141, 1520.408, 1520.669, 1582.015, 1634.399, 1661.62, 1693.312, 1694.911, 1724.796, 1749.281, 1777.563, 1790.557, 1809.664, 1824.499, 1835.602, 1842.774, 1866.878, 1883.686, 1887.419, 1892.491, 1895.525, 1924.018, 1929.631, 1931.962, 1947.33, 1970.001, 1991.916, 2028.044, 2078.462, 2096.872, 2234.067, 2353.98, 2357.399, 2406.174, 2429.918, 2526.709, 2677.434, 2979.606, 3118.627, 3134.304, 3146.28],
};

export const RANK_MEANS: Record<ProviderId, number[]> = {
  brave: [1.9, 1.95, 1.875, 1.6375, 2, 1.9625, 1.7, 1.75, 1.75, 1.525],
  context: [1.875, 1.6625, 1.8875, 1.7875, 1.7, 1.8, 1.7375, 1.602564, 1.565217, 1.12],
  exa: [1.8875, 1.5625, 1.5625, 1.375, 1.45, 1.375, 1.2125, 1.3625, 1.1875, 1.101266],
  kagi_session: [2.0125, 2, 1.7125, 1.775, 1.5875, 1.8125, 1.875, 1.8125, 1.625, 1.725],
  octen: [1.6625, 1.65, 1.45, 1.5875, 1.5, 1.4125, 1.2875, 1.425, 1.375, 1.275],
  parallel: [1.975, 1.8625, 1.875, 1.8, 1.825, 2.0375, 1.75, 1.825, 1.9, 1.7625],
  perplexity: [1.925, 1.85, 1.7625, 1.7, 1.55, 1.55, 1.35, 1.5, 1.325, 1.291139],
  tavily: [1.75, 1.9875, 1.8625, 1.8375, 1.6625, 1.5875, 1.493671, 1.293333, 1.39726, 1.053571],
};

export type PairwiseComparison = { a: ProviderId; b: ProviderId; wins: number; ties: number; losses: number };

export const PAIRWISE_COMPARISONS: PairwiseComparison[] = [
  { a: "brave", b: "context", wins: 50, ties: 11, losses: 19 },
  { a: "brave", b: "exa", wins: 50, ties: 13, losses: 17 },
  { a: "brave", b: "kagi_session", wins: 33, ties: 23, losses: 24 },
  { a: "brave", b: "octen", wins: 55, ties: 15, losses: 10 },
  { a: "brave", b: "parallel", wins: 28, ties: 21, losses: 31 },
  { a: "brave", b: "perplexity", wins: 48, ties: 17, losses: 15 },
  { a: "brave", b: "tavily", wins: 41, ties: 14, losses: 25 },
  { a: "context", b: "exa", wins: 40, ties: 16, losses: 24 },
  { a: "context", b: "kagi_session", wins: 15, ties: 22, losses: 43 },
  { a: "context", b: "octen", wins: 39, ties: 21, losses: 20 },
  { a: "context", b: "parallel", wins: 18, ties: 12, losses: 50 },
  { a: "context", b: "perplexity", wins: 28, ties: 28, losses: 24 },
  { a: "context", b: "tavily", wins: 26, ties: 25, losses: 29 },
  { a: "exa", b: "kagi_session", wins: 14, ties: 14, losses: 52 },
  { a: "exa", b: "octen", wins: 36, ties: 12, losses: 32 },
  { a: "exa", b: "parallel", wins: 21, ties: 8, losses: 51 },
  { a: "exa", b: "perplexity", wins: 21, ties: 21, losses: 38 },
  { a: "exa", b: "tavily", wins: 25, ties: 10, losses: 45 },
  { a: "kagi_session", b: "octen", wins: 51, ties: 17, losses: 12 },
  { a: "kagi_session", b: "parallel", wins: 22, ties: 25, losses: 33 },
  { a: "kagi_session", b: "perplexity", wins: 47, ties: 13, losses: 20 },
  { a: "kagi_session", b: "tavily", wins: 38, ties: 25, losses: 17 },
  { a: "octen", b: "parallel", wins: 14, ties: 9, losses: 57 },
  { a: "octen", b: "perplexity", wins: 20, ties: 16, losses: 44 },
  { a: "octen", b: "tavily", wins: 21, ties: 14, losses: 45 },
  { a: "parallel", b: "perplexity", wins: 49, ties: 10, losses: 21 },
  { a: "parallel", b: "tavily", wins: 44, ties: 16, losses: 20 },
  { a: "perplexity", b: "tavily", wins: 31, ties: 14, losses: 35 },
];

export const AGREEMENT_MATRIX: Record<ProviderId, number[]> = {
  brave: [1, 0.237722, 0.138826, 0.226456, 0.073821, 0.45213, 0.222605, 0.219412],
  context: [0.237722, 1, 0.165005, 0.343642, 0.057077, 0.162546, 0.254151, 0.52723],
  exa: [0.138826, 0.165005, 1, 0.150142, 0.049058, 0.105767, 0.159662, 0.140928],
  kagi_session: [0.226456, 0.343642, 0.150142, 1, 0.056784, 0.188775, 0.200248, 0.292573],
  octen: [0.073821, 0.057077, 0.049058, 0.056784, 1, 0.056212, 0.064462, 0.049331],
  parallel: [0.45213, 0.162546, 0.105767, 0.188775, 0.056212, 1, 0.160745, 0.146073],
  perplexity: [0.222605, 0.254151, 0.159662, 0.200248, 0.064462, 0.160745, 1, 0.210119],
  tavily: [0.219412, 0.52723, 0.140928, 0.292573, 0.049331, 0.146073, 0.210119, 1],
};

export type SourceShare = { host: string; value: number };

export const SOURCE_ECOLOGY: Record<ProviderId, SourceShare[]> = {
  brave: [{ host: "github.com", value: 0.06 }, { host: "stackoverflow.com", value: 0.05 }, { host: "reddit.com", value: 0.0225 }, { host: "medium.com", value: 0.03875 }, { host: "youtube.com", value: 0.00375 }, { host: "dev.to", value: 0.0225 }, { host: "postgresql.org", value: 0.02375 }, { host: "en.wikipedia.org", value: 0.015 }, { host: "Other hosts", value: 0.76375 }],
  context: [{ host: "github.com", value: 0.057188 }, { host: "stackoverflow.com", value: 0.038021 }, { host: "reddit.com", value: 0.072634 }, { host: "medium.com", value: 0.025625 }, { host: "youtube.com", value: 0.039583 }, { host: "dev.to", value: 0.011042 }, { host: "postgresql.org", value: 0.011806 }, { host: "en.wikipedia.org", value: 0.006979 }, { host: "Other hosts", value: 0.737123 }],
  exa: [{ host: "github.com", value: 0.13 }, { host: "stackoverflow.com", value: 0.05625 }, { host: "reddit.com", value: 0 }, { host: "medium.com", value: 0.0025 }, { host: "youtube.com", value: 0.0025 }, { host: "dev.to", value: 0.01125 }, { host: "postgresql.org", value: 0.03125 }, { host: "en.wikipedia.org", value: 0.00375 }, { host: "Other hosts", value: 0.7625 }],
  kagi_session: [{ host: "github.com", value: 0.09 }, { host: "stackoverflow.com", value: 0.03125 }, { host: "reddit.com", value: 0.05625 }, { host: "medium.com", value: 0.00125 }, { host: "youtube.com", value: 0 }, { host: "dev.to", value: 0.01375 }, { host: "postgresql.org", value: 0.005 }, { host: "en.wikipedia.org", value: 0.01625 }, { host: "Other hosts", value: 0.78625 }],
  octen: [{ host: "github.com", value: 0.04875 }, { host: "stackoverflow.com", value: 0.0525 }, { host: "reddit.com", value: 0.00125 }, { host: "medium.com", value: 0.02 }, { host: "youtube.com", value: 0.03875 }, { host: "dev.to", value: 0.01375 }, { host: "postgresql.org", value: 0.00875 }, { host: "en.wikipedia.org", value: 0.01625 }, { host: "Other hosts", value: 0.8 }],
  parallel: [{ host: "github.com", value: 0.06125 }, { host: "stackoverflow.com", value: 0.04875 }, { host: "reddit.com", value: 0.0075 }, { host: "medium.com", value: 0.02 }, { host: "youtube.com", value: 0.00375 }, { host: "dev.to", value: 0.0175 }, { host: "postgresql.org", value: 0.01125 }, { host: "en.wikipedia.org", value: 0.01125 }, { host: "Other hosts", value: 0.81875 }],
  perplexity: [{ host: "github.com", value: 0.04875 }, { host: "stackoverflow.com", value: 0.07 }, { host: "reddit.com", value: 0.03 }, { host: "medium.com", value: 0.03125 }, { host: "youtube.com", value: 0.037639 }, { host: "dev.to", value: 0.025 }, { host: "postgresql.org", value: 0.0175 }, { host: "en.wikipedia.org", value: 0.01 }, { host: "Other hosts", value: 0.729861 }],
  tavily: [{ host: "github.com", value: 0.041647 }, { host: "stackoverflow.com", value: 0.034182 }, { host: "reddit.com", value: 0.059023 }, { host: "medium.com", value: 0.029702 }, { host: "youtube.com", value: 0.04123 }, { host: "dev.to", value: 0.01184 }, { host: "postgresql.org", value: 0.011925 }, { host: "en.wikipedia.org", value: 0.01 }, { host: "Other hosts", value: 0.760451 }],
};

export const SOURCE_HOSTS = ["github.com", "stackoverflow.com", "reddit.com", "medium.com", "youtube.com", "dev.to", "postgresql.org", "en.wikipedia.org", "Other hosts"] as const;

export type AnchorSummary = {
  id: ProviderId;
  hit1: number;
  hit10: number;
  p95: number;
  gradedQueries: number;
};

export const ANCHOR_SUMMARIES: AnchorSummary[] = [
  { id: "brave", hit1: 0.785714, hit10: 0.946429, p95: 903.3014, gradedQueries: 56 },
  { id: "context", hit1: 0.875, hit10: 0.982143, p95: 6558.7637, gradedQueries: 56 },
  { id: "exa", hit1: 0.821429, hit10: 1, p95: 1901.52415, gradedQueries: 56 },
  { id: "kagi_session", hit1: 0.857143, hit10: 0.928571, p95: 1940.4089, gradedQueries: 56 },
  { id: "octen", hit1: 0.446429, hit10: 0.642857, p95: 1029.09105, gradedQueries: 56 },
  { id: "parallel", hit1: 0.428571, hit10: 0.946429, p95: 1313.43365, gradedQueries: 56 },
  { id: "perplexity", hit1: 0.857143, hit10: 1, p95: 1601.8697, gradedQueries: 56 },
  { id: "tavily", hit1: 0.232143, hit10: 0.910714, p95: 3651.0744, gradedQueries: 56 },
];

export type AnchorCategoryHit = { category: string; label: string; hit1: number; hit10: number };

export const ANCHOR_CATEGORY_HITS: Record<ProviderId, AnchorCategoryHit[]> = {
  brave: [{ category: "tech_code", label: "Tech and code", hit1: 0.833333, hit10: 0.944444 }, { category: "academic", label: "Academic", hit1: 0.875, hit10: 1 }, { category: "finance", label: "Finance", hit1: 0.5, hit10: 1 }, { category: "medical_legal", label: "Medical and legal", hit1: 1, hit10: 1 }, { category: "local", label: "Local", hit1: 0.625, hit10: 0.875 }, { category: "news", label: "News", hit1: 0.75, hit10: 0.75 }, { category: "ecommerce", label: "Ecommerce", hit1: 0.75, hit10: 1 }, { category: "entertainment", label: "Entertainment", hit1: 1, hit10: 1 }, { category: "general", label: "General", hit1: 0.5, hit10: 1 }],
  context: [{ category: "tech_code", label: "Tech and code", hit1: 1, hit10: 1 }, { category: "academic", label: "Academic", hit1: 1, hit10: 1 }, { category: "finance", label: "Finance", hit1: 0.75, hit10: 1 }, { category: "medical_legal", label: "Medical and legal", hit1: 1, hit10: 1 }, { category: "local", label: "Local", hit1: 0.625, hit10: 0.875 }, { category: "news", label: "News", hit1: 1, hit10: 1 }, { category: "ecommerce", label: "Ecommerce", hit1: 0.75, hit10: 1 }, { category: "entertainment", label: "Entertainment", hit1: 0.75, hit10: 1 }, { category: "general", label: "General", hit1: 0.5, hit10: 1 }],
  exa: [{ category: "tech_code", label: "Tech and code", hit1: 0.888889, hit10: 1 }, { category: "academic", label: "Academic", hit1: 0.75, hit10: 1 }, { category: "finance", label: "Finance", hit1: 1, hit10: 1 }, { category: "medical_legal", label: "Medical and legal", hit1: 1, hit10: 1 }, { category: "local", label: "Local", hit1: 0.5, hit10: 1 }, { category: "news", label: "News", hit1: 0.75, hit10: 1 }, { category: "ecommerce", label: "Ecommerce", hit1: 0.75, hit10: 1 }, { category: "entertainment", label: "Entertainment", hit1: 1, hit10: 1 }, { category: "general", label: "General", hit1: 1, hit10: 1 }],
  kagi_session: [{ category: "tech_code", label: "Tech and code", hit1: 0.888889, hit10: 0.888889 }, { category: "academic", label: "Academic", hit1: 0.875, hit10: 1 }, { category: "finance", label: "Finance", hit1: 0.75, hit10: 1 }, { category: "medical_legal", label: "Medical and legal", hit1: 1, hit10: 1 }, { category: "local", label: "Local", hit1: 0.875, hit10: 0.875 }, { category: "news", label: "News", hit1: 0.75, hit10: 1 }, { category: "ecommerce", label: "Ecommerce", hit1: 0.75, hit10: 0.75 }, { category: "entertainment", label: "Entertainment", hit1: 1, hit10: 1 }, { category: "general", label: "General", hit1: 0.5, hit10: 1 }],
  octen: [{ category: "tech_code", label: "Tech and code", hit1: 0.611111, hit10: 0.833333 }, { category: "academic", label: "Academic", hit1: 0.25, hit10: 0.25 }, { category: "finance", label: "Finance", hit1: 0.25, hit10: 0.75 }, { category: "medical_legal", label: "Medical and legal", hit1: 0.75, hit10: 0.75 }, { category: "local", label: "Local", hit1: 0.25, hit10: 0.5 }, { category: "news", label: "News", hit1: 0, hit10: 0.25 }, { category: "ecommerce", label: "Ecommerce", hit1: 0.75, hit10: 1 }, { category: "entertainment", label: "Entertainment", hit1: 0.75, hit10: 0.75 }, { category: "general", label: "General", hit1: 0, hit10: 0.5 }],
  parallel: [{ category: "tech_code", label: "Tech and code", hit1: 0.388889, hit10: 0.944444 }, { category: "academic", label: "Academic", hit1: 0.75, hit10: 1 }, { category: "finance", label: "Finance", hit1: 0.5, hit10: 1 }, { category: "medical_legal", label: "Medical and legal", hit1: 0.75, hit10: 1 }, { category: "local", label: "Local", hit1: 0.25, hit10: 0.875 }, { category: "news", label: "News", hit1: 0.5, hit10: 0.75 }, { category: "ecommerce", label: "Ecommerce", hit1: 0.25, hit10: 1 }, { category: "entertainment", label: "Entertainment", hit1: 0.25, hit10: 1 }, { category: "general", label: "General", hit1: 0, hit10: 1 }],
  perplexity: [{ category: "tech_code", label: "Tech and code", hit1: 0.888889, hit10: 1 }, { category: "academic", label: "Academic", hit1: 0.875, hit10: 1 }, { category: "finance", label: "Finance", hit1: 0.75, hit10: 1 }, { category: "medical_legal", label: "Medical and legal", hit1: 1, hit10: 1 }, { category: "local", label: "Local", hit1: 0.75, hit10: 1 }, { category: "news", label: "News", hit1: 1, hit10: 1 }, { category: "ecommerce", label: "Ecommerce", hit1: 0.75, hit10: 1 }, { category: "entertainment", label: "Entertainment", hit1: 1, hit10: 1 }, { category: "general", label: "General", hit1: 0.5, hit10: 1 }],
  tavily: [{ category: "tech_code", label: "Tech and code", hit1: 0.333333, hit10: 0.944444 }, { category: "academic", label: "Academic", hit1: 0.25, hit10: 0.875 }, { category: "finance", label: "Finance", hit1: 0.5, hit10: 1 }, { category: "medical_legal", label: "Medical and legal", hit1: 0, hit10: 1 }, { category: "local", label: "Local", hit1: 0, hit10: 0.75 }, { category: "news", label: "News", hit1: 0.25, hit10: 1 }, { category: "ecommerce", label: "Ecommerce", hit1: 0.5, hit10: 1 }, { category: "entertainment", label: "Entertainment", hit1: 0, hit10: 1 }, { category: "general", label: "General", hit1: 0, hit10: 0.5 }],
};
