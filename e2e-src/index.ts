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
import { Car, Engine, config } from './providers';
import { CarEmitter } from './provided';

DI.clear();
DI.register([
    { provide: Engine, useFactory: Engine.create },
    Car,
    { provide: CarEmitter, useClass: CarEmitter },
    { provide: 'Config', useValue: config },
]);

class App {
    @Inject()
    emitter: CarEmitter;

    constructor() {
    }
}

const app = new App();

describe('tsjs-di e2e', function () {
    it('passes the e2e test', function () {
        const expected = {
            name: 'Tesla',
            capacity: 5.5
        };
        expect(app.emitter.emit()).to.eql(expected);
    });
    it('injects the dependencies', function () {
        const app2 = new CarEmitter(undefined);
        const expected = {
            name: 'Tesla',
            capacity: 5.5
        };
        expect(app2.emit()).to.eql(expected);
    });
    after(function () {
        DI.clear();
    });
});

