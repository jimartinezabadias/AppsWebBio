import { Component, OnInit } from '@angular/core';

import { TestCreativity } from '../../core/models/testCreativity.module';
import { Clock } from '../../core/models/clock.module';
import { CreativeUser } from './../../core/models/creative-user.interface';
import { Element } from './../../core/models/element.module';
import { DataDbService } from '../../core/services/db/data-db.service';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';

@Component({
    selector: 'app-testcreativity',
    templateUrl: './testCreativity.component.html',
    styleUrls: ['testCreativity.component.scss']
})

export class TestCreativityComponent implements OnInit {

    constructor(private router: Router, private dbData: DataDbService) { }

    // INIT
    started = false;
    countDown = 4;
    alertDesert = false;
    dateStart: Date;
    dateEnd: Date;

    // CLOCK
    controlTime = 59;

    clock: Clock = {
        seconds: this.controlTime,
        state: 'started',
        minutes: 4,
        limit: 0
    };

    // OBJECT
    element: Element;

    // PROPOSAL
    empty = '';
    finalProposals = [];
    proposals = '';

    // USER
    user: CreativeUser;

    points = 0;
    minRandom = 0;
    maxRandom = 2;

    // TEST
    testCreativity: TestCreativity = {
        id: 1,
        name: 'Creatividad'
    };

    ngOnInit(): void {
        const creativeUser = this.getUser();
        const finalElement = this.getElement();
        this.element = finalElement;
        if (!creativeUser) {
            this.router.navigate(['select-test']);
        }
        this.countdown();
    }

    getUser() {
        const creativeUser = JSON.parse(localStorage.getItem('creative-user'));
        return creativeUser;
    }
    getElement() {
        const finalElement = JSON.parse(localStorage.getItem('final-element'));
        return finalElement;
    }

    countdown() {
        setTimeout(() => {
            this.countDown = 3;
            setTimeout(() => {
                this.countDown = 2;
                setTimeout(() => {
                    this.countDown = 1;
                    setTimeout(() => {
                        this.started = true;
                        this.startTest();
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }

    startTest() {
        this.dateStart = new Date();
        const test = setInterval(() => {
            if (this.clock.state === 'started') {
                this.clock.seconds--;
                if (this.clock.seconds === -1) {
                    this.clock.seconds = this.controlTime;
                    this.clock.minutes--;
                }
                if (this.clock.minutes === this.clock.limit
                    && this.clock.seconds === this.clock.limit) {
                    this.finalizedTest();
                    clearInterval(test);
                }
            }
        }, 1000);
    }

    activeAlert() {
        if (!this.alertDesert) {
            this.alertDesert = true;
        } else {
            this.alertDesert = false;
        }
    }

    finalizedTest() {
        this.dateEnd = new Date();
        this.resetClock();
        let arrayProposal: any;
        arrayProposal = this.proposals.split('\n');
        this.finalProposals = this.validProposal(arrayProposal, this.empty);
        this.showProposal(this.finalProposals);
        const finalScore = this.getFinalScore();
        this.points = finalScore + this.finalProposals.length;
        this.assingDataToUser(this.dateStart, this.dateEnd);
        this.saveInBBDD();
        localStorage.clear();
    }

    assingDataToUser(dateStart: Date, dateEnd: Date) {
        this.user = JSON.parse(localStorage.getItem('creative-user'));
        this.user.proposal = this.finalProposals;
        this.user.object = this.element.name;
        this.user.dateStart = dateStart;
        this.user.dateEnd = dateEnd;
    }

    getFinalTime(dateStart: Date, dateEnd: Date) {
        // tslint:disable-next-line: new-parens
        const a = new Date;
        // tslint:disable-next-line: new-parens
        const b = new Date;
        const finalTime = a.getSeconds() - b.getSeconds();
    }

    getFinalScore() {
        return this.minRandom + Math.floor((this.maxRandom - this.minRandom) * Math.random());
    }

    resetClock() {
        this.clock.minutes = 0;
        this.clock.seconds = 0;
        this.alertDesert = false;
        this.clock.state = 'finalized';
    }

    saveInBBDD() {
        this.dbData.saveContact(this.user);
    }


    // FUNCTIONS PROPOSAL
    validProposal(arrayProposal: string | any[], empty: any) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < arrayProposal.length; i++) {
            const proposal = arrayProposal[i];
            if (proposal !== empty) {
                this.finalProposals.push(proposal);
            }
        }
        return this.finalProposals;
    }

    showProposal(finalProposals: any) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < finalProposals.length; i++) {
            const proposal = finalProposals[i];
            // this.user.proposal.push(proposal);
        }
    }

}

