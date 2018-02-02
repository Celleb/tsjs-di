'use strict';
declare var require: any;
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
const Provider = require('../dist/provider').Provider;
const DI = require('../dist').DI;

import 'reflect-metadata';
const expect = chai.expect;


describe('Provider decorator `@Provider()`', function () {
    it('a class should have metadata called `multi` when decorated with Provider and multi set to true', function () {
        @Provider({ multi: true })
        class Car {

        }
        expect(Reflect.getOwnMetadata('multi', Car)).to.be.ok;
    });

    it('should be able able to have its dependencies injected', function () {
        DI.clear();
        class Logger { }
        DI.register({ provide: 'Logger', useValue: 'car' });

        @Provider()
        class Fan {
            constructor(public logger: Logger) { }
        }
        const fan = new Fan(undefined);
        expect(fan.logger).to.eql('car');
    });
});
