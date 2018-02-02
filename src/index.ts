/**
 * index.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2018 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { Injector } from './injector';
export * from './injector';
export * from './provider';
export * from './inject';

export const DI = new Injector();
