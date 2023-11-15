import userRoutes from './users.js';
import hotelRoutes from './hotels.js';

const configRoutes = (app) => {
	app.use('/users', userRoutes);
	app.use('/hotels', hotelRoutes);

	app.use('*', (req, res) => {
		return res.status(404).send({ error: 'Not found!' });
	});
};

export default configRoutes;
