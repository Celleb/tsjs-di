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

    emit() {
        return {
            name: this.car.name,
            capacity: this.car.engine.cap
        };
    }
}
