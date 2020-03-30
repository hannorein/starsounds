/*

*/

define([
  "jquery",
  "base/js/namespace",
  "require",
], function ($, Jupyter, requirejs) {
  "use strict";

  var current_time = function() {
    return new Date().getTime() / 1000;
  };

  var start_time = current_time();
  var audio = new Audio();
  var newcell = false; 
  var enabled = false;

  var add_permissions_list = function () {
    var ipython_toolbar = $('#maintoolbar-container');
    var label = $('<span/>').addClass("navbar-text permissions-list").text('StarSound:');
    var select = $('<select/>')
                  .attr('id', 'permissions-select')
                  .attr('class', 'permissions-list form-control select-xs')
                  .append($('<option/>')
                  .attr('value', 'Disabled')
                  .text('Disabled'));
    ipython_toolbar.append(label).append(select);
    select.change(function() {
      var val = $(this).val();
      //if (val == 'Disabled') 
    });
    // Options give the minimum kernel busy time in seconds after which a notification is displayed
    var presets = [0, 5, 10, 30];
    for (var i=0; i<presets.length; i++) {
      var name = presets[i];
      select.append($('<option/>').attr('value', name).text(name));
    }
  };

  var add_starsound_button = function () {
    if ($("#starsound-button").length === 0) {
      $(Jupyter.toolbar.add_buttons_group([
        Jupyter.keyboard_manager.actions.register ({
          'help'   : 'Enable Sound',
          'icon'   : 'fa-rocket',
          'handler': ask_permission,
        },'enable-sound', 'notify')
      ])).find('.btn').attr('id', 'starsound-button');
    }
  };

  var ask_permission = function () {
      var button = $('#starsound-button').find("i").toggleClass("fa-rocket").toggleClass("fa-volume-up");
      if (enabled == true){
          enabled = false;
      }else{
          enabled = true;
          audio.src = requirejs.toUrl("./computerbeep_1.mp3");
          audio.play();
      }
      //add_permissions_list();
  };

  var notify = function () {
  };

  var load_ipython_extension = function () {
    console.info('Starting StarSound.');

    return Jupyter.notebook.config.loaded.then(function() {
        add_starsound_button();
        $([Jupyter.events]).on('kernel_starting.Kernel',function () {
        });
        
        $([Jupyter.events]).on('edit_mode.Cell',function () {
          if (newcell == true){
              newcell = false;
          }else{
              if (enabled == true){
                  audio.src = requirejs.toUrl("./computerbeep_11.mp3");
                  audio.play();
              }
          }
        });
        $([Jupyter.events]).on('select.Cell',function () {
          if (newcell == true){
              newcell = false;
          }else{
              if (enabled == true){
                  audio.src = requirejs.toUrl("./computerbeep_13.mp3");
                  audio.play();
              }
          }
        });
        $([Jupyter.events]).on('create.Cell',function () {
          if (enabled == true){
              audio.src = requirejs.toUrl("./computerbeep_31.mp3");
              audio.play();
          }
          newcell = true;
        });
        $([Jupyter.events]).on('delete.Cell',function () {
          if (enabled == true){
              audio.src = requirejs.toUrl("./computerbeep_20.mp3");
              audio.play();
          }
        });

        $([Jupyter.events]).on('kernel_busy.Kernel',function () {
          if (enabled == true){
            audio.src = requirejs.toUrl("./computerbeep_4.mp3");
            audio.play();
          }
        });

        $([Jupyter.events]).on('kernel_idle.Kernel',function () {
          if (enabled == true){
            audio.src = requirejs.toUrl("./computerbeep_25.mp3");
            audio.play();
          }
        });
    });
  };

  return {
    load_ipython_extension : load_ipython_extension
  };

});
