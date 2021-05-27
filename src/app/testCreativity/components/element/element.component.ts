import { Component, OnInit } from '@angular/core';


@Component({
    /*usaré ese selector como una etiqueta HTML en el template*/
    selector: 'app-element',
    templateUrl: './element.component.html',
    styleUrls: ['./element.component.scss']
})

export class ElementComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {

    }

}


