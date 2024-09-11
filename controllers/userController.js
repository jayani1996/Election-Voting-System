const dbConn  = require('../services/dbConnection');
const CryptoJS = require("crypto-js");

exports.login_user = async function (req, res) {
    const { username, password} = req.body; // get the passed data from the front end
    console.log(password)

    dbConn.query('SELECT * FROM user WHERE username = "' + username + '"', function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'Invalid user'
            })
        } else {
            if(results.length > 0){
                // Decrypt
                var bytes  = CryptoJS.AES.decrypt(results[0].password, 'secret key 123');
                var originalText = bytes.toString(CryptoJS.enc.Utf8);

                if(originalText == password) {
                    req.session.user = results[0];
                    res.send({
                        error: false,
                        message: 'User valid',
                        data: results
                    })
                } else {
                    res.send({
                        error: true,
                        message: 'User invalid'
                    })
                }
            } else {
                res.send({
                    error: true,
                    message: 'User invalid'
                })
            }
        }
    });
}

exports.get_user_list = async function (req, res) {
    dbConn.query('SELECT * FROM user', function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No users'
            })
        } else {
            res.send({
                error: false,
                message: 'users valid',
                data: results
            })
        }
    });
}

exports.get_user = async function (req, res) {
    let userID = req.body.id
    dbConn.query('SELECT * FROM user WHERE id='+ userID , function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No user'
            })
        } else {
            if(results.length > 0){
                req.session.user = results[0];
                res.send({
                    error: false,
                    message: 'User valid',
                    data: results
                })
            } else {
                res.send({
                    error: true,
                    message: 'User ID invalid'
                })
            }
        }
    });
}

exports.create_user = async function (req, res) {
    let {name, username, password, type, province, uVcenter} = req.body;
    let image = "/images/avatars/" + req.file.filename;
    console.log(req.body)
    let user_data = {
        name,
        username,
        password,
        type,
        province,
        status: "active",
        uimage_url: image,
        uvoting_center: uVcenter
    }

    // insert query
    dbConn.query('INSERT INTO user SET ?', user_data, function(err, result) {
        //if(err) throw err
        if (err) {
            res.send({
                error: true,
                message: 'Invalid data'
            })
        } else {
            res.send({
                error: false,
                message: 'Success'
            });
        }
    })
}

exports.update_user = async function (req, res) {
    let {id, name, username, password, type, province, status, uvoting_center} = req.body;
    let query = 'UPDATE user SET name = "' + name + '", username = "' + username + '", province = "' + province + '", type = "' + type + '", status = "' + status + '",  uvoting_center = "' + uvoting_center + '"' ;
    if(password) {
        query += ', password = "' + password + '"'
    }
    if(req.file) {
        query += ', uimage_url = "' + '/images/avatars/' + req.file.filename + '"'
    }
    query += 'WHERE id = ' + id

    // update query
    dbConn.query(query, function(err, result) {
        //if(err) throw err
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'Invalid data'
            })
        } else {
            res.send({
                error: false,
                message: 'Success'
            });
        }
    })
}

exports.deactivate_user = async function (req, res) {
    let {userID} = req.body;
    dbConn.query('UPDATE user SET status = "inactive" WHERE id = ' + userID, function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No users'
            })
        } else {
            res.send({
                error: false,
                message: 'users updated',
                data: results
            })
        }
    });
}


exports.goto_dashboard = async function (req, res) {
    let userObj = req.session.user;
    if(userObj.type == 'admin') {
        res.render('index', {userObj})
    } else if(userObj.type == 'guest') {
        res.render('index', {userObj})
    } else {
        res.render('voting', {userObj})
    }
}

exports.guest_login = async function (req, res) {
    req.session.user = {
        type: "guest",
        name: "Guest"
    };
    let userObj = req.session.user;
    res.render('index', {userObj})
}

exports.logoutUser = async function (req, res) {
    req.session.destroy();
    res.redirect('/');
}
