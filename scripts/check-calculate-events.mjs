import vm from "node:vm";

// Fail closed if the function cannot be isolated; execute only the tracker body.
// The sandbox exposes a recording track function, never Google or network APIs.
export function validateCalculateEvents(source) {
  const match = source.match(/export function trackCalculate\(params: CalculateParams\) \{([\s\S]*?)\n\}/);
  if (!match) return false;
  try {
    for (const mode of ["single", "ranking", "compare", "quick_scenario", "PRIVATE_MODE", 12345, null]) {
      const sent = [];
      const sandbox = vm.createContext({
        params: Object.freeze({mode, monthly_amount: 54321, start_year: 2019, fund_id: "PRIVATE_FUND", email: "private@example.invalid", url: "https://example.invalid/?a=54321"}),
        track: (name, params) => sent.push(JSON.parse(JSON.stringify([name, params]))),
      });
      vm.runInContext("(function(params) {" + match[1] + "\n})(params)", sandbox, {timeout: 100});
      const valid = ["single", "ranking", "compare", "quick_scenario"].includes(mode);
      const expected = valid ? [["calculate", {mode}], [mode === "compare" ? "compare_complete" : "simulation_complete", {mode}]] : [];
      if (JSON.stringify(sent) !== JSON.stringify(expected)) return false;
    }
    return true;
  } catch {
    return false;
  }
}
