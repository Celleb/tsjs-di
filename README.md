# tsjs-di

A seamless dependency injector for typescript and javascript.

## Installation

```bash
npm install tsjs-di
```

## Usage

### Typescript

#### Importing the dependency injector

```typescript
import {DI} from 'tsjs-di';
```

#### Creating providers

`./providerA.ts`
```typescript
export class ProviderA {
    name = 'ProviderA';
    constructor(){

    }
}
```

Providers will be injected as singletons into all dependants,
to inject multi instance a provider must be decorated with `@Provider({multi: true})`.

A Provider can also have its dependencies injected if it is decorated with `@Provider()` or `Inject()`.

`./providerB.ts`
```typescript
import {Provider} from 'tsjs-di';
import {ProviderA} from './providerA';

@Provider({multi: true})
export class ProviderB {
    name = 'providerB';
    constructor(private provider: ProviderA){
        console.log(provider.name);
    }
}
```


#### Creating dependants

A dependent class must be marked with `@Inject()` decorator to have its dependencies injected.

`./dependantA.ts`
```typescript
import {Inject} from 'tsjs-di';
import {ProviderA} from './providerA';

@Inject()
export class DependantA {
    provider: ProviderA;
    // the type of the provider is important to have the dependency inject by the DI
    constructor(provider: ProviderA){
        this.provider = provider;
    }
}
```

A dependency can also be injected into a class property by decorating the property with `@Inject()` decorator and specifying the type of the dependency.

`./dependantB.ts`
```typescript
import {Inject} from 'tsjs-di';
import {ProviderB} from './providerB';

export class DependantB{
    @Inject()
    provider: ProviderB;
    constructor(){
        console.log(this.provider.name);
    }
}
```

#### Register providers and running the DI

`index.ts`
```typescript
import {DI} from 'tsjs-id';
import {ProviderA} from './providerA';
import {ProviderB} from './providerB';
import {DependantA} from './dependantA';
import {DependantB} from './dependantB';

// register by specifying the class only
DI.register(ProviderA)

// Or by supplying a provider object
DI.register({provide: ProviderB, useClass: ProviderB});

// specifying a factory
DI.register({provide: ProvideA, useFactory: (di) => {
    return new ProviderA();
}});

// Or by specifiying an array with the above methods
DI.register([
    ProviderA,
    {provide: ProviderB, useClass: ProviderB}
]);

// You can also provide a value;

export class Config {
    name: string,
    author: string;
}

const value: Config = {
    name: 'tsjs-di',
    author: 'Jonas Tomanga';
}

DI.register({provide: 'Config', useValue: value });

// putting the DI into action

class App{
    @Inject()
    provider: ProviderB;
    constructor(private providerA: ProviderA){

    }

    emit(){
        return {
            name: this.providerB.name,
            nameB: this.providerA.name;
        }
    }
}

const app = new App(); // this will produce an error in the IDE
// altentively
const app = new App(undefined);

app.emit();
```

The `DI` will inject the dependencies as long as the parameters are not defined on call.


### Javascript

Since there is no type support in javascript, dependencies have to be injected manually. This methods can also be used in typescript.

#### Simple Example

```javascript

const DI = require('tsjs-di').DI;

class Provider {
    name = 'Provider';
    constructor(){

    }
}


class Dependant {
    constructor(provider = DI.inject('Provider')){
        this.provider = provider;
    }
}
DI.register(Provider);

const dep = new Dependant();
// or
const dep = new Depedant(DI.inject(Provider));
```

#### Factory Example

`./logger.js`
```javascript
class Logger {
    constructor(){

    }

    log(message){
        console.log(message);
    }
}

module.exports = Logger;
```

`./factory-provider.js`
```javascript
const DI = require('tsjs-di').DI;

class FactoryProvider {
    constructor(loggger){
        this.logger = logger;
    }

    log(message){
        this.logger.log(message);
    }

    static create(di){
        return new FactoryProvider(di.inject('Logger'));
    }
}

module.exports = FactoryProvider;
```

`./index.js`
```javascript
const DI = require('tsjs-di').DI;
const Logger = require('logger');
const FactoryProvider = require('factory-provider');

DI.clear();
DI.register([{
    Logger,
    {provide: FactoryProvider, useFactory: FactoryProvider.create}
}]);

const provider = DI.inject('FactoryProvider');
provide.log('Hello, world!');
```
