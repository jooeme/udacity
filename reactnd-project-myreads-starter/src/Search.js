import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import Book from './Book';

export default class Search extends Component {
  state = {
    query: '',
    searchBooks: [],
  };

  serarchBooks = (query) => {
    if (!query) {
      this.setState({
        query: '',
        searchBooks: [],
      });
    } else {
      this.setState({
        query: query,
      });
      BooksAPI.search(query).then((books) => {
        if (books.error) {
          books = [];
          console.log(`坑爹的报错了`);
        }
        books.map((book) =>
          this.props.books
            .filter((b) => b.id === book.id)
            .map((b) => (book.shelf = b.shelf))
        );
        this.setState({
          searchBooks: books,
        });
      });
    }
  };

  render() {
    return (
      <div className='search-books'>
        <div className='search-books-bar'>
          <Link to='/' className='close-search'>
            Close
          </Link>
          <div className='search-books-input-wrapper'>
            {/*
                  注意: BooksAPI的搜索仅限于一些特定的词汇。
                  你可以在此找到它们:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  然而，请记住，BooksAPI.search方法可以通过标题或者作者搜索。所以，如果你没有找到一个具体的作者或者头衔也不用担心。每次搜索都受到 SEARCH_TERMS 的限制。
                */}
            <input
              type='text'
              placeholder='Search by title or author'
              onChange={(event) =>
                this.serarchBooks(event.currentTarget.value.trim())
              }
            />
          </div>
        </div>
        <div className='search-books-results'>
          <ol className='books-grid'>
            {this.state.searchBooks.map((book) => (
              <Book
                onMoveBook={this.props.onMoveUpdate}
                key={book.id}
                book={book}
              />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}
