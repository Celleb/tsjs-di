/**
 * e2e-js.ts
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

const DI = require('../dist').DI;
const Engine = require('./js-providers').Engine;
const Car = require('./js-providers').Car;
const config = require('./js-providers').config;
const Driver = require('./js-providers').Driver;

// register dependenices
DI.clear();
DI.register({ provide: 'Config', useValue: 'config' });
DI.register([
    Engine,
    { provide: Driver, useClass: Driver },
    { provide: Car, useFactory: Car.create, multi: true }
]);

describe('Javascript e2e', function () {
    it('injects `Engine` into car', function () {
        const car = DI.inject(Car);
        expect(car).to.be.an.instanceOf(Car);
        expect(car.name).to.eql('Brabus');
        expect(car.engine.capacity).to.eql(2.5);
    });

    it('supports multi instance dependencies', function () {
        const car = DI.inject(Car);
        const car2 = DI.inject(Car);
        expect(car.name).to.eql(car2.name);
        car.name = 'Tesla';
        expect(car.name).to.not.eql(car2.name);
    });

    it('supports single instance dependencies', function () {
        const driver = DI.inject(Driver);
        const driver2 = DI.inject(Driver);
        expect(driver.name).to.eql(driver2.name);
        driver.name = 'Jonas';
        expect(driver.name).to.eql(driver2.name);
    });

    it('creates a new instance with parameters and dependencies injected', function () {
        const driver = new Driver('Jonas');
        expect(driver.car).to.be.an.instanceOf(Car);
        expect(driver.name).to.eql('Jonas');
    });

    it('injects manually', function () {
        const car = new Car(DI.inject(Engine));
        expect(car.engine).to.be.an.instanceOf(Engine);
    });

    it('gets a value', function () {
        const conf = DI.inject('Config');
        const conf2 = DI.get('Config');
        expect(conf).to.eql(conf2);
    });
});

