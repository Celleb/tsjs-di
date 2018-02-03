/**
 * index.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */

'use strict';
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
const expect = chai.expect;

import { Injector, DI, Inject } from '../dist';
import { Car, Engine, Config, config } from './providers';
import { CarEmitter } from './provided';

DI.clear();
DI.register([
    { provide: CarEmitter, useClass: CarEmitter },
    { provide: Engine, useFactory: Engine.create },
    { provide: Config, useValue: config },
]);
DI.register(Car);

@Inject()
class App {
    @Inject()
    emitter: CarEmitter;

    constructor(public conf?: Config, public conf2?: Config) {
    }
}

describe('tsjs-di e2e', function () {
    it('passes the e2e test', function () {
        const app = new App();
        const expected = {
            name: 'Tesla',
            capacity: 5.5
        };
        expect(app.emitter.emit()).to.eql(expected);
        expect(app.conf).to.eql(config);
    });
    it('injects the dependencies', function () {
        const emitter = new CarEmitter(undefined);
        const expected = {
            name: 'Tesla',
            capacity: 5.5
        };
        expect(emitter.emit()).to.eql(expected);
    });

    it('accepts an altenative dependency', function () {
        const altConfig = {
            name: 'tsjs-di',
            author: 'Logic++'
        };
        const app = new App(altConfig);
        expect(app.conf).to.eql(altConfig);
    });

    it('accepts an altenative dependency injection support', function () {
        const altConfig = {
            name: 'tsjs-di',
            author: 'Logic++'
        };
        const app = new App(undefined, altConfig);
        expect(app.conf2).to.eql(altConfig);
        expect(app.conf).to.eql(config);
    });

    it('verifies multi instance support', function () {
        const car = new Car(undefined);
        const car2 = new Car(undefined);
        expect(car.engine).to.eql(car2.engine);
        car2.engine.cap = 3;
        expect(car2.engine).to.not.eql(car.engine);
    });

    it('verifies singleton support', function () {
        const emitter = new CarEmitter(undefined);
        const emitter2 = new CarEmitter(undefined);
        emitter.car.name = 'Volkswagen';
        expect(emitter.car).to.eql(emitter.car);
    });

    after(function () {
        DI.clear();
    });
});

