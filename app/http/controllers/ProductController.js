module.exports = class PagesController extends Controller
{
	async index()
	{
		let products = await Product.all();

		let counter = null;

		let title = 'Products';
		let slogan = 'This is great!';

		return view('product.index', { products, counter, title, slogan });
	}

	async show(id)
	{
		let product = await Product.find(id);

		let title = 'Products';
		let slogan = 'This is great!';

		return view('product.show', { product, title, slogan });
	}
}