module.exports = class Request
{
	constructor()
	{
		this.incommingRequest = [];
		this.url = null;
	}

	track(incommingRequest)
	{
		if (incommingRequest.url == null) {
			incommingRequest.url = '/';
		}

		this.incommingRequest = incommingRequest;
		this.url = this.incommingRequest.url;

		if (! this.url.startsWith('/')) {
			this.url = '/' + this.url;
		}
	}

	capture(expression)
	{
		if (! expression) {
			return '404';
		}

		if(typeof expression == 'function') {
			return expression();
		}

		if(typeof expression == 'string') {
			return this.handle(expression);
		}
	}

	handle(expression)
	{
		let controllerName = this.findControllerName(expression);
		let controllerFunctionName = this.findControllerFunctionName(expression);

		let controller = app.loadController(controllerName);
		
		return controller[controllerFunctionName]();
	}

	findControllerName(expression)
	{
		let parts = this.parse(expression);

		return parts[0];
	}

	findControllerFunctionName(expression)
	{
		let parts = this.parse(expression);

		return parts[1];
	}

	parse(expression)
	{
		return expression.split('@');
	}
}