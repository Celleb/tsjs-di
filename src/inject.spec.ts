'use strict';
declare var require: any;
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import 'reflect-metadata';
const DI = require('../dist').DI;
const Inject = require('../dist/inject').Inject;

const expect = chai.expect;


describe('Inject decorator', function () {
    const log = sinon.spy(function (message: string) {
        return true;
    });
    class Logger {
        info(message: string) {
            return log(message);
        }
    }
    beforeEach(function () {
        DI.clear();
    });

    it('should throw an error when trying to inject an unregistered dependency into the constructor', function () {
        @Inject()
        class Car {
            constructor(public logger: Logger) { }
        }

        expect(() => {
            const car = new Car(undefined);
        }).to.throw(ReferenceError, 'Dependency `Logger` does not exist.');

    });
    it('should throw an error when trying to inject an unregistered dependency into a property', function () {
        expect(() => {
            class Car {
                @Inject()
                log: Logger;
            }
        }).to.throw(ReferenceError, 'Dependency `Logger` does not exist.');
    });
    it('should inject a dependencies into a property', function () {
        DI.register(Logger);
        class Car {
            @Inject()
            log: Logger;
        }
        const car = new Car();
        expect(car.log).to.be.an.instanceof(Logger);
        car.log.info('Holla');
        expect(log.calledOnce).to.be.ok;
    });
    it('should inject dependencies into a constructor', function () {
        class Fork { }
        DI.register(Logger);
        DI.register(Fork);
        @Inject()
        class Car {
            constructor(public logger: Logger, public fork: Fork) { }
        }
        const car = new Car(undefined, undefined);
        expect(car.logger).to.be.an.instanceof(Logger);
        expect(car.fork).to.be.an.instanceOf(Fork);
        car.logger.info('Holla');
    });
    it('should inject a value dependency into a constructor', function () {
        const value = {
            fact: 2,
            sun: 4
        };
        DI.register({ provide: 'Logger', useValue: value });
        @Inject()
        class Face {
            constructor(public logger: Logger) { }
        }
        const face = new Face(undefined);
        expect(face.logger).to.eql(value);
    });

    it('should inject a useFactory dependency into a constructor', function () {
        const value = {
            fact: 2,
            sun: 4
        };
        DI.register({
            provide: 'Logger', useFactory: function () {
                return value;
            }
        });
        @Inject()
        class Face {
            constructor(public logger: Logger) { }
        }
        const face = new Face(undefined);
        expect(face.logger).to.eql(value);
    });

    it('should inject a multi instance dependency into a constructor', function () {
        class Fact {
            be = false;
        }
        DI.register({
            provide: Fact, useClass: Fact, multi: true
        });
        @Inject()
        class Face {
            constructor(public fact: Fact) { }
        }
        const face = new Face(undefined);
        expect(face.fact).to.be.an.instanceOf(Fact);
    });
});
