var steptoe 	= require('steptoe');
var T			= require('steptoe/types');

var SRC = "" +
	"function test(a, b, c) {\n" +
	"    var x;\n" +
	"    var y;\n" +
	"    var z;\n" +
	"    function f1() {\n" +
	"       return -x + y;\n" +
	"    }\n" +
	"    while (true) {\n" +
	"        x = x + y + z;\n" +
	"    }\n" +
	"}\n";

function createElementForAstNode(node) {

	var $builders = {};
	
	$builders[T.ARRAY_LITERAL] = function(node) {

		var el = $('<span class="array-literal">[<span class="i-elements"></span>]</span>');
		var els = el.find('.i-elements');

		node.getValues().forEach(function(exp, ix) {
			if (ix > 0) {
				els.append(document.createTextNode(', '));
			}
		});

		return el;

	}

    $builders[T.ASSIGN_EXP] = function(node) {
    	return createBinOp(node, 'assign-exp', '=');
	}

    $builders[T.BIN_OP_EXP] = function(node) {
    	return createBinOp(node, 'bin-op-exp', node.getOp());
    }

    $builders[T.CALL_EXP] = function(node) {

    	var el = $('<span class="call-exp"><span class="i-callee"></span>(<span class="i-args"></span>)</span>');
    	var callee = el.find('.i-callee');
    	var args = el.find('.i-args');

		callee.append(create(node.getCallee()));

		node.getArguments().forEach(function(exp, ix) {
    		if (ix > 0) {
    			args.append(document.createTextNode(', '));
    		}
    		args.append(create(exp));
    	});

    	return el;

	}
    
    $builders[T.COMPUTED_MEMBER_EXP] = function(node) {

    	var el = $('<span class="computed-member-exp"><span class="i-object"></span>[<span class="property"></span>]</span');

    	var obj = el.find('.i-object');
    	var prop = el.find('.i-property');

    	obj.append(create(node.getObject()));
    	prop.append(create(node.getProperty()));

    	return el;

    };
    
    $builders[T.FUNCTION_DEF] = function(node) {
    	
    	var el = $('<div class="function-def"></div>');

    	var hdr = $('<div class="i-header">function <span class="i-name"></span>(<span class="i-params"></span>) {</div>');

    	hdr.find('.i-name').text(node.getName());

    	var ps = hdr.find('.i-params');
    	node.getParams().forEach(function(p, ix) {
    		if (ix > 0) {
    			ps.append(document.createTextNode(', '));
    		}
    		ps.append($('<span class="i-param"/>').text(p));
    	});

		el.append(hdr);

		var bdy = $('<div class="i-body"></div>');

    	bdy.append(create(node.getVariables()));
    	bdy.append(create(node.getInnerFunctions()));
    	bdy.append(create(node.getBody()));

    	el.append(bdy);
    	el.append(document.createTextNode('}'));

    	return el;

    }
    
    $builders[T.FUNCTION_INSTANCE] = function() {
    	throw new Error("can't render function instance!");
    }

    $builders[T.FUNCTIONS] = function(node) {
    	var el = $('<div class="functions"></div>');
    	node.getFunctions().forEach(function(fun) {
    		el.append(create(fun));
    	});
    	return el;
    }
    
    $builders[T.IDENT] = function(node) {
    	return $('<span class="ident"/>').text(node.getName());
    }
    
    $builders[T.IF_STMT] = defaultNode;
    
    $builders[T.LOGICAL_AND_EXP] = function(node) {
    	return createBinOp(node, 'logical-and-exp', '&&');
    }
    
    $builders[T.LOGICAL_OR_EXP] = function(node) {
    	return createBinOp(node, 'logical-or-exp', '||');
    }
    
    $builders[T.OBJECT_LITERAL] = function(node) {

    	var el = $('<span class="object-literal">{<span class="i-pairs"></span>}</span>');
    	var pairs = el.find('.i-pairs');
    	var keys = node.getKeys();
    	var vals = node.getValues();

    	keys.forEach(function(kExp, ix) {
    		if (ix > 0) {
    			pairs.append(document.createTextNode(', '));
    		}
    		var pair = $('<span class="i-pair"><span class="i-key"></span>: <span class="i-value"></span></span>');
    		var k = pair.find('.i-key');
    		var v = pair.find('.i-value');
    		k.append(create(kExp));
    		k.append(create(vals[ix]));
    		pairs.append(pair);
    	});

    	return el;

    }

    $builders[T.PRIMITIVE_LITERAL] = function(node) {
    	var el = $('<span class="primitive-literal"></span>');
    	el.addClass('t-' + (typeof node.getValue()));
    	el.text(JSON.stringify(node.getValue()));
    	return el;
    }
    
    $builders[T.RETURN_STMT] = function(node) {
    	var el = $('<div class="return-stmt">return <span class="i-return-value"></span></div>');
    	el.find('.i-return-value').append(create(node.getReturnValue()));
    	return el;
    }
    
    $builders[T.STATEMENTS] = function(node) {
    	var el = $('<div class="statements"></div>');
    	node.getStatements().forEach(function(stmt, ix) {
    		if (stmt.type === T.RETURN_STMT && stmt.implied) {
    			// do nothing
    		} else {
    			el.append(create(stmt));	
    		}
    	});
    	return el;
    }

    $builders[T.STATIC_MEMBER_EXP] = function(node) {
    	// var el = $('<div class="static-member-exp"></div>')
    }

    $builders[T.UNARY_OP_EXP] = function(node) {
    	var el = $('<span class="unary-op-exp"><span class="i-op"></span><span class="i-exp"></span></span>');
    	el.find('.i-op').text(node.getOp());
    	el.find('.i-exp').append(create(node.getExp()));
    	return el;
    }
    
    $builders[T.VARIABLES] = function(node) {

    }
    
    $builders[T.WHILE_STMT] = function(node) {
    	var el = $('<div class="while-stmt">while (<span class="i-condition"></span>) {<div class="i-body"></div>}</div>');
    	var cond = el.find('.i-condition');
    	var body = el.find('.i-body');
    	cond.append(create(node.getCondition()));
    	body.append(create(node.getBody()));
    	return el;
    }

	function defaultNode() {
		var el = document.createElement('div');
		el.textContent = 'not-implemented';
		return el;
	}

	function createBinOp(node, className, opSym) {

		var el = $('<span class="' + className + '">(<span class="i-lhs"></span> <span class="i-op"></span> <span class="i-rhs"></span>)</span>');

		var lhs = el.find('.i-lhs'),
			op  = el.find('.i-op'),
			rhs = el.find('.i-rhs');
			
		lhs.append(create(node.getLeft()));
		op.text(opSym);
		rhs.append(create(node.getRight()));

		return el;

	}
	
	function create(node) {
		var builder = $builders[node.type];
		if (!builder) {
			throw new Error("Unknown node type: " + node.type);
		} else {
			return builder(node);
		}
	}

	return create(node);

}

window.init = function() {

	var parsed = steptoe.parseFunction(SRC);

	document.body.appendChild(createElementForAstNode(parsed)[0]);

}