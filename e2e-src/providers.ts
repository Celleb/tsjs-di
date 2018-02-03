
/**
 * provider.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { Provider, Inject, Injector } from '../dist';

@Provider({ multi: true })
export class Engine {
    private capacity: number;
    constructor(capacity: number) {
        this.capacity = capacity;
    }

    get cap(): number {
        return this.capacity;
    }

    set cap(value) {
        this.capacity = value;
    }

    static create(): Engine {
        return new Engine(5.5);
    }
}

@Inject()
export class Car {
    private _name: string;
    constructor(public engine: Engine) {
        this._name = 'Tesla';
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

}


export class Config {
    name: string;
    author: string;
}

export const config: Config = {
    name: 'tsjs-di',
    author: 'Jonas Tomanga'
};


