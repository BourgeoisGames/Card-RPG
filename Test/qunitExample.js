$.holdReady(true);

window.onload = function() {
    console.log("hi");
	QUnit.test( "Test Case One", function( assert ) {
        // code
        console.log("test one");
        assert.equal(2+2, 4, "test addition");
	});
	QUnit.test( "Test Case Two", function( assert ) {
        // code
        console.log("test two");
        assert.equal(2-2, 0, "test subtraction");
	});
    console.log("test done");
}
