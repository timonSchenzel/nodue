module.exports = class Bootstrap
{
	/**
	 * The bootstrap tasks for Nodue.
	 */
	get tasks()
	{
		return [
			'loadSugarModule',
			'bootSupport',
			'loadPretty',
			'loadPluralizeModule',
			'loadEnvFile',
			'loadNodueFiles',
			'loadCoreHelpers',
			'loadPathModule',
			'loadConfigFiles',
			'loadChokidarModule',
			'initDatabaseConnection',
			'autoload',
			'loadHelpers',
			'runServiceProviders',
			'setupInstances',
			'setupReferences',
			'loadModels',
			'loadRoutes',
			'loadVue',
			'loadVueServerRenderer',
			'startLayoutCompilerWatcherIfNeeded',
			'startHotReloadIfNeeded',
		];
	}

	loadSugarModule()
	{
		global.Sugar = require('sugar');
	}

	bootSupport()
	{
		global.array = Sugar.Array;
		global.date = Sugar.Date;
		global.number = Sugar.Number;
		global.object = Sugar.Object;
		global.string = Sugar.String;

		// Load the Obj flattern method
		app.fileLoader.load('Nodue/src/Support/object/flattern.js');

		let support = object(app.fileLoader.loadFrom('Nodue/src/Support'));

		support.flattern().forEach((file, path) => {
			if (path != 'object/flattern') {
				app.fileLoader.load(`Nodue/src/Support/${path}.js`);
			}
		});
	}

	loadPretty()
	{
		global.pretty = require('js-object-pretty-print').pretty;
	}

	loadPluralizeModule()
	{
		global.pluralize = require('pluralize')
	}

	loadEnvFile()
	{
		require('dotenv').config();
	}

	loadNodueFiles()
	{
		global.Nodue = app.fileLoader.loadFrom('Nodue/src');
	}

	loadCoreHelpers()
	{
		let helpers = Nodue.App.Helpers;
		app.loadHelpersFrom(helpers);
	}

	loadPathModule()
	{
		global.path = require('path');
	}

	loadConfigFiles()
	{
		app.resetConfig();

		let configFiles = app.fileLoader.loadFrom('./config');

		for (let configFile in configFiles) {
			app.registerConfig(configFile, configFiles[configFile]);
		}
	}

	loadChokidarModule()
	{
		global.chokidar = require('chokidar');
	}

	initDatabaseConnection()
	{
		let dbLoader = require('../Database/Database').init();

		global.db = require('knex')(dbLoader.settings());

		global.Bookshelf = require('bookshelf')(db);
	}

	autoload()
	{
		for (let alias in app.config().autoload) {
			global[alias] = app.fileLoader.loadFrom(app.config().autoload[alias]);
		}
	}

	loadHelpers()
	{
		app.config().helpers.forEach(helper => {
			app.loadHelpersFrom(helper);
		});
	}

	runServiceProviders()
	{
		app.config().providers.forEach(provider => {
			app.make(provider).register(app);
		});
	}

	setupInstances()
	{
		for (let alias in app.config().instances) {
			global[alias] = app.make(app.config().instances[alias]);
		}
	}

	setupReferences()
	{
		for (let alias in app.config().references) {
			global[alias] = app.resolve(app.config().references[alias]);
		}
	}

	loadModels()
	{
		for (let model in AppFiles.models) {
			let modelInstance = app.make(`models.${model}`);
			global[model] = new Proxy(modelInstance, Nodue.ORM.Proxy);
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

	startLayoutCompilerWatcherIfNeeded()
	{
		if (! process.argv.includes('dev')) {
			return;
		}

		AssetsCompiler.watchChanges();
	}

	startHotReloadIfNeeded()
	{
		if (! process.argv.includes('hot')) {
			return;
		}

		app.hot = true;

		for (let endpoint in route.getEndpoints()) {
			hotReload.inspectEndpoint(endpoint);
		};

		hotReload.start();
	}
}