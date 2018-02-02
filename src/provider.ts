import { Constructor } from './constructor';
import { newClass } from './';
import 'reflect-metadata';

export function Provider(options?: { multi?: boolean }) {
    return function <T extends Constructor>(target: T) {
        target = newClass(target) as T;
        if (options && options.multi === true) {
            Reflect.defineMetadata('multi', true, target);
        }
        return target;
    };
}
