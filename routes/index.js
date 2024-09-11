const express = require('express');
const router = express.Router();

const secured = require("../middlewares/secured");
const avatarUpload = require('../middlewares/uploadAvatar');
const partyUpload = require('../middlewares/uploadPartyImage');
const candidateUpload = require('../middlewares/uploadCandidateImage');

const userController = require("../controllers/userController")
const voteController = require("../controllers/voteController")
const electionController = require("../controllers/electionController")
const candidateController = require("../controllers/candidateController")
const electionUserController = require("../controllers/electionUserController")
const reportController = require("../controllers/reportController")
const votingCenterController = require("../controllers/votingCenterController")

/* GET home page. */
router.get('/', secured(), userController.goto_dashboard);

router.get('/guest_login', userController.guest_login);

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

// routes used to login users
router.post("/loginUser", userController.login_user);

// routes used to get users
router.get("/get_users", userController.get_user_list);
router.post("/get_user", userController.get_user);
router.post("/add_user", avatarUpload.single('avatar'), userController.create_user);
router.post("/deactivate_user", userController.deactivate_user);
router.post("/update_user", avatarUpload.single('avatar'), userController.update_user);

router.get("/users", secured(), function(req, res, next){
  let userObj = req.session.user;
  res.render('users', {userObj})
})

// ELECTION RELATED ROUTES
router.get("/elections", secured(), function(req, res, next){
  let userObj = req.session.user;
  res.render('elections', {userObj})
})
router.get("/get_parties", electionController.get_party_list);
router.get("/get_parties_with_candidates", electionController.get_parties_with_candidates);
router.get("/get_party_list_for_province", electionController.get_party_list_for_province);
router.post("/add_party", partyUpload.single('image'), electionController.create_party);
router.post("/update_party", partyUpload.single('image'), electionController.update_party);
router.post("/delete_party", electionController.delete_party);
router.post("/get_party", electionController.get_party);

// CANDIDATE RELATED ROUTES
router.get("/get_candidates", candidateController.get_candidate_list);
router.post("/add_candidate", candidateUpload.single('image'), candidateController.create_candidate);
router.post("/update_candidate", candidateUpload.single('image'), candidateController.update_candidate);
router.post("/delete_candidate", candidateController.delete_candidate);
router.post("/get_candidate", candidateController.get_candidate);

router.get("/get_elections", electionController.get_election_list);
router.get("/get_election_summery", electionController.get_election_summery);
router.post("/add_election", electionController.create_election);
router.post("/get_election", electionController.get_election);
router.post("/update_election", electionController.update_election);
router.post("/delete_election", electionController.delete_election);


// ///////////election user mapping routes
router.get("/get_election_candidates", electionUserController.get_election_candidate_list);
router.get("/get_election_mapping_list", electionUserController.get_election_mapping_list);
router.post("/update_election_mapping", electionUserController.update_election_candidates);

router.post("/get_election_results", reportController.get_election_results);
router.post("/get_vote_list", reportController.get_vote_list);

router.get("/scan", secured(), function(req, res, next){
  let userObj = req.session.user;
  res.render('voting', {userObj})
})

router.get("/electionUser", secured(), function(req, res, next){
  let userObj = req.session.user;
  res.render('electionUser', {userObj})
})

router.get("/startvote", secured(), function(req, res, next){
  let userObj = req.session.user;
  res.render('votingPage', {userObj})
})

router.post("/check_fingerprint", voteController.check_fingerprint)
router.post("/get_election_candidates", voteController.get_election_candidates)
router.post("/store_vote", voteController.store_vote_data)

// ///////////election center routes
router.get("/get_voting_centers", votingCenterController.get_voting_center_list);
router.post("/add_voting_center", votingCenterController.create_voting_center);
router.post("/get_voting_center", votingCenterController.get_voting_center);
router.post("/update_voting_center", votingCenterController.update_voting_center);
router.post("/delete_voting_center", votingCenterController.delete_center);

router.get("/logout", userController.logoutUser)


module.exports = router;
