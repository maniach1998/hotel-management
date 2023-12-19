async function checkForAuthRoutes(req, res, next) {
	// Middleware for GET /login, /register route
	if (req.session.user) {
		if (req.session.user.accountType === 'hotel') {
			return res.redirect('/manage');
		} else {
			return res.redirect('/hotels');
		}
	} else {
		next();
	}
}

async function checkAuthorized(req, res, next) {
	// Check the session
	if (!req.session.user) {
		// unauthorized user
		return res.redirect('/login');
	} else {
		// falls through if user is authorized
		req.user = req.session.user;
		next();
	}	
}

async function checkManager(req, res, next) {
	// Check the session
	if (req.session.user) {
		if (req.session.user.accountType === 'hotel') {
			next();
		} else {
			req.session.error = { code: 403, message: 'Forbidden, cannot access this page!' };
			return res.redirect('/error');
		}
	} else {
		return res.redirect('/login');
	}
}

export { checkForAuthRoutes, checkAuthorized, checkManager };
