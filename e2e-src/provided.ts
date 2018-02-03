/**
 * provided.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { Inject } from '../dist';
import { Car } from './providers';

@Inject()
export class CarEmitter {
    car: Car;
    constructor(car: Car) {
        this.car = car;
    }

    get engine() {
        return this.car.engine;
    }

    set capacity(value) {
        this.car.engine.cap = value;
    }

    emit() {
        return {
            name: this.car.name,
            capacity: this.car.engine.cap
        };
    }
}
