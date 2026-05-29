export class Timer {
    private timerId: NodeJS.Timeout | null = null;
    private _elapsedTime: number = 0;  // in seconds
    private _isRunning: boolean = false;

    start(): void {
        this.timerId = setInterval(() => {
            this._elapsedTime++;
            console.log(`Time elapsed: ${this._elapsedTime} seconds`);
        }, 1000);
        this._isRunning = true;
    }

    stop(): void {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this._isRunning = false;
    }

    reset(): void {
        this.stop();
        this._elapsedTime = 0;
    }

    get elapsedTime(): number {
        return this._elapsedTime;
    }

    get isRunning(): boolean {
        return this._isRunning;
    }
}