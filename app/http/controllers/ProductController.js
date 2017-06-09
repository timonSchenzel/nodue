module.exports = class ProductController extends Controller
{
	index()
	{
		let products = Product.all();

		let counter = null;

		let title = 'Products';
		let slogan = 'This is great!';

		return view('product.index', { shared: { products }, counter, title, slogan });
	}

	show(/*Product*/ product)
	{
		let title = 'Products';
		let slogan = 'This is great!';

		return view('product.show', { product, title, slogan });
	}

	create()
	{
		return view('product.create');
	}

	store()
	{
		let stmt = DB.prepare('INSERT INTO products VALUES (:name)');
		let request = Request.all();
		stmt.run({name: request.name});

		return this.index();
	}
}