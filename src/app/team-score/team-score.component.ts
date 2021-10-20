import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ClockI } from '../app.component';

@Component({
	selector: 'app-team-score',
	templateUrl: './team-score.component.html',
	styleUrls: ['./team-score.component.css']
})
export class TeamScoreComponent implements OnInit {

	constructor() { }

	@Input() teamName: string = "";
	@Input() side: number = 1;
	@Input() penalties: ClockI[];
	@Output() updateScore = new EventEmitter();
	@Output() updateEmptyGoal = new EventEmitter();
	@Output() updatePenalty = new EventEmitter();
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

	changePenaltyStatus(i: number) {
		this.penalties[i].running = 1;
		this.updatePenalty.emit(
			{ 
				penalty: this.penalties[i], 
				index: i
			}
		)
	}

}
