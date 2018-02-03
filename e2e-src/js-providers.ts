
/**
 * js-providers.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

import { DI } from '../dist';

export class Engine {
    capacity = 2.5;
    constructor() {

    }
}

export class Car {
    private _name: string;
    constructor(public engine) {
    }

    get name() {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    static create(di) {
        const car = new Car(di.inject('Engine'));
        car.name = 'Brabus';
        return car;
    }
}

export class Driver {
    car: Car;
    name: string;
    constructor(name, car = DI.inject('Car')) {
        this.car = car;
        this.name = name;
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

