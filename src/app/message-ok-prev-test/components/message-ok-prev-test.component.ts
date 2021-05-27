import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-ok-prev-test',
  templateUrl: './message-ok-prev-test.component.html',
  styleUrls: ['./message-ok-prev-test.component.scss']
})
export class MessageOkPrevTestComponent implements OnInit {
  load = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() =>  {
      const creativeUser =  JSON.parse(localStorage.getItem('creative-user'));
      if (creativeUser == null) {
          this.router.navigate(['personal-info']);
      }
      setTimeout(() =>  {
          this.load = true;
        }, 1000);
      }, 1000);
  }


}
