(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"steptoe":2,"steptoe/types":33}],2:[function(require,module,exports){
var parser = require('./lib/parser');
var Env = require('./lib/Env');
var FunctionDef = require('./lib/runtime/FunctionDef');

function createEnv() {
	return new Env();
}

function createFunction() {
	return new FunctionDef();
}

function parseProgram(src) {
    return parser.parse(src, {startRule: 'Program'});
}

function parseFunction(src) {
    return parser.parse(src, {startRule: 'FunctionDef'});
}

module.exports = {
    Machine         : require('./lib/Machine'),
    SyntaxError     : parser.SyntaxError,

    createEnv 		: createEnv,
    createFunction	: createFunction,

    parseProgram    : parseProgram,
    parseFunction   : parseFunction
};

},{"./lib/Env":3,"./lib/Machine":4,"./lib/parser":5,"./lib/runtime/FunctionDef":11}],3:[function(require,module,exports){
var Env = module.exports = function(parent) {
	this._parent = parent || null;
	this._env = {};
}

Env.prototype.on = function(evt, callback) {
	var ahs = this._handlers ? this._handlers : (this._handlers = {});
	var ehs = ahs[evt] ? ahs[evt] : (ahs[evt] = []);

	ehs.push(callback);

	var removed = false;
	return function() {
		if (removed) return;
		ehs.splice(ehs.indexOf(callback), 1);
	}
}

Env.prototype.emit = function(evt) {
	if (!this._handlers) return;
	var ehs = this._handlers[evt];
	if (!ehs) return;
	var args = Array.prototype.slice.call(arguments, 1);
	ehs.forEach(function(eh) { eh.apply(null, args); });
}

Env.prototype.beget = function() {
	return new Env(this);
}

Env.prototype.begetFrame = function(params, values) {
	var child = this.beget();
	for (var i = 0, l = params.length; i < l; ++i) {
		child._env[params[i]] = values[i];
	}
	return child;
}

Env.prototype.find = function(key) {
	if (key in this._env) {
		return this;
	} else if (this._parent) {
		return this._parent.find(key);
	} else {
		throw new Error("unknown key: " + key);
	}
}

Env.prototype.has = function(key) {
	return key in this._env;
}

Env.prototype.get = function(key) {
	return this.find(key)._env[key];
}

Env.prototype.set = function(key, value) {
	this.find(key)._env[key] = value;
	this.emit('set', this, key, value);
}

Env.prototype.def = function(key, value) {
	if (key in this._env) {
		throw new Error("duplicate key: " + key);
	} else {
		this._env[key] = value;
		this.emit('define', this, key, value);
	}
}

Env.prototype.undef = function(key) {
	if (!(key in this._env)) {
		throw new Error("unknown key: " + key);
	} else {
		var val = this._env[key];
		delete this._env[key];
		this.emit('undefine', this, key, val);
	}
}

},{}],4:[function(require,module,exports){
var A = require('./runtime'),
    T = require('./runtime/types');

var Machine = module.exports = function() {};

Machine.prototype = {
    get node() {
        return this.nodes[this.nodes.length-1];
    },

    get env() {
        return this.stack[this.stack.length-1];
    },

    isTruthy: function(val) {
        return !!val;
    }
}

Machine.prototype.restart = function(env, main) {

    // to restart the VM we need to set up a call to the main function

    // let's start with reinitialising everything
    this.nodes = [];        // stack of active AST nodes
    this.frames = [];       // stack of active AST node state
    this.stack = [];        // lexical environments
    this.retVal = null;     // return value from last frame

    // now set up the call and bodge it so it jumps straight to the
    // return step on re-entrance
    var callToMain = new A.CallExp();
    var callToMainFrame = callToMain.newFrame();
    callToMainFrame.ix = 4;

    this.nodes.push(callToMain);
    this.frames.push(callToMainFrame);

    // that's the call set up; next we need to set up the function
    // instance.

    var mainInstance;
    if (main instanceof A.FunctionDef) {
        mainInstance = new A.FunctionInstance(main, env);
    } else if (main instanceof A.FunctionInstance) {
        mainInstance = main;
    } else {
        throw new Error("main must be either FunctionDef or FunctionInstance");
    }

    var mainInstanceFrame = mainInstance.newFrame();

    this.nodes.push(mainInstance);
    this.frames.push(mainInstanceFrame);

    // finally, set up the environment for the main function.
    // to do this we create a new env with the root env as a parent
    // to prevent the root env from being clobbered.

    this.rootEnv = env;
    this.mainEnv = env.beget();

    this.stack = [this.mainEnv];

}

Machine.prototype.isRunning = function() {
    return this.nodes.length > 0;
}

Machine.prototype.ret = function(val) {
    this.nodes.pop();
    this.frames.pop();
    this.retVal = val;
}

// unwind VM stack until we hit the closest function call
Machine.prototype.returnFromFunction = function(val) {
    while (this.nodes[this.nodes.length-1].type !== T.CALL_EXP) {
        this.nodes.pop();
        this.frames.pop();
    }
    this.stack.pop();
    this.retVal = val;
}

Machine.prototype.evaluate = function(node) {
    this.frames.push(node.newFrame());
    this.nodes.push(node);
}

Machine.prototype.pushEnv = function(env) {
    this.stack.push(env);
}

Machine.prototype.step = function() {
    this.nodes[this.nodes.length-1].step(
        this.frames[this.frames.length-1],
        this.env,
        this
    );
}

},{"./runtime":26,"./runtime/types":27}],5:[function(require,module,exports){
module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { Program: peg$parseProgram, FunctionDef: peg$parseFunctionDef },
        peg$startRuleFunction  = peg$parseProgram,

        peg$c0 = [],
        peg$c1 = /^[ \t\r\n]/,
        peg$c2 = { type: "class", value: "[ \\t\\r\\n]", description: "[ \\t\\r\\n]" },
        peg$c3 = /^[a-zA-Z_]/,
        peg$c4 = { type: "class", value: "[a-zA-Z_]", description: "[a-zA-Z_]" },
        peg$c5 = /^[a-zA-Z0-9_]/,
        peg$c6 = { type: "class", value: "[a-zA-Z0-9_]", description: "[a-zA-Z0-9_]" },
        peg$c7 = peg$FAILED,
        peg$c8 = "'",
        peg$c9 = { type: "literal", value: "'", description: "\"'\"" },
        peg$c10 = function(chars) { return chars.join(''); },
        peg$c11 = "\"",
        peg$c12 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c13 = void 0,
        peg$c14 = /^['\\]/,
        peg$c15 = { type: "class", value: "['\\\\]", description: "['\\\\]" },
        peg$c16 = { type: "any", description: "any character" },
        peg$c17 = /^["\\]/,
        peg$c18 = { type: "class", value: "[\"\\\\]", description: "[\"\\\\]" },
        peg$c19 = "\\n",
        peg$c20 = { type: "literal", value: "\\n", description: "\"\\\\n\"" },
        peg$c21 = function() { return "\n"; },
        peg$c22 = "\\r",
        peg$c23 = { type: "literal", value: "\\r", description: "\"\\\\r\"" },
        peg$c24 = function() { return "\r"; },
        peg$c25 = "\\t",
        peg$c26 = { type: "literal", value: "\\t", description: "\"\\\\t\"" },
        peg$c27 = function() { return "\t"; },
        peg$c28 = "\\'",
        peg$c29 = { type: "literal", value: "\\'", description: "\"\\\\'\"" },
        peg$c30 = function() { return "'"; },
        peg$c31 = "\\\"",
        peg$c32 = { type: "literal", value: "\\\"", description: "\"\\\\\\\"\"" },
        peg$c33 = function() { return '"'; },
        peg$c34 = "\\\\",
        peg$c35 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c36 = function() { return "\\"; },
        peg$c37 = /^[0-9]/,
        peg$c38 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c39 = ".",
        peg$c40 = { type: "literal", value: ".", description: "\".\"" },
        peg$c41 = /^[1-9]/,
        peg$c42 = { type: "class", value: "[1-9]", description: "[1-9]" },
        peg$c43 = "break",
        peg$c44 = { type: "literal", value: "break", description: "\"break\"" },
        peg$c45 = "continue",
        peg$c46 = { type: "literal", value: "continue", description: "\"continue\"" },
        peg$c47 = "else",
        peg$c48 = { type: "literal", value: "else", description: "\"else\"" },
        peg$c49 = "false",
        peg$c50 = { type: "literal", value: "false", description: "\"false\"" },
        peg$c51 = "function",
        peg$c52 = { type: "literal", value: "function", description: "\"function\"" },
        peg$c53 = "if",
        peg$c54 = { type: "literal", value: "if", description: "\"if\"" },
        peg$c55 = "null",
        peg$c56 = { type: "literal", value: "null", description: "\"null\"" },
        peg$c57 = "return",
        peg$c58 = { type: "literal", value: "return", description: "\"return\"" },
        peg$c59 = "true",
        peg$c60 = { type: "literal", value: "true", description: "\"true\"" },
        peg$c61 = "var",
        peg$c62 = { type: "literal", value: "var", description: "\"var\"" },
        peg$c63 = "while",
        peg$c64 = { type: "literal", value: "while", description: "\"while\"" },
        peg$c65 = ";",
        peg$c66 = { type: "literal", value: ";", description: "\";\"" },
        peg$c67 = function(fns) {
                return fns;
            },
        peg$c68 = function(name, params, inner) {
                var fndef = new A.FunctionDef();
                fndef.setName(name);
                fndef.setParams(params);
                fndef.setInnerFunctions(inner.innerFunctions);
                fndef.setVariables(inner.variables);
                fndef.setBody(inner.body);
                return fndef;
            },
        peg$c69 = "(",
        peg$c70 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c71 = ")",
        peg$c72 = { type: "literal", value: ")", description: "\")\"" },
        peg$c73 = function(params) {
                return params;
            },
        peg$c74 = function() {
                return [];
            },
        peg$c75 = ",",
        peg$c76 = { type: "literal", value: ",", description: "\",\"" },
        peg$c77 = function(head, rest) {
                return [head].concat(rest.map(function(r) {
                    return r[2];
                }));
            },
        peg$c78 = "{",
        peg$c79 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c80 = "}",
        peg$c81 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c82 = function(vars, fns, body) {
                body.addFinalReturnStatement();
                return {
                    variables       : vars,
                    innerFunctions  : fns,
                    body            : body
                };
            },
        peg$c83 = function(vds) {
                var variables = new A.Variables();
                vds.forEach(function(vd) {
                    variables.addVariable(vd.name, vd.initialValue);
                });
                return variables;
            },
        peg$c84 = "=",
        peg$c85 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c86 = function(name, initialValue) {
                return { name: name, initialValue: initialValue };
            },
        peg$c87 = function(name) {
                return { name: name };
            },
        peg$c88 = function(fns) {
                var functions = new A.Functions();
                fns.forEach(function(fn) {
                    functions.addFunction(fn);
                })
                return functions;
            },
        peg$c89 = function(all) {
                var stmts = new A.Statements();
                all.forEach(function(s) { stmts.addStatement(s); });
                return stmts;
            },
        peg$c90 = function(cond, body) {
                var stmt = new A.WhileStmt();
                stmt.setCondition(cond);
                stmt.setBody(body);
                return stmt;
            },
        peg$c91 = null,
        peg$c92 = function(i, eis, e) {
                var stmt = new A.IfStmt();
                stmt.addClause(i.condition, i.body);
                eis.forEach(function(c) { stmt.addClause(c.condition, c.body); });
                if (e) stmt.addClause(e.condition, e.body);
                return stmt;
            },
        peg$c93 = function(exp, body) {
                return { condition: exp, body: body };
            },
        peg$c94 = function(body) {
                return { condition: null, body: body };
            },
        peg$c95 = function(stmts) {
                return stmts;
            },
        peg$c96 = function(exp) {
                var stmt = new A.ReturnStmt();
                stmt.setReturnValue(exp);
                return stmt;
            },
        peg$c97 = function() {
                var stmt = new A.ReturnStmt();
                return stmt;
            },
        peg$c98 = function(exp) { return exp; },
        peg$c99 = "[",
        peg$c100 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c101 = "]",
        peg$c102 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c103 = function(exps) {
                var ary = new A.ArrayLiteral();
                exps.forEach(function(e) { ary.addExpression(e); });
                return ary;
            },
        peg$c104 = function() {
                return new A.ArrayLiteral();
            },
        peg$c105 = function(head, rest) {
                return [head].concat(rest.map(function(r) { return r[2]; }));
            },
        peg$c106 = function(pairs) {
                var obj = new A.ObjectLiteral();
                pairs.forEach(function(p) {
                    obj.addPair(p.key, p.value);
                });
                return obj;
            },
        peg$c107 = function() {
                return new A.ObjectLiteral();
            },
        peg$c108 = ":",
        peg$c109 = { type: "literal", value: ":", description: "\":\"" },
        peg$c110 = function(key, value) {
                return { key: key, value: value };
            },
        peg$c111 = function(str) { return new A.PrimitiveLiteral(str); },
        peg$c112 = function(value) { return new A.PrimitiveLiteral(parseFloat(value)); },
        peg$c113 = function(value) { return new A.PrimitiveLiteral(parseInt(value, 10)); },
        peg$c114 = function() { return new A.PrimitiveLiteral(true); },
        peg$c115 = function() { return new A.PrimitiveLiteral(false); },
        peg$c116 = function() { return new A.PrimitiveLiteral(null); },
        peg$c117 = function(ident) { return new A.Ident(ident); },
        peg$c118 = "+",
        peg$c119 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c120 = "-",
        peg$c121 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c122 = "~",
        peg$c123 = { type: "literal", value: "~", description: "\"~\"" },
        peg$c124 = "!",
        peg$c125 = { type: "literal", value: "!", description: "\"!\"" },
        peg$c126 = "*",
        peg$c127 = { type: "literal", value: "*", description: "\"*\"" },
        peg$c128 = "/",
        peg$c129 = { type: "literal", value: "/", description: "\"/\"" },
        peg$c130 = "%",
        peg$c131 = { type: "literal", value: "%", description: "\"%\"" },
        peg$c132 = "<<",
        peg$c133 = { type: "literal", value: "<<", description: "\"<<\"" },
        peg$c134 = ">>>",
        peg$c135 = { type: "literal", value: ">>>", description: "\">>>\"" },
        peg$c136 = ">>",
        peg$c137 = { type: "literal", value: ">>", description: "\">>\"" },
        peg$c138 = "<=",
        peg$c139 = { type: "literal", value: "<=", description: "\"<=\"" },
        peg$c140 = ">=",
        peg$c141 = { type: "literal", value: ">=", description: "\">=\"" },
        peg$c142 = "<",
        peg$c143 = { type: "literal", value: "<", description: "\"<\"" },
        peg$c144 = ">",
        peg$c145 = { type: "literal", value: ">", description: "\">\"" },
        peg$c146 = "===",
        peg$c147 = { type: "literal", value: "===", description: "\"===\"" },
        peg$c148 = "!==",
        peg$c149 = { type: "literal", value: "!==", description: "\"!==\"" },
        peg$c150 = "==",
        peg$c151 = { type: "literal", value: "==", description: "\"==\"" },
        peg$c152 = "!=",
        peg$c153 = { type: "literal", value: "!=", description: "\"!=\"" },
        peg$c154 = "&",
        peg$c155 = { type: "literal", value: "&", description: "\"&\"" },
        peg$c156 = "^",
        peg$c157 = { type: "literal", value: "^", description: "\"^\"" },
        peg$c158 = "|",
        peg$c159 = { type: "literal", value: "|", description: "\"|\"" },
        peg$c160 = "&&",
        peg$c161 = { type: "literal", value: "&&", description: "\"&&\"" },
        peg$c162 = "||",
        peg$c163 = { type: "literal", value: "||", description: "\"||\"" },
        peg$c164 = function(l, r) {
                var exp = new A.AssignExp();
                exp.setLeft(l);
                exp.setRight(r);
                return exp;
            },
        peg$c165 = function(head, rest) {
                return makeBinaryOperator(head, rest);
            },
        peg$c166 = function(op, exp) {
                return new A.UnaryOpExp(op, exp);
            },
        peg$c167 = function(callee, args, rest) {
                var result = new A.CallExp(callee, args);
                rest.forEach(function(r) {
                    if (Array.isArray(r)) {
                        result = new A.CallExp(result, r);
                    } else if (r.computed) {
                        result = new A.ComputedMemberExp(result, r.property);
                    } else {
                        result = new A.StaticMemberExp(result, r.property);
                    }
                });
                return result;
            },
        peg$c168 = function(args) {
                return args;
            },
        peg$c169 = function(first, rest) {
                var result = first;
                rest.forEach(function(r) {
                    if (r.computed) {
                        result = new A.ComputedMemberExp(result, r.property);
                    } else {
                        result = new A.StaticMemberExp(result, r.property);
                    }
                });
                return result;
            },
        peg$c170 = function(property) {
                return { computed: true, property: property };
            },
        peg$c171 = function(property) {
                return { computed: false, property: property };
            },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      if (peg$c1.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c1.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c2); }
        }
      }

      return s0;
    }

    function peg$parseident_start() {
      var s0;

      if (peg$c3.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }

      return s0;
    }

    function peg$parseident_rest() {
      var s0;

      if (peg$c5.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
      }

      return s0;
    }

    function peg$parseident() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseident_start();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parseident_rest();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parseident_rest();
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c7;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c7;
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsestring() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c8;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c9); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsestring_char_single();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsestring_char_single();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s3 = peg$c8;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c9); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c10(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
          s1 = peg$c11;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c12); }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parsestring_char_double();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parsestring_char_double();
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s3 = peg$c11;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c12); }
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c10(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      }

      return s0;
    }

    function peg$parsestring_char_single() {
      var s0, s1, s2, s3;

      s0 = peg$parseescape_char();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c14.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c15); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c16); }
          }
          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c7;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c7;
        }
        if (s1 !== peg$FAILED) {
          s1 = input.substring(s0, peg$currPos);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsestring_char_double() {
      var s0, s1, s2, s3;

      s0 = peg$parseescape_char();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c17.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c18); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c16); }
          }
          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c7;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c7;
        }
        if (s1 !== peg$FAILED) {
          s1 = input.substring(s0, peg$currPos);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseescape_char() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c19) {
        s1 = peg$c19;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c21();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c22) {
          s1 = peg$c22;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c23); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c24();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c25) {
            s1 = peg$c25;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c26); }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c27();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c28) {
              s1 = peg$c28;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c29); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c30();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c31) {
                s1 = peg$c31;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c32); }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c33();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c34) {
                  s1 = peg$c34;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c35); }
                }
                if (s1 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c36();
                }
                s0 = s1;
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsefloat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = [];
      if (peg$c37.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c37.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c38); }
          }
        }
      } else {
        s2 = peg$c7;
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s3 = peg$c39;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c40); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          if (peg$c37.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c38); }
          }
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              if (peg$c37.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c38); }
              }
            }
          } else {
            s4 = peg$c7;
          }
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c7;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c7;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c7;
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseinteger() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (peg$c41.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c42); }
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        if (peg$c37.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c38); }
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          if (peg$c37.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c38); }
          }
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c7;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c7;
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseBREAK() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c43) {
        s1 = peg$c43;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c44); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseCONTINUE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c45) {
        s1 = peg$c45;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c46); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseELSE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c47) {
        s1 = peg$c47;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c48); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseFALSE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c49) {
        s1 = peg$c49;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c50); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseFUNCTION() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c51) {
        s1 = peg$c51;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c52); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseIF() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c53) {
        s1 = peg$c53;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c54); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseNULL() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c55) {
        s1 = peg$c55;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c56); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseRETURN() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c57) {
        s1 = peg$c57;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c58); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseTRUE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c59) {
        s1 = peg$c59;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c60); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseVAR() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c61) {
        s1 = peg$c61;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c62); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseWHILE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c63) {
        s1 = peg$c63;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c64); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseident_rest();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = peg$c13;
        } else {
          peg$currPos = s2;
          s2 = peg$c7;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseEOS() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 59) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseProgram() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseFunctionDef();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseFunctionDef();
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c67(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseFunctionDef() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseFUNCTION();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseident();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseFunctionParams();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseFunctionBlock();
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c68(s4, s6, s8);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c7;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c7;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c7;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseFunctionParams() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c69;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c70); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseFunctionParamList();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s4 = peg$c71;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c72); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c73(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
          s1 = peg$c69;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c70); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s3 = peg$c71;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c72); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c74();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      }

      return s0;
    }

    function peg$parseFunctionParamList() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parseident();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c75;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c76); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseident();
              if (s7 !== peg$FAILED) {
                s8 = peg$parse_();
                if (s8 !== peg$FAILED) {
                  s5 = [s5, s6, s7, s8];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$c7;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c7;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c7;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$c7;
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c75;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c76); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseident();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    s5 = [s5, s6, s7, s8];
                    s4 = s5;
                  } else {
                    peg$currPos = s4;
                    s4 = peg$c7;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$c7;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c7;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c7;
            }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c77(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseFunctionBlock() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c78;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c79); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseVariables();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseFunctions();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseStatements();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 125) {
                  s6 = peg$c80;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c81); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c82(s3, s4, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c7;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c7;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseVariables() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseVariableDeclaration();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseVariableDeclaration();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c83(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseVariableDeclaration() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = peg$parseVAR();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseident();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s5 = peg$c84;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c85); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseAssignmentExpression();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 59) {
                      s8 = peg$c65;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c66); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parse_();
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c86(s3, s7);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c7;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c7;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c7;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c7;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseVAR();
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseident();
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 59) {
                  s5 = peg$c65;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c66); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c87(s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c7;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c7;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      }

      return s0;
    }

    function peg$parseFunctions() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseFunctionDef();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseFunctionDef();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c88(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseStatements() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseStatement();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseStatement();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c89(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseStatement() {
      var s0;

      s0 = peg$parseWhileStatement();
      if (s0 === peg$FAILED) {
        s0 = peg$parseIfStatement();
        if (s0 === peg$FAILED) {
          s0 = peg$parseBreakStatement();
          if (s0 === peg$FAILED) {
            s0 = peg$parseContinueStatement();
            if (s0 === peg$FAILED) {
              s0 = peg$parseReturnStatement();
              if (s0 === peg$FAILED) {
                s0 = peg$parseExpressionStatement();
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseWhileStatement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parseWHILE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c69;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c70); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseAssignmentExpression();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s6 = peg$c71;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c72); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseBlock();
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c90(s5, s8);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c7;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c7;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c7;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseIfStatement() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseIfClause();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseElseIfClause();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseElseIfClause();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseElseClause();
          if (s3 === peg$FAILED) {
            s3 = peg$c91;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c92(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseIfClause() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parseIF();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c69;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c70); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseAssignmentExpression();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s6 = peg$c71;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c72); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseBlock();
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c93(s5, s8);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c7;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c7;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c7;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseElseIfClause() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      s0 = peg$currPos;
      s1 = peg$parseELSE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseIF();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 40) {
                s5 = peg$c69;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c70); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseAssignmentExpression();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s8 = peg$c71;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c72); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parse_();
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parseBlock();
                        if (s10 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c93(s7, s10);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c7;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c7;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c7;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c7;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c7;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseElseClause() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseELSE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseBlock();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c94(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseBlock() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c78;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c79); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseStatements();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 125) {
              s4 = peg$c80;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c81); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c95(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseBreakStatement() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseBREAK();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseEOS();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseContinueStatement() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseCONTINUE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseEOS();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseReturnStatement() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseRETURN();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseAssignmentExpression();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseEOS();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c96(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseRETURN();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseEOS();
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c97();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      }

      return s0;
    }

    function peg$parseExpressionStatement() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseAssignmentExpression();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseEOS();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c98(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parsePrimaryExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$parseIdent();
      if (s0 === peg$FAILED) {
        s0 = peg$parseLiteral();
        if (s0 === peg$FAILED) {
          s0 = peg$parseArray();
          if (s0 === peg$FAILED) {
            s0 = peg$parseObject();
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 40) {
                s1 = peg$c69;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c70); }
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                  s3 = peg$parseAssignmentExpression();
                  if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 41) {
                        s5 = peg$c71;
                        peg$currPos++;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c72); }
                      }
                      if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c98(s3);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c7;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c7;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c7;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c7;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c7;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseArray() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c99;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c100); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseExpressionList();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s4 = peg$c101;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c102); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c103(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 91) {
          s1 = peg$c99;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c100); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s3 = peg$c101;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c102); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c104();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      }

      return s0;
    }

    function peg$parseExpressionList() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseAssignmentExpression();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c75;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c76); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseAssignmentExpression();
              if (s7 !== peg$FAILED) {
                s5 = [s5, s6, s7];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$c7;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c7;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$c7;
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 44) {
              s5 = peg$c75;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c76); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseAssignmentExpression();
                if (s7 !== peg$FAILED) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$c7;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c7;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c7;
            }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c105(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseObject() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c78;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c79); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsePairs();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 125) {
              s4 = peg$c80;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c81); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c106(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 123) {
          s1 = peg$c78;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c79); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 125) {
              s3 = peg$c80;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c81); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c107();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      }

      return s0;
    }

    function peg$parsePairs() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parsePair();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 44) {
          s4 = peg$c75;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c76); }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parsePair();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c75;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c76); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsePair();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c105(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parsePair() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseKey();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s3 = peg$c108;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c109); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseAssignmentExpression();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c110(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseKey() {
      var s0;

      s0 = peg$parseident();
      if (s0 === peg$FAILED) {
        s0 = peg$parsestring();
        if (s0 === peg$FAILED) {
          s0 = peg$parsefloat();
          if (s0 === peg$FAILED) {
            s0 = peg$parseinteger();
          }
        }
      }

      return s0;
    }

    function peg$parseLiteral() {
      var s0;

      s0 = peg$parseNumber();
      if (s0 === peg$FAILED) {
        s0 = peg$parseString();
        if (s0 === peg$FAILED) {
          s0 = peg$parseBoolean();
          if (s0 === peg$FAILED) {
            s0 = peg$parseNull();
          }
        }
      }

      return s0;
    }

    function peg$parseNumber() {
      var s0;

      s0 = peg$parseFloat();
      if (s0 === peg$FAILED) {
        s0 = peg$parseInteger();
      }

      return s0;
    }

    function peg$parseString() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsestring();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c111(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseFloat() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsefloat();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c112(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseInteger() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseinteger();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c113(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseBoolean() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseTRUE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c114();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseFALSE();
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c115();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      }

      return s0;
    }

    function peg$parseNull() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseNULL();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c116();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseIdent() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseident();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c117(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseUnaryOperator() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 43) {
        s0 = peg$c118;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c119); }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 45) {
          s0 = peg$c120;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c121); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 126) {
            s0 = peg$c122;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c123); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 33) {
              s0 = peg$c124;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c125); }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseMultiplicativeOperator() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 42) {
        s0 = peg$c126;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c127); }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 47) {
          s0 = peg$c128;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c129); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 37) {
            s0 = peg$c130;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c131); }
          }
        }
      }

      return s0;
    }

    function peg$parseAdditiveOperator() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 43) {
        s0 = peg$c118;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c119); }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 45) {
          s0 = peg$c120;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c121); }
        }
      }

      return s0;
    }

    function peg$parseShiftOperator() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c132) {
        s0 = peg$c132;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c133); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c134) {
          s0 = peg$c134;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c135); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c136) {
            s0 = peg$c136;
            peg$currPos += 2;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c137); }
          }
        }
      }

      return s0;
    }

    function peg$parseRelationalOperator() {
      var s0, s1, s2, s3, s4;

      if (input.substr(peg$currPos, 2) === peg$c138) {
        s0 = peg$c138;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c139); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c140) {
          s0 = peg$c140;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c141); }
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 60) {
            s2 = peg$c142;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c143); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 60) {
              s4 = peg$c142;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c143); }
            }
            peg$silentFails--;
            if (s4 === peg$FAILED) {
              s3 = peg$c13;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
            if (s3 !== peg$FAILED) {
              s2 = [s2, s3];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$c7;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c7;
          }
          if (s1 !== peg$FAILED) {
            s1 = input.substring(s0, peg$currPos);
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 62) {
              s2 = peg$c144;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c145); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$currPos;
              peg$silentFails++;
              if (input.charCodeAt(peg$currPos) === 62) {
                s4 = peg$c144;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c145); }
              }
              peg$silentFails--;
              if (s4 === peg$FAILED) {
                s3 = peg$c13;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
              if (s3 !== peg$FAILED) {
                s2 = [s2, s3];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$c7;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c7;
            }
            if (s1 !== peg$FAILED) {
              s1 = input.substring(s0, peg$currPos);
            }
            s0 = s1;
          }
        }
      }

      return s0;
    }

    function peg$parseEqualityOperator() {
      var s0;

      if (input.substr(peg$currPos, 3) === peg$c146) {
        s0 = peg$c146;
        peg$currPos += 3;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c147); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c148) {
          s0 = peg$c148;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c149); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c150) {
            s0 = peg$c150;
            peg$currPos += 2;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c151); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c152) {
              s0 = peg$c152;
              peg$currPos += 2;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c153); }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseBitwiseAndOperator() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 38) {
        s2 = peg$c154;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c155); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 38) {
          s4 = peg$c154;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c155); }
        }
        peg$silentFails--;
        if (s4 === peg$FAILED) {
          s3 = peg$c13;
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c7;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c7;
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseBitwiseXorOperator() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 94) {
        s0 = peg$c156;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c157); }
      }

      return s0;
    }

    function peg$parseBitwiseOrOperator() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 124) {
        s2 = peg$c158;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c159); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 124) {
          s4 = peg$c158;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c159); }
        }
        peg$silentFails--;
        if (s4 === peg$FAILED) {
          s3 = peg$c13;
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c7;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c7;
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseLogicalAndOperator() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c160) {
        s0 = peg$c160;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c161); }
      }

      return s0;
    }

    function peg$parseLogicalOrOperator() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c162) {
        s0 = peg$c162;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c163); }
      }

      return s0;
    }

    function peg$parseAssignmentExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseLeftHandSideExpression();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s3 = peg$c84;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c85); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 61) {
              s5 = peg$c84;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c85); }
            }
            peg$silentFails--;
            if (s5 === peg$FAILED) {
              s4 = peg$c13;
            } else {
              peg$currPos = s4;
              s4 = peg$c7;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseAssignmentExpression();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c164(s1, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c7;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseLogicalOrExpression();
      }

      return s0;
    }

    function peg$parseLogicalOrExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseLogicalAndExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseLogicalOrOperator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseLogicalAndExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseLogicalOrOperator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseLogicalAndExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c165(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseLogicalAndExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseBitwiseOrExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseLogicalAndOperator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseBitwiseOrExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseLogicalAndOperator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseBitwiseOrExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c165(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseBitwiseOrExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseBitwiseXorExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseBitwiseOrOperator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseBitwiseXorExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseBitwiseOrOperator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseBitwiseXorExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c165(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseBitwiseXorExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseBitwiseAndExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseBitwiseXorOperator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseBitwiseAndExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseBitwiseXorOperator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseBitwiseAndExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c165(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseBitwiseAndExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseEqualityExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseBitwiseAndOperator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseEqualityExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseBitwiseAndOperator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseEqualityExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c165(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseEqualityExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseRelationalExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseEqualityOperator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseRelationalExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseEqualityOperator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseRelationalExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c165(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseRelationalExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseShiftExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseRelationalOperator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseShiftExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseRelationalOperator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseShiftExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c165(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseShiftExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseAdditiveExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseShiftOperator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseAdditiveExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseShiftOperator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseAdditiveExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c165(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseAdditiveExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseMultiplicativeExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseAdditiveOperator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseMultiplicativeExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseAdditiveOperator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseMultiplicativeExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c165(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseMultiplicativeExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseUnaryExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseMultiplicativeOperator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseUnaryExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseMultiplicativeOperator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseUnaryExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c165(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseUnaryExpression() {
      var s0, s1, s2, s3;

      s0 = peg$parseLeftHandSideExpression();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseUnaryOperator();
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseUnaryExpression();
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c166(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      }

      return s0;
    }

    function peg$parseLeftHandSideExpression() {
      var s0;

      s0 = peg$parseCallExpression();
      if (s0 === peg$FAILED) {
        s0 = peg$parseMemberExpression();
      }

      return s0;
    }

    function peg$parseCallExpression() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseMemberExpression();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseArguments();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseCallCons();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseCallCons();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c167(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseArguments() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c69;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c70); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseArgumentList();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s4 = peg$c71;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c72); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c168(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
          s1 = peg$c69;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c70); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s3 = peg$c71;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c72); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c74();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      }

      return s0;
    }

    function peg$parseArgumentList() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseAssignmentExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 44) {
          s4 = peg$c75;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c76); }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseAssignmentExpression();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c7;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c75;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c76); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseAssignmentExpression();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c7;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c7;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c7;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c105(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseCallCons() {
      var s0;

      s0 = peg$parseArguments();
      if (s0 === peg$FAILED) {
        s0 = peg$parseMember();
      }

      return s0;
    }

    function peg$parseMemberExpression() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsePrimaryExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseMember();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseMember();
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c169(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseMember() {
      var s0;

      s0 = peg$parseComputedMember();
      if (s0 === peg$FAILED) {
        s0 = peg$parseStaticMember();
      }

      return s0;
    }

    function peg$parseComputedMember() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c99;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c100); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseAssignmentExpression();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s4 = peg$c101;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c102); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c170(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c7;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }

    function peg$parseStaticMember() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s1 = peg$c39;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseident();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c171(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c7;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c7;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c7;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c7;
      }

      return s0;
    }


        var A = require('./runtime');

        function makeBinaryOperator(head, rest) {
            var result = head;
            rest.forEach(function(i) {
                if (i[0] === '||') {
                    result = new A.LogicalOrExp(result, i[2]);
                } else if (i[0] === '&&') {
                    result = new A.LogicalAndExp(result, i[2]);
                } else {
                    result = new A.BinOpExp(result, i[0], i[2]);
                }
            });
            return result;
        }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();

},{"./runtime":26}],6:[function(require,module,exports){
var T = require('traitor');

var ArrayLiteral = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').ARRAY_LITERAL,
        
        __construct: function() {
            this.expressions = [];
        },

        addExpression: function(exp) {
            this.expressions.push(exp);
        },

        getValues: function() {
            return this.expressions;
        },

        newFrame: function(exp) {
            return { ix: 0, ary: [] };
        },

        step: function(frame, env, vm) {
            if (frame.ix > 0) {
                frame.ary.push(vm.retVal);
            }
            if (frame.ix < this.expressions.length) {
                vm.evaluate(this.expressions[frame.ix]);
                frame.ix++;
            } else {
                vm.ret(frame.ary);
            }
        }

    }

)

},{"./types":27,"traitor":28}],7:[function(require,module,exports){
var T = require('traitor');
var types = require('./types');

var AssignExp = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').ASSIGN_EXP,
        
        __construct: function() {
            this.left = null;
            this.right = null;
        },


        getLeft: function() {
            return this.left;
        },

        getRight: function() {
            return this.right;
        },

        setLeft: function(left) {
            this.left = left;
        },

        setRight: function(right) {
            this.right = right;
        },

        newFrame: function() {
            return { state: 0, value: null };
        },

        step: function(frame, env, vm) {
            if (frame.state === 0) {
                vm.evaluate(this.right);
                if (this.left.type === types.IDENT) {
                    frame.state = 1;
                } else if (this.left.type === types.COMPUTED_MEMBER_EXP) {
                    frame.state = 2;
                } else if (this.left.type === types.STATIC_MEMBER_EXP) {
                    frame.state = 5;
                }
            } else if (frame.state === 1) {
                env.set(this.left.name, vm.retVal);
                vm.ret(vm.retVal);
            } else if (frame.state === 2) {
                frame.value = vm.retVal;
                vm.evaluate(this.left.object);
                frame.state = 3;
            } else if (frame.state === 3) {
                frame.object = vm.retVal;
                vm.evaluate(this.left.property);
                frame.state = 4;
            } else if (frame.state === 4) {
                frame.object[vm.retVal] = frame.value;
                vm.ret(frame.value);
            } else if (frame.state === 5) {
                frame.value = vm.retVal;
                vm.evaluate(this.left.object);
                frame.state = 6;
            } else if (frame.state === 6) {
                vm.retVal[this.left.property] = frame.value;
                vm.ret(frame.value);
            }
        }

    }

)

},{"./types":27,"traitor":28}],8:[function(require,module,exports){
var T = require('traitor');

var OPS = {
    '*'     : function(l, r) { return l * r; },
    '/'     : function(l, r) { return l / r; },
    '%'     : function(l, r) { return l % r; },
    '+'     : function(l, r) { return l + r; },
    '-'     : function(l, r) { return l - r; },
    '<<'    : function(l, r) { return l << r; },
    '>>>'   : function(l, r) { return l >>> r; },
    '>>'    : function(l, r) { return l >> r; },
    '<='    : function(l, r) { return l <= r; },
    '>='    : function(l, r) { return l >= r; },
    '<'     : function(l, r) { return l < r; },
    '>'     : function(l, r) { return l > r; },
    '==='   : function(l, r) { return l === r; },
    '!=='   : function(l, r) { return l !== r; },
    '=='    : function(l, r) { return l == r; },
    '!='    : function(l, r) { return l != r; },
    '&'     : function(l, r) { return l & r; },
    '^'     : function(l, r) { return l ^ r; },
    '|'     : function(l, r) { return l | r; },
};

var BinOpExp = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').BIN_OP_EXP,
        
        __construct: function(left, op, right) {
            this.left = left;
            this.op = op;
            this.right = right;
        },

        getLeft: function() {
            return this.left;
        },

        getOp: function() {
            return this.op;
        },

        getRight: function() {
            return this.right;
        },

        newFrame: function() {
            return { state: 0, left: null };
        },

        step: function(frame, env, vm) {
            if (frame.state === 0) {
                vm.evaluate(this.left);
            } else if (frame.state === 1) {
                frame.left = vm.retVal;
                vm.evaluate(this.right);
            } else {
                if (this.op in OPS) {
                    vm.ret(OPS[this.op](frame.left, vm.retVal));
                } else {
                    throw new Error("runtime error - unsupported op!");
                }
            }
            frame.state++;
        }

    }

)

},{"./types":27,"traitor":28}],9:[function(require,module,exports){
var T = require('traitor');
var types = require('./types');

var CallExp = module.exports = T.make(

    [ 'events' ], {

        type: types.CALL_EXP,
        
        __construct: function(callee, args) {
            this.callee = callee;
            this.args = args;
        },

        getCallee: function() {
            return this.callee;
        },

        getArguments: function() {
            return this.args;
        },

        newFrame: function() {
            return {
                ix: 0,
                args: [],
                argIx: 0,
                nativeReturn: null
            };
        },

        step: function(frame, env, vm) {

            if (frame.ix === 0) {
                if (frame.argIx > 0) {
                    frame.args.push(vm.retVal);
                }
                if (frame.argIx >= this.args.length) {
                    frame.ix = 1;
                } else {
                    vm.evaluate(this.args[frame.argIx++]);
                    return;
                }
            }

            if (frame.ix === 1) {
                vm.evaluate(this.callee);
                frame.ix = 2;
                return;
            } else if (frame.ix === 2) {
                var callee = vm.retVal;

                if (typeof callee === 'function') {
                    
                    frame.nativeReturn = callee.apply(vm, frame.args);
                    frame.ix = 3;

                } else if (callee.type === types.FUNCTION_INSTANCE) {

                    var params = callee.fn.params;
                    if (params.length !== frame.args.length) {
                        throw new Error("argument mismatch");
                    }
                    
                    var newEnv = callee.env.begetFrame(params, frame.args);

                    vm.pushEnv(newEnv);
                    vm.evaluate(callee);
                    frame.ix = 4;
                    
                } else {
                    throw new Error("callee is not a function!");
                }
            } else if (frame.ix === 3) {
                vm.ret(frame.nativeReturn);
            } else if (frame.ix === 4) {
                vm.ret(vm.retVal);
            }

        }
    
    }

)

},{"./types":27,"traitor":28}],10:[function(require,module,exports){
var T = require('traitor');

var ComputedMemberExp = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').COMPUTED_MEMBER_EXP,
        
        __construct: function(object, property) {
            this.object = object;
            this.property = property;
        },

        getObject: function() {
            return this.object;
        },

        getProperty: function() {
            return this.property;
        },

        newFrame: function() {
            return { state: 0, object: null };
        },

        step: function(frame, env, vm) {
            if (frame.state === 0) {
                vm.evaluate(this.object);
            } else if (frame.state === 1) {
                frame.object = vm.retVal;
                vm.evaluate(this.property);
            } else {
                vm.ret(frame.object[vm.retVal]);
            }
            frame.state++;
        }
    
    }

)

},{"./types":27,"traitor":28}],11:[function(require,module,exports){
var T = require('traitor');
var FunctionInstance = require('./FunctionInstance');

var FunctionDef = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').FUNCTION_DEF,
        
        __construct: function() {
            this.name = null;
            this.params = null;
            this.variables = null;
            this.innerFunctions = null;
            this.body = null;
        },

        getName: function() {
            return this.name;
        },

        getParams: function() {
            return this.params;
        },

        getVariables: function() {
            return this.variables;
        },

        getInnerFunctions: function() {
            return this.innerFunctions;
        },

        getBody: function() {
            return this.body;
        },

        setName: function(name) {
            this.name = name;
        },

        setParams: function(params) {
            this.params = params;
        },

        setVariables: function(variables) {
            this.variables = variables;
        },

        setInnerFunctions: function(innerFunctions) {
            this.innerFunctions = innerFunctions;
        },

        setBody: function(body) {
            this.body = body;
        },

        createInstance: function(env) {
            return new FunctionInstance(this, env);
        }

    }

)

},{"./FunctionInstance":12,"./types":27,"traitor":28}],12:[function(require,module,exports){
var T = require('traitor');

var FunctionInstance = module.exports = T.make(

    [ 'events' ], {

        steptoeFunctionInstance: true,
        type: require('./types').FUNCTION_INSTANCE,
        
        __construct: function(fn, env) {
            this.fn = fn;
            this.env = env;
        },

        getFunction: function() {
            return this.fn;
        },

        getEnv: function() {
            return this.env;
        },

        newFrame: function() {
            return { ix: 0 };
        },

        step: function(frame, env, vm) {
            if (frame.ix === 0) {
                frame.ix++;
                if (this.fn.variables) {
                    vm.evaluate(this.fn.variables);
                    return;
                }
            }

            if (frame.ix === 1) {
                frame.ix++;
                if (this.fn.innerFunctions) {
                    vm.evaluate(this.fn.innerFunctions);
                    return;
                }
            }

            if (frame.ix === 2) {
                frame.ix++;
                vm.evaluate(this.fn.body);
                return;
            }

            if (frame.ix === 3) {
                vm.ret(vm.retVal);
                return;
            }
        }

    }

)

},{"./types":27,"traitor":28}],13:[function(require,module,exports){
var T = require('traitor');
var FunctionInstance = require('../runtime/FunctionInstance');

var Functions = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').FUNCTIONS,
        
        __construct: function() {
            this.functions = [];
        },

        getFunctions: function() {
            return this.functions;
        },

        addFunction: function(fun) {
            this.functions.push(fun);
        },

        newFrame: function() {
            return { ix: 0 };
        },

        step: function(frame, env, vm) {
            if (frame.ix > 0) {
                var fn = this.functions[frame.ix-1];
                env.def(fn.getName(), new FunctionInstance(fn, env));
            }
            if (frame.ix < this.functions.length) {
                // no-op
                frame.ix++;
            } else {
                vm.ret();
            }
        }
    
    }

)

},{"../runtime/FunctionInstance":12,"./types":27,"traitor":28}],14:[function(require,module,exports){
var T = require('traitor');

var Ident = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').IDENT,
        
        __construct: function(name) {
            this.name = name;
        },

        getName: function() {
            return this.name;
        },

        newFrame: function() {
            return null;
        },

        step: function(frame, env, vm) {
            vm.ret(env.get(this.name));
        }

    }

)

},{"./types":27,"traitor":28}],15:[function(require,module,exports){
var T = require('traitor');

var IfStmt = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').IF_STMT,
        
        __construct: function() {
            this.conditions = [];
            this.bodies = [];
        },

        addClause: function(condition, body) {
            this.conditions.push(condition);
            this.bodies.push(body);
        },

        newFrame: function() {
            return { state: 0, ix: 0 };
        },

        step: function(frame, env, vm) {
            if (frame.state === 0) {
                if (this.conditions[frame.ix]) {
                    vm.evaluate(this.conditions[frame.ix]);
                    frame.state = 1;
                } else {
                    vm.evaluate(this.bodies[frame.ix]);
                    frame.state = 2;
                }
            } else if (frame.state === 1) {
                if (vm.isTruthy(vm.retVal)) {
                    vm.evaluate(this.bodies[frame.ix]);
                    frame.state = 2;
                } else {
                    frame.state = 0;
                    frame.ix++;
                    if (frame.ix >= this.conditions.length) {
                        vm.ret(null);
                    }
                }
            } else {
                vm.ret(null);
            }
        }

    }

)

},{"./types":27,"traitor":28}],16:[function(require,module,exports){
var T = require('traitor');

var LogicalAndExp = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').LOGICAL_AND_EXP,
        
        __construct: function(left, right) {
            this.left = left;
            this.right = right;
        },

        getLeft: function() {
            return this.left;
        },

        getRight: function() {
            return this.right;
        },

        newFrame: function() {
            return { state: 0 };
        },

        step: function(frame, env, vm) {
            if (frame.state === 0) {
                vm.evaluate(this.left);
            } else if (frame.state === 1) {
                if (!vm.isTruthy(vm.retVal)) {
                    vm.ret(false);
                } else {
                    vm.evaluate(this.right);
                }
            } else if (frame.state === 2) {
                vm.ret(vm.retVal);
            }
            frame.state++;
        }

    }

)

},{"./types":27,"traitor":28}],17:[function(require,module,exports){
var T = require('traitor');

var LogicalOrExp = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').LOGICAL_OR_EXP,
        
        __construct: function(left, right) {
            this.left = left;
            this.right = right;
        },

        getLeft: function() {
            return this.left;
        },

        getRight: function() {
            return this.right;
        },

        newFrame: function() {
            return { state: 0 };
        },

        step: function(frame, env, vm) {
            if (frame.state === 0) {
                vm.evaluate(this.left);
            } else if (frame.state === 1) {
                if (vm.isTruthy(vm.retVal)) {
                    vm.ret(vm.retVal);
                } else {
                    vm.evaluate(this.right);
                }
            } else if (frame.state === 2) {
                vm.ret(vm.retVal);
            }
            frame.state++;
        }

    }

)

},{"./types":27,"traitor":28}],18:[function(require,module,exports){
var T = require('traitor');

var ObjectLiteral = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').OBJECT_LITERAL,
        
        __construct: function() {
            this.keys = [];
            this.values = [];
        },

        getKeys: function() {
            return this.keys;
        },

        getValues: function() {
            return this.values;
        },

        addPair: function(key, value) {
            this.keys.push(key);
            this.values.push(value);
        },

        newFrame: function(exp) {
            return { ix: 0, obj: {} };
        },

        step: function(frame, env, vm) {
            if (frame.ix > 0) {
                frame.obj[this.keys[frame.ix-1]] = vm.retVal;
            }
            if (frame.ix < this.keys.length) {
                vm.evaluate(this.values[frame.ix]);
                frame.ix++;
            } else {
                vm.ret(frame.obj);
            }
        }
    
    }

)

},{"./types":27,"traitor":28}],19:[function(require,module,exports){
var T = require('traitor');

var PrimitiveLiteral = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').PRIMITIVE_LITERAL,
        
        __construct: function(value) {
            this.value = value;
        },

        getValue: function() {
            return this.value;
        },

        newFrame: function() {
            return null;
        },

        step: function(state, env, vm) {
            vm.ret(this.value);
        }

    }

)

},{"./types":27,"traitor":28}],20:[function(require,module,exports){
var T = require('traitor');

var ReturnStmt = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').RETURN_STMT,
        
        __construct: function() {
            this._returnValue = null;
        },

        hasReturnValue: function() {
            return !!this._returnValue;
        },

        getReturnValue: function() {
            return this._returnValue;
        },

        setReturnValue: function(returnValue) {
            this._returnValue = returnValue;
        },

        newFrame: function() {
            return { state: 0 };
        },

        step: function(frame, env, vm) {
            if (frame.state === 0) {
                if (this._returnValue) {
                    vm.evaluate(this._returnValue);
                    frame.state = 1;
                } else {
                    frame.state = 2;
                }
            } else if (frame.state === 1) {
                vm.returnFromFunction(vm.retVal);
            } else if (frame.state === 2) {
                vm.returnFromFunction(null);
            }
        }

    }

)

},{"./types":27,"traitor":28}],21:[function(require,module,exports){
var T = require('traitor');
var types = require('./types');
var ReturnStmt = require('./ReturnStmt');

var Statements = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').STATEMENTS,
        
        __construct: function() {
            this._body = [];
        },

        getStatements: function() {
            return this._body;
        },

        addFinalReturnStatement: function() {
            if (this._body.length === 0
                || this._body[this._body.length-1].type !== types.RETURN_STMT) {
                var finalReturn = new ReturnStmt();
                finalReturn.implied = true;
                this._body.push(finalReturn);
            }
        },

        addStatement: function(statement) {
            this._body.push(statement);
        },

        newFrame: function() {
            return { ix: 0 };
        },

        step: function(frame, env, vm) {
            if (frame.ix >= this._body.length) {
                vm.ret(null);
            } else {
                vm.evaluate(this._body[frame.ix++]);
            }
        }

    }

)

},{"./ReturnStmt":20,"./types":27,"traitor":28}],22:[function(require,module,exports){
var T = require('traitor');

var StaticMemberExp = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').STATIC_MEMBER_EXP,
        
        __construct: function(object, property) {
            this.object = object;
            this.property = property;
        },

        newFrame: function() {
            return { state: 0 };
        },

        step: function(frame, env, vm) {
            if (frame.state === 0) {
                vm.evaluate(this.object);
                frame.state = 1;
            } else {
                vm.ret(vm.retVal[this.property]);
            }
        }
    
    }

)

},{"./types":27,"traitor":28}],23:[function(require,module,exports){
var T = require('traitor');

var OPS = {
    '+'     : function(v) { return +v; },
    '-'     : function(v) { return -v; },
    '~'     : function(v) { return ~v; },
    '!'     : function(v) { return !v; }
};

var UnaryOpExp = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').UNARY_OP_EXP,
        
        __construct: function(op, exp) {
            this.op = op;
            this.exp = exp;
        },

        getOp: function() {
            return this.op;
        },

        getExp: function() {
            return this.exp;
        },

        newFrame: function() {
            return { state: 0 }
        },

        step: function(frame, env, vm) {
            if (frame.state === 0) {
                vm.evaluate(this.exp);
            } else if (frame.state === 1) {
                if (this.op in OPS) {
                    vm.ret(OPS[this.op](vm.retVal));
                } else {
                    throw new Error("runtime error - unknown operation: " + this.op);
                }
            }
            frame.state++;
        }

    }

);

},{"./types":27,"traitor":28}],24:[function(require,module,exports){
var T = require('traitor');

var Variables = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').VARIABLES,
        
        __construct: function() {
            this.names = [];
            this.initialValues = [];
        },

        addVariable: function(name, initialValue) {
            this.names.push(name);
            this.initialValues.push(initialValue);
        },

        newFrame: function() {
            return { ix: 0 };
        },

        step: function(frame, env, vm) {
            if (frame.ix > 0) {
                if (this.initialValues[frame.ix-1]) {
                    env.def(this.names[frame.ix-1], vm.retVal);
                } else {
                    env.def(this.names[frame.ix-1], null);
                }
            }
            if (frame.ix < this.names.length) {
                if (this.initialValues[frame.ix]) {
                    vm.evaluate(this.initialValues[frame.ix]);
                } else {
                    // no-op
                }
                frame.ix++;
            } else {
                vm.ret();
            }
        }
    
    }

)

},{"./types":27,"traitor":28}],25:[function(require,module,exports){
var T = require('traitor');

var WhileStmt = module.exports = T.make(

    [ 'events' ], {

        type: require('./types').WHILE_STMT,
        
        __construct: function() {
            this.condition = null;
            this.body = null;
        },

        getCondition: function() {
            return this.condition;
        },

        setCondition: function(condition) {
            this.condition = condition;
        },

        getBody: function() {
            return this.body;
        },

        setBody: function(body) {
            this.body = body;
        },

        newFrame: function() {
            return { state: 0 };
        },

        step: function(frame, env, vm) {
            if (frame.state === 0) {
                vm.evaluate(this.condition);
                frame.state = 1;
            } else {
                if (vm.isTruthy(vm.retVal)) {
                    vm.evaluate(this.body);
                    frame.state = 0;
                } else {
                    vm.ret();
                }
            }
        }

    }

)

},{"./types":27,"traitor":28}],26:[function(require,module,exports){
module.exports = {
    ArrayLiteral        : require('./ArrayLiteral'),
    AssignExp           : require('./AssignExp'),
    BinOpExp            : require('./BinOpExp'),
    CallExp             : require('./CallExp'),
    ComputedMemberExp   : require('./ComputedMemberExp'),
    FunctionDef         : require('./FunctionDef'),
    Functions           : require('./Functions'),
    FunctionInstance    : require('./FunctionInstance'),
    Ident               : require('./Ident'),
    IfStmt              : require('./IfStmt'),
    LogicalAndExp       : require('./LogicalAndExp'),
    LogicalOrExp        : require('./LogicalOrExp'),
    ObjectLiteral       : require('./ObjectLiteral'),
    PrimitiveLiteral    : require('./PrimitiveLiteral'),
    ReturnStmt          : require('./ReturnStmt'),
    Statements          : require('./Statements'),
    StaticMemberExp     : require('./StaticMemberExp'),
    UnaryOpExp          : require('./UnaryOpExp'),
    Variables           : require('./Variables'),
    WhileStmt           : require('./WhileStmt')
};
},{"./ArrayLiteral":6,"./AssignExp":7,"./BinOpExp":8,"./CallExp":9,"./ComputedMemberExp":10,"./FunctionDef":11,"./FunctionInstance":12,"./Functions":13,"./Ident":14,"./IfStmt":15,"./LogicalAndExp":16,"./LogicalOrExp":17,"./ObjectLiteral":18,"./PrimitiveLiteral":19,"./ReturnStmt":20,"./Statements":21,"./StaticMemberExp":22,"./UnaryOpExp":23,"./Variables":24,"./WhileStmt":25}],27:[function(require,module,exports){
var next = 1;
function iota() { return next++; }

module.exports = {
    ARRAY_LITERAL       : iota(),
    ASSIGN_EXP          : iota(),
    BIN_OP_EXP          : iota(),
    CALL_EXP            : iota(),
    COMPUTED_MEMBER_EXP : iota(),
    FUNCTION_DEF        : iota(),
    FUNCTION_INSTANCE   : iota(),
    FUNCTIONS           : iota(),
    IDENT               : iota(),
    IF_STMT             : iota(),
    LOGICAL_AND_EXP     : iota(),
    LOGICAL_OR_EXP      : iota(),
    OBJECT_LITERAL      : iota(),
    PRIMITIVE_LITERAL   : iota(),
    RETURN_STMT         : iota(),
    STATEMENTS          : iota(),
    STATIC_MEMBER_EXP   : iota(),
    UNARY_OP_EXP        : iota(),
    VARIABLES           : iota(),
    WHILE_STMT          : iota()
};
},{}],28:[function(require,module,exports){
var registry        = require('./lib/registry'),
    TraitBuilder    = require('./lib/TraitBuilder'),
    TraitInstance   = require('./lib/TraitInstance');

exports.register    = registry.register;
exports.make        = make;
exports.extend      = extend;

function make(traits, methods) {

    methods = methods || {};

    if (typeof methods === 'function') {
        methods = { __construct: methods };
    }

    var builder = new TraitBuilder(registry.expand(traits), methods);

    ctor = builder.__compile__();

    // FIXME: this is a total hack and should be destroyed
    // (only exists because some tests still rely on it)
    var namedTraits = Object.keys(builder._namedTraits);
    if (Object.freeze) {
        Object.freeze(namedTraits);
        ctor.prototype._traits = namedTraits;
    } else {
        Object.defineProperty(ctor.prototype, '_traits', {
            get: function() { return namedTraits.slice(0); }
        });
    }

    return ctor;

}

function extend(sup, traits, opts) {
    return make(sup.prototype._traits.concat(traits), opts);
}

require('./lib/builtins');
},{"./lib/TraitBuilder":29,"./lib/TraitInstance":30,"./lib/builtins":31,"./lib/registry":32}],29:[function(require,module,exports){
module.exports      = TraitBuilder;

var registry        = require('./registry'),
    TraitInstance   = require('./TraitInstance');

var nextInit = 1;

function makeChain(fns) {
    return function() {
        var args = arguments;
        fns.forEach(function(f) {
            f.apply(this, args);
        }, this);
    }
}

function TraitBuilder(traits, methods) {

    this._traits = [];
    this._methods = methods;
    
    this._namedTraits = {};
    this._initializers = [];
    this._chains = {};
    this._properties = {};

    traits.forEach(function(t) { add(this, t); }, this);
    
}

TraitBuilder.prototype.__compile__ = function() {

    this._traits.forEach(function(instance) {
        try {
            this._currentTrait = instance;
            instance.prepare(this);
        } finally {
            this._currentTrait = null;
        }
    }, this);

    this._traits.forEach(function(instance) {
        try {
            this._currentTrait = instance;
            instance.applyTo(this);
        } finally {
            this._currentTrait = null;
        }
    }, this);

    var ctor = this._methods.__construct;
    if (!ctor) {
        ctor = this.__generateConstructor__();
    }

    this._initializers.forEach(function(init) {
        ctor.prototype[init[0]] = init[1];
    });

    var ps = this._properties;
    Object.getOwnPropertyNames(ps).forEach(function(k) {
        Object.defineProperty(ctor.prototype, k, Object.getOwnPropertyDescriptor(ps, k));
    });

    for (var k in this._chains) {
        ctor.prototype[k] = makeChain(this._chains[k]);
    }

    for (var k in this._methods) {
        if (k === 'constructor') continue;
        ctor.prototype[k] = this._methods[k];
    }

    return ctor;

}

TraitBuilder.prototype.__generateConstructor__ = function() {
    
    // TODO: inspect all initializers, find max arity, and generate
    // explicit calls rather than using .apply()
    var source = (
        "(function() {\n" +
            this._initializers.map(function(i) {
                return "    this." + i[0] + ".apply(this, arguments);"
            }).join("\n") + "\n})"
    );

    return eval(source);

}

function add(self, traitDesc) {

    var trait, args, resolved;

    if (typeof traitDesc === 'string' || typeof traitDesc === 'function') {
        trait = traitDesc;
        args = [];
    } else if (Array.isArray(traitDesc)) {
        trait = traitDesc[0];
        args = traitDesc.slice(1);
    } else if (traitDesc && (typeof traitDesc === 'object')) {
        trait = traitDesc.trait;
        args = [traitDesc];
    }

    if (typeof trait !== 'string' && typeof trait !== 'function') {
        throw new Error("trait must be either string or function!");
    }

    var name        = (typeof trait === 'string') ? trait : null,
        resolved    = registry.get(trait);

    // don't add duplicate traits
    if (name && self._namedTraits[trait]) {
        return;
    }

    var instance = new TraitInstance(name, resolved, args);

    if (name) {
        self._namedTraits[trait] = instance;
    }

    self._traits.push(instance);
    
}

/*
 * Returns true if traitName has been added to this definition.
 */
TraitBuilder.prototype.has = function(traitName) {
    return traitName in this._namedTraits;
}

/*
 * Returns the TraitInstance associated with traitName.
 */
TraitBuilder.prototype.get = function(traitName) {
    return this._namedTraits[traitName];
}

/*
 * Added an initializer function to this definition.
 */
TraitBuilder.prototype.init = function(fn) {
    var name;
    if (this._currentTrait.name) {
        name = '__init_' + this._currentTrait.name.replace(/[^a-z0-9_]/ig, '_');
    } else {
        name = ('__init_$anonymous_' + (nextInit++));
    }
    this._initializers.push([name, fn]);
}

TraitBuilder.prototype.chain = function(name, fn, prepend) {
    var chain = this._chains[name] || (this._chains[name] = []);
    if (prepend) {
        chain.unshift(fn);
    } else {
        chain.push(fn);
    }
}

TraitBuilder.prototype.value = function(name, value) {
    this._properties[name] = value;
}

TraitBuilder.prototype.method = function(name, fn) {
    this._properties[name] = fn;
}

TraitBuilder.prototype.property = function(name, descriptor) {
    Object.defineProperty(this._properties, name, descriptor);
}

},{"./TraitInstance":30,"./registry":32}],30:[function(require,module,exports){
module.exports = TraitInstance;

function TraitInstance(name, trait, args) {
    
    if (args.length === 0) {
        args.push({});
    }

    this.name = name;
    this.trait = trait;
    this.args = args;

}

TraitInstance.prototype.hasOpt = function(opt) {
    return (typeof this.args[0] === 'object') && (opt in this.args[0]);
}

TraitInstance.prototype.setOpt = function(opt, value) {
    
    if (this.args.length === 0) {
        this.args.push({});
    }

    if (!(typeof this.args[0] === 'object')) {
        throw new Error("cannot set trait option - trait's first arg is not an object!");
    }

    this.args[0][opt] = value;

}

TraitInstance.prototype.prepare = function(builder) {
    if (this.trait.prepare) {
        this.trait.prepare.apply(null, [builder].concat(this.args));    
    }
}

TraitInstance.prototype.applyTo = function(builder) {
    this.trait.apply.apply(null, [builder].concat(this.args));
}
},{}],31:[function(require,module,exports){
var registry = require('./registry');

registry.register('meta', function(def) {

    def.method('hasTrait', function(trait) {
        return def.has(trait);
    });

    def.property('traitNames', {
        get: function() { return Object.keys(def._namedTraits); }
    });

});

registry.register('events', {
    
    requires: [],
    
    prepare: function(def) {

    },
    
    apply: function(def) {

        var slice = Array.prototype.slice;

        def.method('off', function(ev) {
        
            if (!this._eventHandlers) {
                return;
            }
            
            if (ev) {
                this._eventHandlers[ev] = [];
            } else if (!ev) {
                this._eventHandlers = {};
            }

        });

        def.method('on', function(ev, callback) {

            var hnds    = this._eventHandlers || (this._eventHandlers = {}),
                lst     = hnds[ev] || (hnds[ev] = []);

            lst.push(callback);

            var removed = false;
            return function() {
                if (!removed) {
                    lst.splice(lst.indexOf(callback), 1);
                    removed = true;
                }
            }

        });

        def.method('once', function(ev, callback) {
            
            var cancel = this.on(ev, function() {
                callback.apply(null, arguments);
                cancel();
            });

            return cancel;
        
        });

        def.method('emit', function(ev) {

            var args = null;

            var hnds = this._eventHandlers;
            if (!hnds) return;

            var lst = hnds[ev];
            if (lst) {
                args = slice.call(arguments, 1);
                for (var i = 0, l = lst.length; i < l; ++i) {
                    lst[i].apply(null, args);
                }
            }

            var cix = ev.lastIndexOf(':');
            if (cix >= 0) {
                if (args === null) {
                    args = slice.call(arguments, 1);
                }
                this.emitArray(ev.substring(0, cix), args);
            }

        });

        def.method('emitArray', function(ev, args) {

            var hnds = this._eventHandlers;
            if (!hnds) return;
            
            var lst = hnds[ev];
            if (lst) {
                for (var i = 0, l = lst.length; i < l; ++i) {
                    lst[i].apply(null, args);
                }
            }

            var cix = ev.lastIndexOf(':');
            if (cix >= 0) {
                this.emitArray(ev.substring(0, cix), args);
            }

        });

        def.method('emitAfter', function(delay, ev) {

            var self    = this,
                timer   = null,
                args    = slice.call(arguments, 2);

            timer = setTimeout(function() {
                self.emitArray(ev, args);
            }, delay);

            return function() { clearTimeout(timer); }

        });

        def.method('emitEvery', function(interval, ev) {

            var self    = this,
                timer   = null,
                args    = slice.call(arguments, 2);

            var timer = setInterval(function() {
                self.emitArray(ev, args);
            }, delay);

            return function() { clearInterval(timer); }

        });

    }
    
});

registry.register('methods', function(def) {

    def.method('boundMethod', function(method) {
        return this[method].bind(this);
    });

    def.method('lazyMethod', function(method) {
        var self = this;
        return function() {
            return self[method].apply(self, arguments);
        }
    });

});
},{"./registry":32}],32:[function(require,module,exports){
exports.get = get;
exports.register = register;
exports.expand = expand;

var REGISTRY = {};

function makeTrait(trait) {

    if (typeof trait === 'function') {
        trait = { apply: trait };
    }

    if (!(typeof trait === 'object')) {
        throw new Error("trait must be object");
    }

    if (typeof trait.apply !== 'function') {
        throw new Error("trait must contain an 'apply' function");
    }

    return trait;

}

function get(trait) {
    if (typeof trait === 'string') {
        if (trait in REGISTRY) {
            return REGISTRY[trait];    
        } else {
            throw new Error("unknown trait name: " + trait);    
        }
    } else {
        return makeTrait(trait);
    }
}

function register(trait, cb) {

    // duplicate check
    if (trait in REGISTRY) {
        throw new Error("duplicate trait: " + trait);

    // array is an expansion; just store it
    } else if (Array.isArray(cb)) {
        REGISTRY[trait] = cb;

    // otherwise coerce cb into a trait object
    } else {
        REGISTRY[trait] = makeTrait(cb);

    }

}

function expand_r(trait, collector) {
    if (typeof trait === 'string') {
        var impl = get(trait);
        if (Array.isArray(impl)) {
            impl.forEach(function(t) {
                expand_r(t, collector);
            });
        } else {
            if (impl.requires) {
                impl.requires.forEach(function(r) {
                    expand_r(r, collector);
                });
            }
            collector.push(trait);
        }
    } else {
        collector.push(trait);
    }
}

function expand(traits) {
    var expanded = [];
    traits.forEach(function(t) {
        expand_r(t, expanded);
    });
    return expanded;
}
},{}],33:[function(require,module,exports){
module.exports = require('./lib/runtime/types');
},{"./lib/runtime/types":27}]},{},[1])