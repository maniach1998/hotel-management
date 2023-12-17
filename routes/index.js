import homeRoutes from './home.js';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import managerRoutes from './manage.js';
import hotelRoutes from './hotels.js';
import reviewRoutes from './reviews.js';
import bookingRoutes from './bookings.js';

const configRoutes = (app) => {
	app.use('/', homeRoutes);
	app.use('/', authRoutes);
	app.use('/users', userRoutes);
	app.use('/manage', managerRoutes);
	app.use('/hotels', hotelRoutes);
	app.use('/hotels', reviewRoutes);
	app.use('/bookings', bookingRoutes);

	app.use('*', (req, res) => {
		return res.status(404).send({ error: 'Not found!' });
	});
};

export default configRoutes;
