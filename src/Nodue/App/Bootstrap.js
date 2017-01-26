module.exports = class Bootstrap
{
	/**
	 * The bootstrap tasks for Nodue.
	 */
	get tasks()
	{
		return [
			'loadFsModule',
			'loadEnvFile',
			'loadNodueFiles',
			'loadCoreHelpers',
			'loadAppConfig',
			'loadPathModule',
			'loadChokidarModule',
			'initDatabaseConnection',
			'autoload',
			'loadHelpers',
			'setupInstances',
			'setupReferences',
			'loadRoutes',
			'loadVue',
			'loadVueServerRenderer',
			'startHotReload',
		];
	}

	loadFsModule()
	{
		global.fs = require('fs');
	}

	loadEnvFile()
	{
		require('dotenv').config();
	}

	loadNodueFiles()
	{
		global.Nodue = app.fileLoader.loadFrom('src/Nodue');
	}

	loadCoreHelpers()
	{
		let helpers = Nodue.App.Helpers;
		app.loadHelpersFrom(helpers);
	}

	loadAppConfig()
	{
		app.config = app.getConfig('app');
	}

	loadPathModule()
	{
		global.path = require('path');
	}

	loadChokidarModule()
	{
		global.chokidar = require('chokidar');
	}

	initDatabaseConnection()
	{
		let databaseConfig = app.getConfig('database');
		let defaultConfig = databaseConfig['connections'][databaseConfig['default']];

		global.Knex = require('knex')({
			client: defaultConfig['driver'],
			connection: {
				host: defaultConfig['host'],
				user: defaultConfig['user'],
				password: defaultConfig['password'],
				database: defaultConfig['database'],
				charset: defaultConfig['charset'],
			}
		});

		global.Bookshelf = require('bookshelf')(Knex);
	}

	autoload()
	{
		for (let alias in app.config.autoload) {
			global[alias] = app.fileLoader.loadFrom(app.config.autoload[alias]);
		}
	}

	loadHelpers()
	{
		app.config.helpers.forEach(helper => {
			app.loadHelpersFrom(helper);
		});
	}

	setupInstances()
	{
		for (let alias in app.config.instances) {
			global[alias] = app.make(app.config.instances[alias]);
		}
	}

	setupReferences()
	{
		for (let alias in app.config.references) {
			global[alias] = app.resolve(app.config.references[alias]);
		}
	}

	loadRoutes()
	{
		app.fileLoader.load('routes.js');
	}

	loadVue()
	{
		global.Vue = require('vue');
	}

	loadVueServerRenderer()
	{
		global.VueRenderer = require('vue-server-renderer').createRenderer();
	}

	startHotReload()
	{
		if (! process.argv.includes('hot')) {
			return;
		}

		app.hot = true;

		for (let endpoint in route.getEndpoints()) {
			// Inpect url and check files to watch
			hotReload.inspectEndpoint(endpoint);
		};

		hotReload.start();
	}
}