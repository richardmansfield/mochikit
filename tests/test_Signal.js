if (typeof(dojo) != 'undefined') { dojo.require('MochiKit.Signal'); }
if (typeof(JSAN) != 'undefined') { JSAN.use('MochiKit.Signal'); }
if (typeof(tests) == 'undefined') { tests = {}; }

tests.test_Signal = function (t) {
    
    var hasNoSignals = {};
    
    var hasSignals = {someVar: 1};

    var i = 0;
        
    var aFunction = function() {
        i++;
        if (typeof(this.someVar) != 'undefined') {
            i += this.someVar;
        }
    };
    
    var aObject = {};
    aObject.aMethod = function() {
        i++;
    };
    
    aObject.bMethod = function() {
        i++;
    };
    
    var bObject = {};
    bObject.bMethod = function() {
        i++;
    };


    connect(hasSignals, 'signalOne', aFunction);
    signal(hasSignals, 'signalOne');
    t.is(i, 2, 'Connecting function');

    disconnect(hasSignals, 'signalOne', aFunction);
    signal(hasSignals, 'signalOne');
    t.is(i, 2, 'Disconnecting function');


    connect(hasSignals, 'signalOne', aObject, aObject.aMethod);
    signal(hasSignals, 'signalOne');
    t.is(i, 3, 'Connecting obj-function');

    disconnect(hasSignals, 'signalOne', aObject, aObject.aMethod);
    signal(hasSignals, 'signalOne');
    t.is(i, 3, 'Disconnecting obj-function');


    connect(hasSignals, 'signalTwo', aObject, 'aMethod');
    signal(hasSignals, 'signalTwo');
    t.is(i, 4, 'Connecting obj-string');

    disconnect(hasSignals, 'signalTwo', aObject, 'aMethod');
    signal(hasSignals, 'signalTwo');
    t.is(i, 4, 'Disconnecting obj-string');


    var shouldRaise = function() { return undefined.attr; };

    try {
        connect(hasSignals, 'signalOne', shouldRaise);
        signal(hasSignals, 'signalOne');
        t.ok(false, 'An exception was not raised');
    } catch (e) {
        t.ok(true, 'An exception was raised');
    }
    disconnect(hasSignals, 'signalOne', shouldRaise);

    
    connect('submit', 'onclick', aFunction);
    MochiKit.DOM.getElement('submit').click();
    t.is(i, 5, 'HTML onclick event can be connected to a function');

    disconnect('submit', 'onclick', aFunction);
    MochiKit.DOM.getElement('submit').click();
    t.is(i, 5, 'HTML onclick can be disconnected from a function');


    var submit = MochiKit.DOM.getElement('submit');

    connect(submit, 'onclick', aFunction);
    submit.click();
    t.is(i, 6, 'Checking that a DOM element can be connected to a function');

    disconnect(submit, 'onclick', aFunction);
    submit.click();
    t.is(i, 6, '...and then disconnected');


    connect(hasSignals, 'signalOne', aObject, 'aMethod');
    connect(hasSignals, 'signalOne', aObject, 'bMethod');
    signal(hasSignals, 'signalOne');
    t.is(i, 8, 'Connecting one signal to two slots in one object');
    
    disconnect(hasSignals, 'signalOne', aObject, 'aMethod');
    disconnect(hasSignals, 'signalOne', aObject, 'bMethod');
    signal(hasSignals, 'signalOne');
    t.is(i, 8, 'Disconnecting one signal from two slots in one object');


    connect(hasSignals, 'signalOne', aObject, 'aMethod');
    connect(hasSignals, 'signalOne', bObject, 'bMethod');
    signal(hasSignals, 'signalOne');
    t.is(i, 10, 'Connecting one signal to two slots in two objects');

    disconnect(hasSignals, 'signalOne', aObject, 'aMethod');
    disconnect(hasSignals, 'signalOne', bObject, 'bMethod');
    signal(hasSignals, 'signalOne');
    t.is(i, 10, 'Disconnecting one signal from two slots in two objects');
    

    try {
        connect('submit', 'onclick', null);
        submit.click();
        t.ok(false, 'An exception was not raised when connecting null');
    } catch (e) {
        t.ok(true, 'An exception was raised when connecting null');
    }
    try {
        disconnect('submit', 'onclick', null);
        t.ok(false, 'An exception was not raised when disconnecting null');
    } catch (e) {
        t.ok(true, 'An exception was raised when disconnecting null');
    }
    
    
    try {
        connect(nothing, 'signalOne', aObject, 'aMethod');
        signal(nothing, 'signalOne');
        t.ok(false, 'An exception was not raised when connecting undefined');
    } catch (e) {
        t.ok(true, 'An exception was raised when connecting undefined');
    }
    try {
        disconnect(nothing, 'signalOne', aObject, 'aMethod');
        t.ok(false, 'An exception was not raised when disconnecting undefined');
    } catch (e) {
        t.ok(true, 'An exception was raised when disconnecting undefined');
    }
    
    
    try {
        connect(hasSignals, 'signalOne', nothing);
        signal(hasSignals, 'signalOne');
        t.ok(false, 'An exception was not raised when connecting an undefined function');
    } catch (e) {
        t.ok(true, 'An exception was raised when connecting an undefined function');
    }
    try {
        disconnect(hasSignals, 'signalOne', nothing);
        t.ok(false, 'An exception was not raised when disconnecting an undefined function');
    } catch (e) {
        t.ok(true, 'An exception was raised when disconnecting an undefined function');
    }
    
    
    try {
        connect(hasSignals, 'signalOne', aObject, aObject.nothing);
        signal(hasSignals, 'signalOne');
        t.ok(false, 'An exception was not raised when connecting an undefined method');
    } catch (e) {
        t.ok(true, 'An exception was raised when connecting an undefined method');
    }
    try {
        disconnect(hasSignals, 'signalOne', aObject, aObject.nothing);
        t.ok(false, 'An exception was not raised when disconnecting an undefined method');
    } catch (e) {
        t.ok(true, 'An exception was raised when disconnecting an undefined method');
    }
    
    try {
        connect(hasSignals, 'signalOne', aObject, 'nothing');
        signal(hasSignals, 'signalOne');
        t.ok(false, 'An exception was not raised when connecting an undefined method (as string)');
    } catch (e) {
        t.ok(true, 'An exception was raised when connecting an undefined method (as string)');
    }
    try {
        disconnect(hasSignals, 'signalOne', aObject, 'nothing');
        t.ok(false, 'An exception was not raised when disconnecting an undefined method (as string)');
    } catch (e) {
        t.ok(true, 'An exception was raised when disconnecting an undefined method (as string)');
    }
            
    if (MochiKit.DOM.getElement('submit').fireEvent || 
        (document.createEvent && 
        (typeof(document.createEvent('MouseEvents').initMouseEvent) == 'function'))) {
        
        /* 
        
            Adapted from: 
            http://www.devdaily.com/java/jwarehouse/jforum/tests/selenium/javascript/htmlutils.js.shtml
            License: Apache
            Copyright: Copyright 2004 ThoughtWorks, Inc
            
        */
        var triggerMouseEvent = function(element, eventType, canBubble) {
            element = MochiKit.DOM.getElement(element);
            canBubble = (typeof(canBubble) == 'undefined') ? true : canBubble;
            if (element.fireEvent) {
                var newEvt = document.createEventObject();
                newEvt.clientX = 1;
                newEvt.clientY = 1;
                newEvt.button = 1;
                element.fireEvent('on' + eventType, newEvt);
            } else if (document.createEvent && (typeof(document.createEvent('MouseEvents').initMouseEvent) == 'function')) {
                var evt = document.createEvent('MouseEvents');
                evt.initMouseEvent(eventType, canBubble, true, // event, bubbles, cancelable
                    document.defaultView, 1, // view, # of clicks
                    1, 0, 0, 0, // screenX, screenY, clientX, clientY
                    false, false, false, false, // ctrlKey, altKey, shiftKey, metaKey
                    0, null); // buttonCode, relatedTarget
                element.dispatchEvent(evt);
            }
        };

        var eventTest = function(e) {
            i++;
            t.ok((typeof(e.event()) === 'object'), 'checking that event() is an object');
            t.ok((typeof(e.type()) === 'string'), 'checking that type() is a string');
            t.ok((e.target() === MochiKit.DOM.getElement('submit')), 'checking that target is "submit"');
            t.ok((typeof(e.modifier()) === 'object'), 'checking that modifier() is an object');
            t.ok(e.modifier().alt === false, 'checking that modifier().alt is defined, but false');
            t.ok(e.modifier().ctrl === false, 'checking that modifier().ctrl is defined, but false');
            t.ok(e.modifier().meta === false, 'checking that modifier().meta is defined, but false');
            t.ok(e.modifier().shift === false, 'checking that modifier().shift is defined, but  false');
            t.ok((typeof(e.mouse()) === 'object'), 'checking that mouse() is an object');
            t.ok((typeof(e.mouse().button) === 'object'), 'checking that mouse().button is an object');
            t.ok(e.mouse().button.left === true, 'checking that mouse().button.left is true');
            t.ok(e.mouse().button.middle === false, 'checking that mouse().button.middle is false');
            t.ok(e.mouse().button.right === false, 'checking that mouse().button.right is false');
            t.ok((typeof(e.mouse().page) === 'object'), 'checking that mouse().page is an object');
            t.ok((typeof(e.mouse().page.x) === 'number'), 'checking that mouse().page.x is a number');
            t.ok((typeof(e.mouse().page.y) === 'number'), 'checking that mouse().page.y is a number');
            t.ok((typeof(e.mouse().client) === 'object'), 'checking that mouse().client is an object');
            t.ok((typeof(e.mouse().client.x) === 'number'), 'checking that mouse().client.x is a number');
            t.ok((typeof(e.mouse().client.y) === 'number'), 'checking that mouse().client.y is a number');

            /* these should not be defined */
            t.ok((typeof(e.relatedTarget()) === 'undefined'), 'checking that relatedTarget() is undefined');
            t.ok((typeof(e.key()) === 'undefined'), 'checking that key() is undefined');
        };

        
        connect('submit', 'onmousedown', eventTest);
        triggerMouseEvent('submit', 'mousedown', false);
        t.is(i, 11, 'Connecting an event to an HTML object and firing a synthetic event');

        disconnect('submit', 'onmousedown', eventTest);
        triggerMouseEvent('submit', 'mousedown', false);
        t.is(i, 11, 'Disconnecting an event to an HTML object and firing a synthetic event');
        
    }    
};