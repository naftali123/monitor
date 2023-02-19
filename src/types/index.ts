export type Json<T> = string | number | boolean | null | Json<T>[] | { [key: string]: Json<T> };

