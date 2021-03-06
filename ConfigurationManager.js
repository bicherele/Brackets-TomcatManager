/*
 * Copyright (c) 2013 Miguel Castillo.
 *
 * Licensed under MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

define(function(require, exports, module) {
    "use strict";

    var ProjectFiles = require('ProjectFiles');
    var ConfigurationManager = {}, configurations = {}, _ready = $.Deferred();


    function projectOpenDone( config ) {
        configurations = JSON.parse(config);
        $(ConfigurationManager).trigger("load", [configurations]);
    }

    function projectOpenFailed() {
        configurations = {};
        $(ConfigurationManager).trigger("load", [configurations]);
    }


    // Project settings for tomcat
    $(ProjectFiles).on("projectOpen", function() {
        _ready.resolve(ConfigurationManager);
        $(ConfigurationManager).trigger("unload", [configurations]);

        ProjectFiles.openFile( ".tomcat-manager" )
            .done(function( fileReader ) {
                fileReader.readAsText()
                .done(projectOpenDone)
                .fail(projectOpenFailed);
            })
            .fail(projectOpenFailed);
    });


    ConfigurationManager.ready = _ready.promise().done;


    ConfigurationManager.getConfigurations = function( ) {
        return configurations;
    };


    ConfigurationManager.addAppServer = function ( appServer ) {
    };


    ConfigurationManager.removeAppServer = function ( appServer ) {
    };


    ConfigurationManager.addServer = function( server ) {
    };


    ConfigurationManager.removeSever = function( server ) {
    };


    ConfigurationManager.getServers = function() {
        var result = [];
        var servers = (configurations.Servers || {});
        for ( var iServer in servers ) {
            if ( !servers.hasOwnProperty(iServer) ) {
                continue;
            }

            result.push(ConfigurationManager.getServerDetails(iServer));
        }

        return result;
    };


    ConfigurationManager.getServerDetails = function( serverName ) {
        var server = (configurations.Servers || {})[serverName] || false;
        var appServers = configurations.AppServers || {};

        if ( appServers.hasOwnProperty(server.AppServer) ) {
            var appServer = $.extend({
                "name": server.AppServer
            }, appServers[server.AppServer]);
            return $.extend({name: serverName}, server, {"AppServer": appServer});
        }

        return server;
    };


    return ConfigurationManager;
});
