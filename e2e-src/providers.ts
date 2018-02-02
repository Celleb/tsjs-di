
/**
 * provider.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { Provider, Inject } from '../dist';

@Inject()
export class Car {
    private _name: string;
    constructor(public engine: Engine) {
        this._name = 'Tesla';
    }

    get name() {
        return this._name;
    }

}

@Provider({ multi: true })
export class Engine {
    private capacity: number;
    constructor(capacity: number) {
        this.capacity = capacity;
    }

    get cap(): number {
        return this.capacity;
    }

    static create(): Engine {
        return new Engine(5.5);
    }
}

export const config = {
    name: 'tsjs-di',
    author: 'Jonas Tomanga'
};


