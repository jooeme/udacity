import React, { Component } from "react";

export default class Book extends Component {
  updateBook(shelf) {
    this.props.onMoveBook(this.props.book, shelf);
  }
  render() {
    const { book } = this.props;
    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                backgroundImage: `url(${
                  book.imageLinks !== undefined ? book.imageLinks.thumbnail : ""
                })`
              }}
            />
            <div className="book-shelf-changer">
              <select
                value={book.shelf}
                onChange={event => {
                  return this.updateBook(event.currentTarget.value);
                }}
              >
                <option value="move" disabled>
                  移动图书
                </option>
                <option value="currentlyReading">正在读</option>
                <option value="wantToRead">喜欢的书</option>
                <option value="read">收藏的书</option>
                <option value="none">不看了</option>
              </select>
            </div>
          </div>
          <div className="book-title">{book.title}</div>
          <div className="book-authors">{book.authors}</div>
        </div>
      </li>
    );
  }
}
