import { Component, OnInit,ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bookSearch: FormControl;
  allBooks: any[];
  searchResBooks: any[];
  constructor(private http: HttpClient) {
    this.bookSearch = new FormControl('');
    this.allBooks = [];
    this.searchResBooks = [];
  }

  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  ngOnInit(): void {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
        filter((value: string) => value.length >= 3) // optional filter to prevent searching for short strings
      ).subscribe((value: string) => {
        let apiUrl = `https://openlibrary.org/search.json?`;
        if (value.toLowerCase().startsWith('author:')) {
          apiUrl += `author=${value.substring(7)}`;          //If user search as "author: --authorname--" this will give better results
        } else if (value.toLowerCase().startsWith('title:')) {
          apiUrl += `title=${value.substring(6)}`;      //If user search as "title: --bookname--" this will give better results
        } else {
          apiUrl += `q=${value}`;   //This will give results Based on Both 
        }
        this.http.get(apiUrl)
          .subscribe((response: any) => {
            this.searchResBooks = response.docs.map((book: any) => ({
              title: book.title,
              authors: book.author_name?.map((name: string) => ({ name })) || [], //Array  of objects that contains all the authors of a book
              first_publish_year: book.first_publish_year,             
              key: book.key
            }));
            this.allBooks = this.searchResBooks;
          });
      }); 
  }
  
}
