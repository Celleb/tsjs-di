import { Constructor } from '../';
import { DI } from './';

import 'reflect-metadata';

export function Inject() {
    return function (target: Constructor | object, key?: string): any {
        if (key) {
            const name = Reflect.getOwnMetadata('design:type', target, key).name;
            const dependency = DI.inject(name);
            target[key] = dependency;
            return;
        }
        return newClass(target as Constructor);
    };
}

/**
 * Extends the constructor and injects the dependencies
 * @function
 * @param {Constructor} target
 * @returns {Constructor}
 */
export function newClass(target: Constructor): Constructor {
    return class extends target {
        constructor(...args: any[]) {
            const params = Reflect.getOwnMetadata('design:paramtypes', target);
            if (params) {
                for (let i in params) {
                    if (args[i] !== undefined) {
                        return;
                    }
                    const type = params[i].name;
                    const dependency = DI.inject(type);
                    args[i] = dependency;
                }
            }
            super(...args);
        }
    };
}

