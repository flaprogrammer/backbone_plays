(function () {
	window.App = {
		Models: {},
		Views: {},
		Collections: {}
	};

	// Модель задачи
	App.Models.Task = Backbone.Model.extend({
		defaults: {
			text: 'Новая задача',
			completed: false
		},
		validate: function(attrs) {
			if(attrs.text.trim()=="") {
				return "Введите текст задачи!";
			}
		}
	});

	// Вид задачи
	App.Views.TaskView = Backbone.View.extend({
		tagName: 'tr',
		className: 'task',

		template: (function () {
			return _.template('<td class="js_text <% if(completed) print(\u0022completed\u0022) %>"><%=text%></td> <td><input type="checkbox"<% if(completed) print("checked") %> ></td> <td><button class="js_del">del</button></td>');
		}()),
		initialize: function () {
			this.model.on('invalid', function (model, error) {
				console.log('error');
			});
			this.model.on('destroy', this.removeThis, this);
		},
		render: function () {
			this.el.innerHTML = this.template(this.model.toJSON());
			return this;
		},
		events: {
			'click input[type="checkbox"]' : 'toggleCheckbox',
			'click .js_del' : 'deleteTask'
		},

		toggleCheckbox : function () {
			this.model.save('completed', !this.model.get('completed'));
			this.$el.find('.js_text').toggleClass('completed');
		},
		deleteTask : function () {
			this.model.destroy();
		},
		removeThis : function () {
			this.$el.remove();
		}
	});

	// Коллекция задач
	App.Collections.List = Backbone.Collection.extend({
		model: App.Models.Task,

		localStorage: new Backbone.LocalStorage("todos-backbone"),

		done: function () {
			return this.where({completed: true});
		},
		remainingNum: function() {
			return this.where({completed: false}).length;
		}
	});

	//Вид коллекции задач
	App.Views.ListView = Backbone.View.extend({
		tagName: 'table',
		className: 'list',
		initialize : function () {
			this.collection.on('add', this.onAdd, this);
			this.collection.fetch();
		},
		render: function () {
			this.collection.each(function (task) {
				/*добавляет элементы в список, fetch его дублирует
				var taskView = new App.Views.TaskView({model: task});
				this.$el.append(taskView.render().el);*/
			}, this);
			return this;
		},
		onAdd: function (task) {
			var taskView = new App.Views.TaskView({model:task});
			this.$el.append(taskView.render().el);
		}
	});

	App.Views.RemainingView = Backbone.View.extend({
		el: '.js_remaining',
		initialize: function() {
			this.onChangeRemaining();
			this.collection.on('remove add change', this.onChangeRemaining, this);
		},
		onChangeRemaining: function() {
			this.$el.find('span').html(this.collection.remainingNum());
		}
	});

	// Вид формы добавления
	App.Views.AddForm = Backbone.View.extend({
		el:'#addForm',
		initialize: function () {

		},
		events: {
			'submit': 'submit'
		},
		submit: function (e) {
			e.preventDefault();
			var taskText = $(e.currentTarget).find('.js_text').val();
			this.collection.create({text:taskText},{validate:true});
			$(e.currentTarget).find('.js_text').val('');
		}
	});


	App.Views.RemoveFinished = Backbone.View.extend({
		el: '.js_remove_finished',
		events: {
			'click' : 'click'
		},
		click: function (e) {
			_.invoke(this.collection.done(), 'destroy');
		}
	});

	var list = new App.Collections.List();
	var listView = new App.Views.ListView({collection: list});
	$('.tasks').prepend(listView.render().el);

	new App.Views.AddForm({collection: list});
	new App.Views.RemoveFinished({collection: list});
	new App.Views.RemainingView({collection: list});
	window.s = list;
}());