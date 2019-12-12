import React, { Component } from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import Header from "./Header";
import BooksList from "./BooksList";
import { Route, Link } from "react-router-dom";
import Search from "./Search";

export default class BooksApp extends Component {
  state = {
    /**
     * TODO: 不要使用这个状态变量跟踪我们所在的页面
     * 而是使用浏览器地址栏中的URL。
     * 这将确保用户可以使用浏览器的后退和前进按钮进行页面导航
     * 同时提供一个可以收藏为书签和分享的好的网址。
     */
    books: []
  };

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState({
        books: books
      });
    });
  }

  moveUpdate = (book, shelf) => {
    if (this.state.books && shelf) {
      console.log(`我就看看移动了没${shelf}`);
      BooksAPI.update(book, shelf).then(() => {
        book.shelf = shelf;
        this.setState(state => ({
          books: state.books.filter(b => b.id !== book.id).concat([book])
        }));
      });
    }
  };

  render() {
    return (
      <div className="app">
        <Route
          exact
          path="/"
          render={() => (
            <div className="list-books">
              <Header />
              <BooksList
                books={this.state.books}
                onMoveUpdate={this.moveUpdate}
              />
              <div className="open-search">
                <Link to="/search">Add a book</Link>
              </div>
            </div>
          )}
        />

        <Route
          exact
          path="/search"
          render={() => (
            <Search books={this.state.books} onMoveUpdate={this.moveUpdate} />
          )}
        />
      </div>
    );
  }
}
