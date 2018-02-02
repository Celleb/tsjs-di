import { Constructor } from './constructor';

export interface BaseProvider {
    provide: Constructor | string;
    multi?: boolean;
}

export interface ClassProvider extends BaseProvider {
    useClass?: Constructor;
}

export interface FactoryProvider extends BaseProvider {
    useFactory?: (...args: any[]) => any;
}

export interface ValueProvider extends BaseProvider {
    useValue?: any;
}

export type Providers = any;