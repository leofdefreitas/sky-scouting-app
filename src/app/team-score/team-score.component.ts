import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-team-score',
	templateUrl: './team-score.component.html',
	styleUrls: ['./team-score.component.css']
})
export class TeamScoreComponent implements OnInit {

	constructor() { }

	@Input() teamName: string = "";
	@Input() side: number = 1;
	@Output() updateScore = new EventEmitter();
	@Output() updateEmptyGoal = new EventEmitter();
	teamScore = 0;
	isEmptyGoalOnAir: boolean = false;
	isTimeoutOnAir: boolean = false;
	emptyGoalOnAirText: string = "No"
	timeoutOnAirText: string = "No"


	ngOnInit(): void {
	}

	changeScore(addPoint: boolean) {
		if (addPoint) {
			this.teamScore++;
		} else {
			this.teamScore === 0 ? 0 : this.teamScore--;
		}
		this.updateScore.emit(this.teamScore.toString())
	}

	changeEmptyGoalStatus() {
		this.isEmptyGoalOnAir = !this.isEmptyGoalOnAir
		this.emptyGoalOnAirText = this.isEmptyGoalOnAir ? "Yes" : "No"
		this.updateEmptyGoal.emit(this.isEmptyGoalOnAir)
	}

	changeTimeoutStatus() {
		this.isTimeoutOnAir = !this.isTimeoutOnAir
		this.timeoutOnAirText = this.isTimeoutOnAir ? "Yes" : "No"
		this.updateEmptyGoal.emit(this.isTimeoutOnAir)
	}

}
