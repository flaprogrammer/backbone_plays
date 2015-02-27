(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {},
		Router: {}
	};

	window.template = function (id) {
		return _.template($('#'+id).html());
	};

	App.Router = Backbone.Router.extend({
		routes: {
			'' : 'index',
			'page/:id/*simbo': 'read',
			'*other' : 'default'
		},
		index: function () {
			console.log('Hellow index!');
		},
		read: function (id, simbo) {
			console.log('This is read router '+id);
			console.log(simbo);
		},
		default: function () {
			console.log('Error page');
		}
	});

	new App.Router();
	Backbone.history.start();
}());