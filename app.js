const express = require('express');
const bodyParser = require('body-parser');
const db = require('./connection');
const response = require('./response');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Get all companies
app.get('/companies', (req, res) => {
  db.query('SELECT * FROM companies', (err, results) => {
    if (err) {
      response(500, null, 'Error fetching companies', res);
    } else {
      response(200, results, 'Companies fetched successfully', res);
    }
  });
});

// Get snacks by company_id
app.get('/snacks', (req, res) => {
  const companyId = req.query.company_id;
  if (!companyId) {
    return response(400, null, 'Company ID is required', res);
  }
  db.query('SELECT * FROM snacks WHERE company_id = ?', [companyId], (err, results) => {
    if (err) {
      response(500, null, 'Error fetching snacks', res);
    } else {
      response(200, results, 'Snacks fetched successfully', res);
    }
  });
});

// Add a new snack
app.post('/snacks', (req, res) => {
  const { name, stock, description, company_id } = req.body;
  if (!name || !stock || !description || !company_id) {
    return response(400, null, 'All fields are required', res);
  }
  const newSnack = { name, stock, description, company_id };
  db.query('INSERT INTO snacks SET ?', newSnack, (err, results) => {
    if (err) {
      response(500, null, 'Error adding snack', res);
    } else {
      response(201, { id: results.insertId, ...newSnack }, 'Snack added successfully', res);
    }
  });
});

// Update a snack
app.put('/snacks/:id', (req, res) => {
  const snackId = req.params.id;
  const { name, stock, description, company_id } = req.body;
  if (!name || !stock || !description || !company_id) {
    return response(400, null, 'All fields are required', res);
  }
  const updatedSnack = { name, stock, description, company_id };
  db.query('UPDATE snacks SET ? WHERE id = ?', [updatedSnack, snackId], (err, results) => {
    if (err) {
      response(500, null, 'Error updating snack', res);
    } else if (results.affectedRows === 0) {
      response(404, null, 'Snack not found', res);
    } else {
      response(200, { id: snackId, ...updatedSnack }, 'Snack updated successfully', res);
    }
  });
});

// Delete a snack
app.delete('/snacks/:id', (req, res) => {
  const snackId = req.params.id;
  db.query('DELETE FROM snacks WHERE id = ?', [snackId], (err, results) => {
    if (err) {
      response(500, null, 'Error deleting snack', res);
    } else if (results.affectedRows === 0) {
      response(404, null, 'Snack not found', res);
    } else {
      response(200, null, 'Snack deleted successfully', res);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
