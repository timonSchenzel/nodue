module.exports = class BuilderTest extends TestCase
{
	/** @test */
	building_an_object_with_type_hinted_dependencies()
	{
		global.Foo = Foo;
		global.Bar = Bar;
		global.Baz = Baz;

		let foo = ObjectBuilder.build(Foo);

		this.assertEquals(2, foo.number);
		this.assertEquals(new Foo(new Bar(new Baz)), foo);
		this.assertEquals(new Bar(new Baz), foo.bar);
		this.assertEquals(new Baz, foo.bar.baz);

		this.assertEquals('foo', foo.say());
		this.assertEquals('bar', foo.bar.say());
		this.assertEquals('baz', foo.bar.baz.say());
	}
}

class Foo
{
	constructor(/*Bar*/ bar, number = 2)
	{
		this.bar = bar;
		this.number = number;
	}

	say()
	{
		return 'foo';
	}
}

class Bar
{
	constructor(/*Baz*/ baz)
	{
		this.baz = baz;
	}

	say()
	{
		return 'bar';
	}
}

class Baz
{
	say()
	{
		return 'baz';
	}
}
