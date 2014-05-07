var steptoe     = require('steptoe');
var Collection  = require('./Collection');
var C           = require('./controllers');
var Toolbar     = require('./Toolbar');
var types       = require('./types');

var UI = module.exports = function() {

    var $env            = steptoe.createEnv();
    var functionEditors = new Collection();
    var audioContext    = require('audio-context');

    var transport = {
        running     : false
    };

    var main = {
        toolbar     : new Toolbar(document.querySelector('#toolbar'))
    };

    var env = {
        toolbar     : new Toolbar(document.querySelector('#env .toolbar'))
    }

    var io = {
        registry    : new Collection(),
        active      : new Collection(),
        toolbar     : new Toolbar(document.querySelector('#io .toolbar'))
    };

    //
    // Helpers

    function isValidKey(key) {
        return key.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) && !$env.has(key);
    }

    function isNativeFunctionInstance(obj) {
        return obj && !!obj.steptoeFunctionInstance;
    }

    // Transport

    function reset() {
        stop();
    }

    function stop() {
        transport.running = false;
    }

    function start() {
        if (transport.running) {
            return;
        }
    }

    main.toolbar.addButton({
        icon: 'repeat',
        className: 'reset',
        callback: reset
    });

    main.toolbar.addButton({
        icon: 'stop',
        className: 'pause',
        callback: stop
    });

    main.toolbar.addButton({
        icon: 'play',
        className: 'play',
        callback: start
    });

    //
    // Env toolbar

    function showEnvMenu() {
        
        if (env.menu) return;

        var $bubble = $('<div class="bubble"><div class="inner block-menu"></div></div>');
        var $inner = $bubble.find('.inner');

        $inner.append("<a data-type='function' class='type function active' href='#'>&lambda;</a>");
        $inner.append("<a data-type='image' class='type image' href='#'><i class='fa fa-picture-o'></i></a>");
        $inner.append("<a data-type='sound' class='type sound' href='#'><i class='fa fa-volume-up'></i></a>");
        $inner.append("<div class='name-input'><input type='text' placeholder='Key'> <a href='#' class='submit'>Go</a></div>");

        var type = 'function';

        function submit() {
            var type = $types.filter('.active').attr('data-type');
            var name = $input.val();
            if (isValidKey(name)) {
                if (type === 'function') {
                    var fn = steptoe.createFunction();
                    fn.setName(name);
                    $env.def(name, fn.createInstance());
                } else if (type === 'image') {
                    $env.def(name, new types.Image());
                } else if (type === 'sound') {
                    $env.def(name, new types.Sound());
                }
                cancel(true);
            } else {
                $bubble.stop().css({marginLeft: 0});
                for (var i = 0; i < 3; ++i) {
                    $bubble.animate({marginLeft: -10}, 50);
                    $bubble.animate({marginLeft: 10}, 50);
                }
                $bubble.animate({marginLeft: 0}, 50);
            }
        }

        var $types = $inner.find('.type');
        $types.click(function() {
            $types.removeClass('active');
            this.classList.add('active');
        });

        var $input = $inner.find('input[type=text]');
        $input.keydown(function(evt) {
            if (evt.which === 13) {
                submit();
            }
        });

        $inner.find('a.submit').click(submit);
        
        $bubble.css({
            top: 100,
            left: 100
        });

        $bubble.hide().appendTo(document.body).fadeIn(100, function() {
            $input.focus();
        });

        env.menu = $bubble;

        //
        // CancellatioN!

        function cancel(evt) {
            if (env.menu && (evt === true || $(evt.target).closest('.bubble').length == 0)) {
                env.menu.fadeOut(100, function() {
                    env.menu.remove();
                    env.menu = null;
                });
                document.body.removeEventListener('click', cancel, true);
            }
        }

        document.body.addEventListener('click', cancel, true);

    }

    env.toolbar.addButton({
        icon: 'plus',
        className: 'add',
        callback: function() {
            showEnvMenu();
        }
    });

    //
    // Handlers for root env

    function envControllerForThing(name, thing) {
        if (typeof thing === 'function') {
            return new C.EnvForeignFunctionController(name, thing);
        } else if (thing instanceof types.Sound) {
            return new C.EnvSoundController(name, thing);
        } else if (thing instanceof types.Image) {
            return new C.EnvImageController(name, thing);
        } else if (isNativeFunctionInstance(thing)) {
            return new C.EnvFunctionController(name, thing);
        } else {
            return null;
        }
    }

    $env.on('define', function(thisEnv, key, value) {
        
        var controller = envControllerForThing(key, value);
        
        var root = controller.getRoot();
        root.addClass('out');

        var $newNode = $('<li/>')
                            .append(root)
                            .attr('data-env-key', key);

        var $lis = $('#env .env li');
        var inserted = false;

        $lis.each(function(ix) {
            var thatKey = this.getAttribute('data-env-key');
            if (!inserted && key < thatKey) {
                $newNode.insertBefore(this);
                inserted = true;
            }
        });

        if (!inserted) {
            $('#env .env').append($newNode);
        }

        setTimeout(function() {
            root.removeClass('out');
        }, 0);

    });

    $env.on('undefine', function(thisEnv, key, value) {
        $('#env .env li[data-env-key="' + key + '"]').remove();
    });

    $env.on('set', function(thisEnv, key, value) {
        
    });

    $env.on('rename', function(thisEnv, oldKey, newKey, value) {

    });

    //
    // UI handlers

    // $('#add-io').click(function() {

    // });


    $('#env .env').on('click', '.expander', function(evt) {
        var $item = $(this).closest('.item');
        if ($item.is('.expanded')) {
            $('i', this).removeClass('fa-rotate-180');
            $item.removeClass('expanded');
            $item.find('.content').slideUp();
        } else {
            $('i', this).addClass('fa-rotate-180');
            $item.addClass('expanded');
            $item.find('.content').slideDown();
        }
    });

    $('#env .env').on('click', '.edit', function(evt) {
        evt.preventDefault();
        var $wrapper = $(this).closest('li');
        var key = $wrapper.attr('data-env-key');
        var obj = $env.get(key);
        if (isNativeFunctionInstance(obj)) {
            editFunction(obj);
        }
    });

    //
    // IO toolbar

    function addIO(ioSpec) {
        var theIO = ioSpec.create($env);

        theIO.on('destroyed', function() {
            io.active.remove(theIO);
        });

        io.active.add(theIO);
    }

    io.registry.on('change:add', function(evt) {

        var newIO = evt.item;
        
        var button = io.toolbar.addButton({
            icon        : newIO.icon,
            title       : newIO.name,
            className   : newIO.className,
            callback    : function() {
                addIO(newIO);
            }
        });

    });

    io.active.on('change:add', function(evt) {
        $('#io .track-contents').append($('<li></li>').append(evt.item.el));
    });

    io.active.on('change:remove', function(evt) {

        var theIO = evt.item;

        $('#io .track-contents li').each(function() {
            if (this.childNodes[0].ioInstance === theIO) {
                this.parentNode.removeChild(this);
            }
        });
    });

    //
    // IO track

    $('#io .track-contents').on('click', '.io-instance .destroy', function() {
        $(this).closest('.io-instance')[0].ioInstance.destroy();
    });

    //
    // Set up default IO

    io.registry.add(require('./io/audio'));
    io.registry.add(require('./io/canvas'));
    io.registry.add(require('./io/console'));
    
    //
    // Add some stuff

     var fn = steptoe.createFunction();
     fn.setName("test_function");
     $env.def("test_function", fn.createInstance());

}