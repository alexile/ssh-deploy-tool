/**
 * Group (one home) router
 */
const express = require('express');
const router = express.Router();

const models = require('require-all')({
	dirname: `${__dirname}/../models`
});

Object.keys(models).forEach((name) => {
	const model = models[name];

	console.log(`Adding REST model ${name}`);
	router
		.route(`/${name}s`)
		.post((req, res) => {
            if (name !== 'user') {
				return false;
			};
			const m = new model();
			model.find(req.body, (err, results) => {
				m.sameUser = results;
				Object.assign(m, req.body);
				m.save((err) => {
					if (err && !m.isExist) {
						res.json({error: {message: err.message, status: 1}});
					} else if (m.isExist) {
						req.session.user = {
							login: m.login,
							date: new Date(),
							teams: results[0].teams
						};
						res.json({[name]: req.session.user, message: 'You have successfully logged in'});
					} else {
						req.session.user = {
							login: m.login,
							date: new Date(),
							teams: []
						};
						res.json({[name]: req.session.user, message: 'This login is out of base: new user created and signed'});
					}
				})
			})
		})
	// .get((req, res) => {
	//   model.find((err, results) => {
	//     if (err) {
	//       res.json({error: err});
	//     } else {
	//       res.json({[name]: results});
	//     }
	//   })
	// });

	// router
	//   .route(`/${name}s/:_id`)
	//     .get((req, res) => {
	//       model.findById(req.params._id, (err, results) => {
	//         if (err) {
	//           res.json({error: err});
	//         } else {
	//           res.json({[name]: results})
	//         }
	//       })
	//     })
	//     .put((req, res) => {
	//       model.findById(req.params._id, (err, results) => {
	//         if (err) {
	//           res.json({error: err});
	//         } else {
	//           Object.assign(results, req.body);
	//           results.save(err => {
	//             if (err) {
	//               res.json({error: err});
	//             } else {
	//               res.json({[name]: results});
	//             }
	//           })
	//         }
	//       })
	//     })
	//     .delete((req, res) => {
	//       model.remove({_id: req.params._id}, (err) => {
	//         if (err) {
	//           res.json({error: err});
	//         } else {
	//           res.json({[name]: req.params._id});
	//         }
	//       })
	//     })

})

module.exports = router;
