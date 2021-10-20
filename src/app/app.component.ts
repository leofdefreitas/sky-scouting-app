import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { timer } from 'rxjs'
import * as moment from 'moment';

export interface ClockI {
	type: string | number;
	seconds: number;
	limit: number;
	running: number;
	active: number;
	direction: number;
}

export interface ScoreI {
	type: string;
	scoreHome: number;
	scoreAway: number;
}

export interface OnScreenInfoI {
	type: number;
	active: number;
}

export interface ScoreClockI {
	matchId: number | null;
	timestamp: string | null;
	data: DataObjectI;
}

export interface DataObjectI {
	mainClock: ClockI;
	penalties: ClockI[];
	score: ScoreI;
	teamTimeout: OnScreenInfoI[];
	emptyGoal: OnScreenInfoI[];
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})	

export class AppComponent {

	penaltyTime: number = 120;
	headers_object: HttpHeaders = new HttpHeaders();
	matchId: string;
	matchIsLoaded: boolean = false;
	isClockRunning: boolean = false;
	gameTime: number = 0;
	gameTimeDisplayed = "00:00";
	clockText = "Start";
	timeRunning: number = 0;
	needsUpdate: boolean = false;
	scoreClock: ScoreClockI = {
		matchId: null,
		timestamp: null,
		data: {
			mainClock: {
				type: "main",
				seconds: 0,
				limit: 0,
				running: 0,
				active: 1,
				direction: 1
			},
			penalties: [{
				type: 1,
				seconds: 0,
				limit: 0,
				running: 0,
				active: 0,
				direction: -1
			}, {
				type: 2,
				seconds: 0,
				limit: 0,
				running: 0,
				active: 0,
				direction: -1
			}, {
				type: 3,
				seconds: 0,
				limit: 0,
				running: 0,
				active: 0,
				direction: -1
			}, {
				type: 4,
				seconds: 0,
				limit: 0,
				running: 0,
				active: 0,
				direction: -1
			}, {
				type: 5,
				seconds: 0,
				limit: 0,
				running: 0,
				active: 0,
				direction: -1
			}, {
				type: 6,
				seconds: 0,
				limit: 0,
				running: 0,
				active: 0,
				direction: -1
			}],
			score: {
				type: "score",
				scoreHome: 0,
				scoreAway: 0
			},
			teamTimeout: [{
				type: 1,
				active: 0
			}, {
				type: 2,
				active: 0
			}],
			emptyGoal: [{
				type: 1,
				active: 0
			}, {
				type: 2,
				active: 0
			}]
		}
	};

	constructor(public httpClient: HttpClient) {
	}

	ngOnInit() {
		timer(0, 1000).subscribe(_ => {
			this.scoreClock.data.mainClock.seconds = this.gameTime
			this.scoreClock.data.mainClock.running = this.isClockRunning === true ? 1 : 0
			this.timeRunning++;
			this.needsUpdate = this.timeRunning % 2 === 0  ? true : false
			if (this.isClockRunning) {
				/** MAIN CLOCK */
				if (this.gameTime+1 === 30*60 ||
					this.gameTime+1 === 60*60 ||
					this.gameTime+1 === 75*60 ||
					this.gameTime+1 === 90*60) {
						this.toggleTimer();
					}
				this.gameTime++;
				this.gameTimeDisplayed = this.getDisplayedGameTime(this.gameTime);

				/** PENALTIES CLOCKS */
				for (let penalty of this.scoreClock.data.penalties) {
					if (penalty.running) {
						penalty.seconds++;
					}
					if (penalty.seconds === this.penaltyTime) {
						penalty.running = 0;
						penalty.seconds = 0;
					}
				}
			}
			if (this.needsUpdate && this.matchIsLoaded) {
				this.sendUpdateToServer();
			} 
		});
	}

	loadMatch() {
		this.matchIsLoaded = true;
		this.scoreClock.matchId = parseInt(this.matchId)
	}

	updateScore($event: boolean, team: number) {
		if (team === 1) {
			this.scoreClock.data.score.scoreHome = parseInt($event.toString());
		} else {
			this.scoreClock.data.score.scoreAway = parseInt($event.toString());
		}
		this.sendUpdateToServer();
	}

	updateEmptyGoal($event: boolean, team: number) {
		if (team === 1) {
			this.scoreClock.data.emptyGoal[0].active = $event === true ? 1 : 0;
		} else {
			this.scoreClock.data.emptyGoal[1].active = $event === true ? 1 : 0;
		}
		this.sendUpdateToServer();
	}

	updatePenalty ($event: {penalty: ClockI, index: number}) {
		this.scoreClock.data.penalties[$event.index] = $event.penalty;
		this.sendUpdateToServer();
	}

	getDisplayedGameTime(gameTime: number) {
		let minutes, seconds, minutesToBeDisplayed, secondsToBeDisplayed;
		minutes = Math.floor(gameTime/60);
		seconds = gameTime%60;

		minutesToBeDisplayed = minutes < 10 ? `0${minutes}` : `${minutes}`;
		secondsToBeDisplayed = seconds < 10 ? `0${seconds}` : `${seconds}`;

		return `${minutesToBeDisplayed}:${secondsToBeDisplayed}`
	}

	toggleTimer() {
		this.isClockRunning = !this.isClockRunning;
		this.updateClockButtonText();
	}

	updateClockButtonText() {
		this.clockText = this.isClockRunning ? "Pause" : "Start";
	}

	setTimer(minutes: number) {
		this.isClockRunning = false;
		this.gameTime = minutes*60;
		this.gameTimeDisplayed = this.getDisplayedGameTime(this.gameTime);
		this.updateClockButtonText();
	}

	sendUpdateToServer() {
		this.scoreClock.timestamp = moment().format("DD-MM-YYYY HH:mm:ss.SSS");
		let httpOptions = {
			headers: new HttpHeaders({
				"Content-Type":  "application/json",
				"Authorization": `Basic ${btoa('skyAssignment:p0wer_overWhelm1ng')}`,
			}), params: new HttpParams()
		}
		this.httpClient.post("http://85.214.74.245:9111/hblclock", JSON.parse(JSON.stringify(this.scoreClock)), httpOptions).subscribe(res => {
			console.log(res)
		}, err => {
			console.log(err)
		})
	}
}
