const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'token_management'
})

app.listen(8081, () => {
  console.log('listening');
})

app.post("/signUp", (req, res) => {
  const sql = "INSERT INTO signup (`email`,`username`,`password`) VALUES (?)";
  const values = [
    req.body.email,
    req.body.username,
    req.body.password
  ];
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json(err)
    }
    return res.json(data);
  })
})

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM signup WHERE `email` = ? AND `password` = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json(err)
    }
    if (data.length > 0) {
      return res.json('success')
    } else {
      return res.json('failed')
    }
  })
})

app.post("/addToken", (req, res) => {
  const sql = "INSERT INTO token (`customerName`, `reportedDate`, `service`, `issue`, `priority`, `siteName`, `updatedDate`, `totalIssue`, `description`,`status` ) VALUES (?)";
  const values = [
    req.body.customerName,
    req.body.reportedDate,
    req.body.service,
    req.body.issue,
    req.body.priority,
    req.body.siteName,
    req.body.updatedDate,
    req.body.totalIssue,
    req.body.description,
    req.body.status
  ]
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json("Added to database")
    }
  })
})

app.get('/getTokenData', (req, res) => {
  const sql = 'SELECT * FROM token';
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data);
    }
  })
})

app.get('/getTokenData/edit/:id', (req, res) => {
  const sql = 'SELECT * FROM token WHERE ID = ?';
  const id = req.params.id;
  db.query(sql, id, (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data);
    }
  })
})

app.delete('/getTokenData/delete/:id', (req, res) => {
  const sql = 'DELETE FROM token WHERE ID = ?';
  const id = req.params.id;
  db.query(sql, id, (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json('success');
    }
  })
})

app.put('/getTokenData/edit/:id', (req, res) => {
  const sql = 'UPDATE token SET `customerName`= ?, `reportedDate` = ?, `service` = ?, `issue` = ?, `priority` = ?, `siteName` = ?, `updatedDate` = ?, `totalIssue` = ?, `description` = ?,`status` = ? WHERE ID = ?';
  const id = req.params.id;

  db.query(sql, [req.body.customerName,
  req.body.reportedDate,
  req.body.service,
  req.body.issue,
  req.body.priority,
  req.body.siteName,
  req.body.updatedDate,
  req.body.totalIssue,
  req.body.description,
  req.body.status,
    id], (err, data) => {
      if (err) {
        return res.json(err)
      } else {
        return res.json(data);
      }
    })
})

app.post('/addMailData', (req, res) => {
  const { serverName, emailAddress, userName, password } = req.body;
  // Check if the email address already exists
  const emailCheckQuery = "SELECT COUNT(*) AS emailCount FROM client_mail WHERE `emailAddress` = ?";
  db.query(emailCheckQuery, [emailAddress], (emailCheckErr, emailCheckResult) => {
    if (emailCheckErr) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const emailCount = emailCheckResult[0].emailCount;
    if (emailCount > 0) {
      return res.status(409).json({ error: 'Email address already exists' });
    } else {
      const insertQuery = "INSERT INTO client_mail (`serverName`,`emailAddress`,`userName`,`password`) VALUES (?)";
      const insertValues = [serverName, emailAddress, userName, password];
      db.query(insertQuery, [insertValues], (insertErr, insertResult) => {
        if (insertErr) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json({ success: 'Mail data added successfully', data: insertResult });
      });
    }
  });
});

app.get('/addMailData', (req, res) => {
  const sql = 'SELECT * FROM client_mail';
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data);
    }
  })
})

app.delete('/getMailData/delete/:id', (req, res) => {
  const sql = 'DELETE FROM client_mail WHERE ID = ?';
  const id = req.params.id;
  db.query(sql, id, (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json('success');
    }
  })
})

app.get('/getMailData/edit/:id', (req, res) => {
  const sql = 'SELECT * FROM client_mail WHERE ID = ?';
  const id = req.params.id;
  db.query(sql, id, (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data);
    }
  })
})

app.put('/getMailData/edit/:id', (req,res) => {
  const sql = 'UPDATE client_mail SET `serverName`= ?, `emailAddress` = ?, `userName` = ?, `password` = ? WHERE ID = ?';
  const id = req.params.id;
  db.query(sql, [req.body.serverName, req.body.emailAddress, req.body.userName, req.body.password, id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data);
    }
  })
})
