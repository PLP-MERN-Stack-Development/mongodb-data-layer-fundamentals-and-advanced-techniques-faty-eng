// ===========================
// Week 1 — MongoDB Queries
// plp_bookstore database
// ===========================

// ---------------------------
// TASK 2 — BASIC CRUD QUERIES
// ---------------------------

// Find all books in a specific genre
db.books.find({ genre: "Fantasy" });

// Find books published after a certain year
db.books.find({ published_year: { $gt: 2000 } });

// Find books by a specific author
db.books.find({ author: "George Orwell" });

// Update the price of a specific book
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 19.99 } }
);

// Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" });


// ---------------------------
// TASK 3 — ADVANCED QUERIES
// ---------------------------

// Books in stock AND published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});

// Projection: return only title, author, and price
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
);

// Sort by price (ascending)
db.books.find().sort({ price: 1 });

// Sort by price (descending)
db.books.find().sort({ price: -1 });

// Pagination: 5 books per page
// Page 1
db.books.find().limit(5);

// Page 2
db.books.find().skip(5).limit(5);


// ---------------------------
// TASK 4 — AGGREGATION PIPELINES
// ---------------------------

// 4.1 Average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  }
]);

// 4.2 Author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]);

// 4.3 Group books by decade
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $concat: [
          {
            $substr: [
              { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] },
              0,
              -1
            ]
          },
          "s"
        ]
      }
    }
  },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);


// ---------------------------
// TASK 5 — INDEXES
// ---------------------------

// Single index on title
db.books.createIndex({ title: 1 });

// Compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// Use explain() to verify index usage
db.books.find({ title: "1984" }).explain("executionStats");
db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats");
