type AnyCase = (arg: any) => any | (() => any);
type MatchResult<CS extends AnyCase[]> = [] extends Required<Parameters<CS[number]>> ? ReturnType<CS[number]> : ReturnType<CS[number]> | undefined;
export declare function match<VL>(v: VL): <CS extends AnyCase[]>(...cases: CS) => MatchResult<CS>;
export declare function func<T extends AnyCase, CS extends AnyCase[] = T[]>(...cases: CS): <VL>(v: VL) => MatchResult<CS>;
export {};
