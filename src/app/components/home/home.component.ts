import { Component, OnInit, ViewChild } from '@angular/core';
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
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  loading: boolean;
  showClear: boolean;
  
  constructor(private http: HttpClient) {
    this.bookSearch = new FormControl('');
    this.allBooks = [];
    this.searchResBooks = [];
    this.currentPage = 1;
    this.totalPages = 0;
    this.totalResults = 0;
    this.pageSize = 10;
    this.loading = false;
    this.showClear = false;
  }

  

  ngOnInit(): void {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
        filter((value: string) => value.length >= 3) // optional filter to prevent searching for short strings
      ).subscribe((value: string) => {
        this.currentPage = 1; //To reset page to 1 whenEver change in Input field happens
        this.searchBooks();
      }); 
  }
  
  searchBooks(): void {
    this.loading = true; // seting loading to true before making the HTTP request

    let apiUrl = `https://openlibrary.org/search.json?`;
    if (this.bookSearch.value.toLowerCase().startsWith('author:')) { //If user search as "author: --authorname--" this will give better results
      apiUrl += `author=${this.bookSearch.value.substring(7)}`;
    } else if (this.bookSearch.value.toLowerCase().startsWith('title:')) { //If user search as "title: --bookname--" this will give better results
      apiUrl += `title=${this.bookSearch.value.substring(6)}`;
    } else {
      apiUrl += `q=${this.bookSearch.value}`; //This will give results Based on Both 
    }
    apiUrl += `&offset=${(this.currentPage - 1) * this.pageSize}&limit=${this.pageSize}`; // adding pagination parameters
    this.http.get(apiUrl)
      .subscribe((response: any) => {
        this.searchResBooks = response.docs.map((book: any) => ({
          title: book.title,
          authors: book.author_name?.map((name: string) => ({ name })) || [],
          first_publish_year: book.first_publish_year,
          key: book.key
        }));
        this.loading = false; // seting loading to false after receiving the response
        this.allBooks = this.searchResBooks;
        this.totalResults = response.numFound;
        this.totalPages = Math.ceil(this.totalResults / this.pageSize);
      });
  }


  getPages(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  goToPage(pageNum: number): void {
    if (pageNum !== this.currentPage) {
      this.currentPage = pageNum;
      this.searchBooks();
    }
  }
  
  // navigate to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchBooks();
      this.getPages();
      this.goToPage(this.currentPage);
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchBooks();
      this.getPages();
      this.goToPage(this.currentPage);
    }
  }
  
  clearSearch(): void {
    this.bookSearch.reset();
    this.allBooks = [];
    this.searchResBooks = [];
    this.currentPage = 1;
    this.totalPages = 0;
    this.totalResults = 0;
  }

}