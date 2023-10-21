import userRoutes from './users.js';

const configRoutes = (app) => {
	app.use('/users', userRoutes);

	app.use('*', (req, res) => {
		return res.status(404).send({ error: 'Not found!' });
	});
};

export default configRoutes;
