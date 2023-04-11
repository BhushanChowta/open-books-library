import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';


@Component({
  selector: 'search-comp',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  bookSearch: FormControl;

  constructor() {
    this.bookSearch = new FormControl('');
  }


  ngOnInit(): void {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
      ).
      subscribe((value: string) => {
      });
  }
}
