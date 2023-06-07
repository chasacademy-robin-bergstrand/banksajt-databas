import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mysql from 'mysql';

const app = express();
const PORT = 3000;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'bank',
});
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

let users = [];
let accounts = [];

function validateToken(req, res, next) {
  console.log(
    'validating token --------------------------------------------------------------------------------------'
  );

  const token = req.headers['authorization'].split(' ')[1];

  Jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    console.log(user);
    req.id = user.id;
    next();
  });
}

app.get('', (req, res) => {
  res.send('Hello');
});

app.post('/users', (req, res) => {
  const user = req.body;

  connection.query(
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
    [user.username, user.password, user.email],
    (err, results) => {
      if (err) {
        res.sendStatus(500);
      } else {
        connection.query(
          'INSERT INTO accounts (user_id, balance) VALUES (?, ?)',
          [results.insertId, user.money],
          (err, results) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.send('ok');
            }
          }
        );
      }
    }
  );
});

app.post('/sessions', (req, res) => {
  console.log(req.body);

  connection.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [req.body.username, req.body.password],
    (err, results) => {
      if (err) {
        res.sendStatus(500);
      } else {
        if (results[0]) {
          const token = Jwt.sign(
            { id: results[0].id },
            process.env.SECRET_TOKEN,
            {
              expiresIn: '900s',
            }
          );

          res.send(token);
        } else {
          res.send('Username or password incorrect');
        }
      }
    }
  );
});

app.get('/me/accounts', validateToken, (req, res) => {
  const id = req.id;

  connection.query(
    'SELECT * FROM accounts WHERE user_id = ?',
    [id],
    (err, results) => {
      if (err) {
        res.sendStatus(500);
      } else {
        console.log(results[0].balance);
        res.send(results[0].balance.toString());
      }
    }
  );
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('DB connected');
    app.listen(PORT, () => {
      console.log('Express server started listening on port ' + PORT);
    });
  }
});
