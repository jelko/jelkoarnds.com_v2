"use strict";
define(['jquery', 'cookie'], function ($, CookieController) {
	var ClickThroughController = {
		'COOKIE_NAME': 'click-through-state',
		'default_state': {},
		'init': function (){
			// make sure every non-on element is "off"
			//$(".click-through").find("[id]:not(.on)").addClass("off");
			this.default_state = this.getState();
			this.loadState();
			var self = this;

			$('a[data-opens]:not(.clicked)').click(function() {
				var openedby = $(this).attr('data-opens');
				$('[id="' + openedby +'"]').removeClass('off').addClass('on');
				$(this).addClass('clicked');
				$("#reset").removeClass('off').addClass('on');
			});

			$('a[data-closes]:not(.clicked)').click(function() {
				var closedby = $(this).attr('data-closes');
				$('[id="' + closedby +'"]').removeClass('on').addClass('off');
				$(this).addClass('clicked');
			});
			$('.click-through a:not(.clicked)').click(function(){self.saveState()});

			$('#reset-btn').click(function(){
				self.resetState();
				window.location.reload();
			});

      $("body").addClass("loaded").removeClass("unloaded");
      $(".click-through").removeClass("hidden");
		},
		'getState': function(){
			var state = {
				'on': [],
				'off': [],
				'clicked': []
			}
			state.on = this.getIdsForClass('on');
			state.off = this.getIdsForClass('off');
			state.clicked = this.getIdsForClass('clicked');
			return state;
		},
		'getIdsForClass': function(class_name){
			var ids = [];
			$(".click-through").find("." + class_name + "[id]").each(function(){ids.push(this.id)});
			return ids;
		},
		'resetState': function(){
			CookieController.setCookie(this.COOKIE_NAME, "", 24*365);
		},
		'saveState': function(){
			var state = this.getState();
			CookieController.setCookie(this.COOKIE_NAME, JSON.stringify(state), 24*365)
		},
		'loadState': function(){
			try{
				var cookie_str = CookieController.getCookie(this.COOKIE_NAME);
				var cookie = JSON.parse(cookie_str);
				var unchanged = true;
				cookie.on.forEach(function(e){$(document.getElementById(e)).removeClass('off').addClass('on'); unchanged = false;});
				cookie.off.forEach(function(e){$(document.getElementById(e)).removeClass('on').addClass('off'); unchanged = false;});
				cookie.clicked.forEach(function(e){$(document.getElementById(e)).addClass('clicked'); unchanged = false;});
				if(!unchanged)
					$("#reset").removeClass('off').addClass('on');
			}catch(e){
				console.warn("state not loaded");
				//this.saveState();
			}
		}
	}.init();
});
