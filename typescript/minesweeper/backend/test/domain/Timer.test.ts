import { Timer } from '../../src/domain/Timer';

describe('Timer', () => {
    let timer: Timer;

    beforeEach(() => {
        jest.useFakeTimers();
        timer = new Timer();
    });

    afterEach(() => {
        timer.stop();
        jest.useRealTimers();
    });

    it('should start the timer and increment elapsed time', () => {
        timer.start();
        jest.advanceTimersByTime(3000); // Advance time by 3 seconds
        expect(timer.elapsedTime).toBe(3);
    });

    it('should stop the timer', () => {
        timer.start();
        jest.advanceTimersByTime(2000); // Advance time by 2 seconds
        timer.stop();
        jest.advanceTimersByTime(3000); // Advance time by another 3 seconds
        expect(timer.elapsedTime).toBe(2);
    });

    it('should reset the timer', () => {
        timer.start();
        jest.advanceTimersByTime(4000); // Advance time by 4 seconds
        timer.reset();
        expect(timer.elapsedTime).toBe(0);
    });
});