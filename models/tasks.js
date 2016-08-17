const mysql = require('mysql');

const pool = mysql.createPool(require('./config.js'));

module.exports = {
	list: (callback) => {
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err);
				return callback(err);
			}
			connection.query('SELECT * FROM list;', (err, rows) => {
				if (err) {
					console.log(err);
					return callback(err);
				}

				callback(null, rows);

				connection.release();
			});
		});
	},

	add: (task, priority, callback) => {
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err);
				return callback(err);
			}

			connection.query('INSERT INTO list SET ?;',{task: task, priority: priority}, (err, result) => {
				if (err) {
					console.log(err);
					return callback(err);
				}

				callback(null, result.insertId);

				connection.release();
			});
		});
	},

	change: (id, task, priority, callback) => {
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err);
				return callback(err);
			}

			connection.query('UPDATE list SET task = ?, priority = ?, completed = 0 WHERE id = ?;',[task, priority, id], (err, result) => {
				if (err) {
					console.log(err);
					return callback(err);
				}

				callback(null);

				connection.release();
			});
		});
	},

	complete: (id, callback) => {
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err);
				return callback(err);
			}

			connection.query('UPDATE list SET completed = 1 WHERE id = ?;',[id], (err, result) => {
				if (err) {
					console.log(err);
					return callback(err);
				}

				callback(null);

				connection.release();
			});
		});
	},
	
	delete: (id, callback) => {
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err);
				return callback(err);
			}

			connection.query('DELETE from list WHERE id = ?;',[id], (err, result) => {
				if (err) {
					console.log(err);
					return callback(err);
				}

				callback(null);

				connection.release();
			});
		});
	}
}