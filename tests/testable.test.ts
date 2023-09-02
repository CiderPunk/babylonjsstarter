// import {describe, expect, test} from '@jest/globals';
import {Testable} from '../src/testable';

const testGame = new Testable();

describe('testing game.ts', () => {
    test('testableFunction adds two numbers', () => {
        expect(testGame.testableFunction(1, 1)).toBe(2);
    });
});