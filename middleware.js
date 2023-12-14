async function checkForAuthRoutes(req, res, next) {
	// Middleware for GET /login, /register route
	if (req.session.user) {
		if (req.session.user.role === "hotel") {
			return res.redirect("/manage");
		} else {
			return res.redirect("/hotels");
		}
	} else {
		next();
	}
}

async function checkAuthorized(req, res, next) {
	// Check the session
	if (!req.session.user) {
		// unauthorized user
		return res.redirect("/login");
	} else {
		// falls through if user is authorized
		next();
	}
}

export { checkForAuthRoutes, checkAuthorized };
