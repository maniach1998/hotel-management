async function middlewareTwo(req, res, next) {
	// Middleware for GET /login route
	if (req.session.user) {
		if (req.session.user.role === 'hotel') {
			return res.redirect('/admin');
		} else {
			return res.redirect('/hotels');
		}
	} else {
		next();
	}
}

async function middlewareThree(req,res,next){

}

export {
	// middlewareOne,
	middlewareTwo,
	middlewareThree,
	// middlewareFour,
	// middlewareFive,
	// middlewareSix,
};
