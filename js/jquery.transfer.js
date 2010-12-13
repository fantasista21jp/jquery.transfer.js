/*
 * jQuery transfer (jQuery Plugin)
 *
 * Copyright (c) 2010 Tom Shimada
 *
 * Depends Script:
 *	jquery.js (1.3.2)
 *	[use sortable] ui.core.js
 *	[use sortable] ui.sortable.js
 */

(function($) {
  $.fn.transfer = function(configs) {
    var defaults = {
          join: null,
          list: null,
          addButton: '.transfer-button-add',
          removeButton: '.transfer-button-remove',
          action: 'click',
          moveSpeed: 300,
          moveEasing: 'swing',
          alphaSpeed: 400,
          alphaEasing: 'swing',
          addCheckFunc: function(){ return true; },
          addBeforeFunc: null,
          addFunc: null,
          addAfterFunc: null,
          removeCheckFunc: function(){ return true; },
          removeBeforeFunc: null,
          removeFunc: null,
          removeAfterFunc: null,
          sortable: false,
          sortableStartFunction: null,
          sortableUpdateFunction: null
        };
    if (!configs) return;
    configs = $.extend(defaults, configs);
    configs.transfer = this;
    if (typeof(configs.transfer) !== 'object' || configs.transfer.length !== 1) return;
    if (typeof(configs.join) !== 'object' || configs.join.length !== 1) return;
    configs.$transfers = $(configs.list, configs.transfer);
    configs.$joins = $(configs.list, configs.join);

    $(configs.addButton, configs.$transfers).live(configs.action, function(){
      var $button = $(this),
          $item = $button.closest(configs.list);
      var checkFunc = configs.addCheckFunc($item, $button);
      if (checkFunc !== true) return;
      if ($.isFunction(configs.addBeforeFunc)) configs.addBeforeFunc($item, $button);
      var $clone = $item.clone().appendTo(configs.join).css({opacity: 0});
      if ($.isFunction(configs.addFunc)) configs.addFunc($item, $button, $clone);
      var moveSpeed = configs.moveSpeed;
      var scrollPosition = configs.join.attr('scrollHeight') > configs.join.attr('clientHeight') ? configs.join.attr('scrollHeight') : 0;
      if (scroll === 0) {
        moveSpeed = 0;
      }
      configs.join.animate(
        {scrollTop: scrollPosition},
        moveSpeed,
        configs.moveEasing,
        function() {
          $clone.animate(
            {opacity: 1},
            configs.alphaSpeed,
            configs.alphaEasing,
            function() {
//              setSortable();
              $clone.css({opacity: ''});
              if ($.isFunction(configs.addAfterFunc)) configs.addAfterFunc($item, $button, $clone);
            }
          );
        }
      );
    });

    $(configs.removeButton, configs.$joins).live(configs.action, function(){
      var $button = $(this),
          $clone = $button.closest(configs.list);
      var checkFunc = configs.removeCheckFunc($clone, $button);
      if (checkFunc !== true) return;
      if ($.isFunction(configs.removeBeforeFunc)) configs.removeBeforeFunc($clone, $button);
      $clone.css({opacity: 1}).animate(
        {opacity: 0},
        configs.alphaSpeed,
        configs.alphaEasing,
        function() {
          $clone.remove();
          if ($.isFunction(configs.removeAfterFunc)) configs.removeAfterFunc($clone, $button);
        }
      );
    });

    setSortable();

    function setSortable() {
      if (!configs.sortable) {
        return;
      }
      configs.join.sortable('destroy').sortable({
        connectWith: configs.join,
        containment: 'document',
        delay: 10,
        items: configs.list,
        revert: false,
        start: function(e, ui) {
          if ($.isFunction(configs.sortableStartFunction)) configs.sortableStartFunction(e, ui);
        },
        update: function(e, ui) {
          if ($.isFunction(configs.sortableUpdateFunction)) configs.sortableUpdateFunction(e, ui);
        }
      });
    }

    return this;
  }
})(jQuery);
