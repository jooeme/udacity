import React, { Component } from "react";
import Book from "./Book";

export default class BooksList extends Component {
  render() {
    const { books } = this.props;
    const bookracks = ["currentlyReading", "wantToRead", "read"];
    const bookracksNames = ["正在读", "喜欢的书", "收藏的书"];

    return (
      <div className="list-books-content">
        {bookracks.map((bookrack, index) => {
          return (
            <div key={index}>
              <div className="bookshelf">
                <h2 className="bookshelf-title">{bookracksNames[index]}</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {books.filter(book => book.shelf === bookrack).map(book => {
                      return (
                        <Book
                          onMoveBook={this.props.onMoveUpdate}
                          key={book.id}
                          book={book}
                        />
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
