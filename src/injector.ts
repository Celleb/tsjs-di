'use strict';
import { Providers, ClassProvider, ValueProvider, FactoryProvider } from './providers';
import { Constructor } from './constructor';

export class Injector {
    private singletons: { [key: string]: any };

    private factories: { [key: string]: any };

    constructor(private config?) {
        this.singletons = {};
        this.factories = {};
    }

    /**
     * Registers a provider
     * @param providers - A Class or a provider object
     * @throws {TypeError} - Throws TypeError for invalid providers.
     */
    register(providers: Providers): void {
        if (Array.isArray(providers)) {
            return this.registerMultiple(providers);
        }

        if (typeof providers === 'object' && providers.provide) {
            if ((typeof (<Providers>providers).provide !== 'string' && !this.isConstructor(providers))) {
                throw new TypeError('`Provider.provide` must be a string or a Class');
            }
            if ((<ClassProvider>providers).useClass) {
                return this.useClass(providers as ClassProvider);
            } else if ((<ValueProvider>providers).useValue) {
                return this.useValue(providers as ValueProvider);
            } else if ((<FactoryProvider>providers).useFactory) {
                return this.useFactory(providers as FactoryProvider);
            }
        }

        if (this.isConstructor(providers)) {
            return this.registerSingleton(providers);
        }

        throw new TypeError('Invalid provider(s)');
    }

    /**
     * Checks if a provider has a constructor.
     * @param provider
     * @returns {boolean}
     */
    private isConstructor(provider: any): boolean {
        if (provider.provide === null) {
            console.log(provider);
        }
        if (provider.provide) {
            return !!(typeof provider.provide === 'function' && provider.provide.prototype && provider.provide.prototype.constructor);
        }
        return !!(typeof provider === 'function' && provider.prototype && provider.prototype.constructor);
    }

    /**
     * Registers multiple providers
     * @param providers
     */
    private registerMultiple<T extends Constructor, K extends Providers>(providers: T[] | K[]): void {
        for (let provider of providers) {
            this.register(provider);
        }
    }

    /**
     * Registers a singleton provider
     * @param provider
     * @param name
     */
    private registerSingleton(provider: any, name?: string): void {
        name = name ? name : provider.prototype.constructor.name;
        this.singletons[name] = null;
        this.factories[name] = this.factory.bind(this, provider);
        return;
    }

    private registerSingletonFactory(factory: (...args: any[]) => any, name: string): void {
        this.singletons[name] = null;
        this.factories[name] = factory;
        return;
    }

    private registerMultiInstance(name: string, factory: (...args: any[]) => any): void {
        this.factories[name] = factory;
        return;
    }

    /**
     * Handles useClass Provider registration
     * @param provider
     */
    private useClass(provider: ClassProvider): any {
        const name = this.getName(provider);
        return (provider.multi || this.isMulti(provider.useClass)) ? this.registerMultiInstance(name, this.factory.bind(this, provider.useClass))
            : this.registerSingleton(provider.useClass, name);
    }

    private useValue(provider: ValueProvider): any {
        const name = this.getName(provider);
        return provider.multi ? this.registerMultiInstance(name, this.factory.bind(this, provider.useValue))
            : this.registerSingleton(provider.useValue, name);
    }

    private useFactory(provider: FactoryProvider): any {
        if (typeof provider.useFactory !== 'function') {
            throw new TypeError('Invalid factory, a factory must be a function.');
        }
        const name = this.getName(provider);
        return provider.multi ? this.registerMultiInstance(name, provider.useFactory)
            : this.registerSingletonFactory(provider.useFactory, name);
    }

    private isMulti(provider: Constructor): boolean {
        return !!Reflect.getOwnMetadata('multi', provider);
    }

    private getName(provider: Providers): string {
        return (typeof provider.provide === 'string') ? provider.provide : provider.provide.prototype.constructor.name;
    }

    private getKey(key: string | Constructor): string {
        return (typeof key === 'string') ? key : key.prototype.constructor.name;
    }

    /**
     * Creates a factory for a provider
     * @param provider
     */
    private factory(provider: any): any {
        if (this.isConstructor(provider) && provider.prototype.constructor) {
            return new provider();
        }
        return provider;
    }

    /**
     * Gets the dependency
     * @param key - A string or Class that identifies the dependency.
     * @throws {ReferenceError}
     */
    get(key: string | Constructor): any {
        const name = this.getKey(key);
        if (!this.factories.hasOwnProperty(name)) {
            throw ReferenceError('Dependency `' + name + '` does not exist.');
        }
        return this.factories[name](this);
    }

    /**
     * Injects a provider or dependency
     * @param key - A string or Class that identifies the dependency.
     * @throws {ReferenceError}
     */
    inject(key: string | Constructor): any {
        const name = this.getKey(key);
        if (this.singletons[name] === null && this.factories.hasOwnProperty(name)) {
            this.singletons[name] = this.get(name);
        }
        if (this.singletons.hasOwnProperty(name)) {
            return this.singletons[name];
        } else if (this.factories.hasOwnProperty(name)) {
            return this.get(name);
        }
        throw new ReferenceError('Dependency `' + name + '` does not exist.');
    }

    /**
     * Removes all registered providers
     */
    clear(): void {
        this.singletons = {};
        this.factories = {};
    }

    exist(provider: string | Constructor): boolean {
        const name = typeof provider === 'string' ? provider : provider.prototype.constructor.name;
        return !!(this.singletons.hasOwnProperty(name) || this.factories.hasOwnProperty(name));
    }
}
