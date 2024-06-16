import Mutex from "@framework/concurrent/Mutex";
import { setTimeout } from "timers/promises";
import { describe, expect, it } from "vitest";

describe("Mutex", () => {
    describe("basic usage", () => {
        it("should lock and unlock", async () => {
            // Arrange
            const mutex = new Mutex();

            // Act
            await mutex.lock();
            mutex.unlock();

            // Assert
            expect(mutex.isUnlocked()).toBe(true);
        });

        it("should lock and unlock with extraneous releases", async () => {
            // Arrange
            const mutex = new Mutex({ ignoreExtraneousUnlocks: true });

            // Act
            await mutex.lock();
            mutex.unlock();

            // Assert
            expect(mutex.isUnlocked()).toBe(true);
        });

        it("should lock and unlock with extraneous releases and ignore them", async () => {
            // Arrange
            const mutex = new Mutex({ ignoreExtraneousUnlocks: true });

            // Act
            await mutex.lock();
            mutex.unlock();
            mutex.unlock();

            // Assert
            expect(mutex.isUnlocked()).toBe(true);
        });

        it("should lock and unlock with extraneous releases and throw an error if opted-in", async () => {
            // Arrange
            const mutex = new Mutex({
                ignoreExtraneousUnlocks: false
            });

            // Act
            await mutex.lock();
            mutex.unlock();

            // Assert
            expect(() => mutex.unlock()).toThrowError("This mutex is not locked yet.");
        });
    });

    describe("race condition checks", () => {
        it(
            "should lock and unlock with multiple locks",
            {
                repeats: 10
            },
            async () => {
                // Arrange
                const mutex = new Mutex();
                const output: number[] = [];
                const fn1 = async () => {
                    await mutex.lock();
                    await setTimeout(700 * Math.random());
                    output.push(1);
                    mutex.unlock();
                };

                const fn2 = async () => {
                    await mutex.lock();
                    await setTimeout(240 * Math.random());
                    output.push(2);
                    mutex.unlock();
                };

                // Act
                await Promise.all([fn1(), fn2()]);

                // Assert
                expect(output).toEqual([1, 2]);
            }
        );
    });
});
