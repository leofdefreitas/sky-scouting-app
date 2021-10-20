import { Component, OnChanges, Input } from '@angular/core';

@Component({
	selector: 'app-clock',
	templateUrl: './clock.component.html',
	styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnChanges {

	@Input() timeInSeconds: number;
	displayedClock: string;
	constructor() {
		this.updateDisplayedClock();
	}

	ngOnChanges(): void {
		this.updateDisplayedClock()
	}

	updateDisplayedClock() {
		let minutes, seconds, minutesToBeDisplayed, secondsToBeDisplayed;
		minutes = Math.floor(this.timeInSeconds/60);
		seconds = this.timeInSeconds%60;

		minutesToBeDisplayed = minutes < 10 ? `0${minutes}` : `${minutes}`;
		secondsToBeDisplayed = seconds < 10 ? `0${seconds}` : `${seconds}`;

		this.displayedClock = `${minutesToBeDisplayed}:${secondsToBeDisplayed}`;
	}

}
