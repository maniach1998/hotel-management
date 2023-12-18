import { Router } from "express";
const router = Router();

import { userData } from "../data/index.js";
import { checkCheckin } from "../helpers.js";
import { checkAuthorized } from "../middleware.js";
//import { userDataFunction } from "../data/index.js";

router.route("/").get(async (req, res) => {
	// only for time-being testing purposes
	// this method will be removed later
	try {
		const users = await userData.getAll();

		return res.send(users);
	} catch (e) {
		return res.status(500).send({ error: e.message });
	}
});

// router.route("/:userId").get(async (req, res) => {
// 	// TODO: get user profile using userId
// });

router.route("/hotels/userprofile").get(checkAuthorized, async (req, res) => {
	try {
		console.log("This is request", req);
		console.log("This is response", res);
		const userprofile = await userData.getProfile(User._id);
		return userprofile;
	} catch (e) {
		return res.status(500).send({ error: e.message });
	}
});

router
	.route("/update")
	.get(async (req, res) => {
		//Display update form
	})
	.patch(async (req, res) => {
		//Post a form with the updated changes in the user details
	});

export default router;
