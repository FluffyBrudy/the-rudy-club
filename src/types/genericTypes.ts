export type MakeRequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
