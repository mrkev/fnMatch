declare type ExtractReturnTypes<T extends ((...args: any[]) => any)[]> = [
    ...{
        [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never;
    }
];
declare type MatchResult<T extends ((...args: any[]) => any)[]> = ExtractReturnTypes<T>[number];
export declare const match: <VL>(v: VL) => <CS extends ((arg: any) => any)[]>(...cases: CS) => MatchResult<CS> | undefined;
export declare const func: <CS extends ((arg: any) => any)[]>(...cases: CS) => <VL>(v: VL) => MatchResult<CS> | undefined;
export {};
