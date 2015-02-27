(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};

	App.Models.Person = Backbone.Model.extend({
		defaults: {
			name: 'defaultName',
			age: 20,
			job: 'freelancer'
		},
		walking: function() {
			console.log(this.get('name') + ' is walking');
		}
	});

	App.Collections.People = Backbone.Collection.extend({
		model: App.Models.Person
	});

	App.Views.Person = Backbone.View.extend({
		tagName: 'li',
		template: _.template('<span><%=name%></span> (<%=age%>) - <%=job%> <button>Удалить</button>'),
		initialize: function() {
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},
		render: function() {
			this.el.innerHTML = this.template(this.model.toJSON());
			return this;
		},
		events: {
			'click span' : 'editPerson',
			'click button' : 'destroyPerson'
		},
		destroyPerson: function () {
			this.model.destroy();
		},
		editPerson: function () {
			var newText = prompt('Как переименуем?', this.model.get('name'));
			this.model.set('name', newText);
		},
		remove: function  () {
			this.$el.remove();
		}
	});

	App.Views.People = Backbone.View.extend({
		tagName: 'ul',
		initialize: function() {
			this.collection.on('add', this.onAdd, this);
		},
		render: function() {
			this.collection.each(function(person) {
				var personView = new App.Views.Person({model: person});
				this.el.appendChild(personView.render().el);
			}, this);
			return this;
		},
		onAdd: function (person) {
			var personView = new App.Views.Person({model: person});
			this.$el.append(personView.render().el);
		}
	});

	App.Views.AddPerson = Backbone.View.extend({
		el: '#addPerson',
		initialize: function () {

		},
		events: {
			'submit': 'submit'
		},
		submit: function (e) {
			e.preventDefault();
			var newName = $(e.currentTarget).find('.js_name').val();
			var newAge = $(e.currentTarget).find('.js_age').val();

			var newPerson = new App.Models.Person({name:newName, age: newAge});
			this.collection.add(newPerson);
		}
	});


	var peopCol = new App.Collections.People([
		{
			name: 'anton',
			age: 30
		},
		{
			name: 'vasili',
			job: 'slesarok'
		}
	]);
	var addPersView = new App.Views.AddPerson({ collection: peopCol });
	var peopView = new App.Views.People({collection: peopCol});
	$('.people').html(peopView.render().el);


})();
