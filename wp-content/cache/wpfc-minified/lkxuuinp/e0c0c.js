jQuery(function(r){if("undefined"==typeof wc_cart_fragments_params)return!1;var t=!0,n=wc_cart_fragments_params.cart_hash_key;try{t="sessionStorage"in window&&null!==window.sessionStorage,window.sessionStorage.setItem("wc","test"),window.sessionStorage.removeItem("wc"),window.localStorage.setItem("wc","test"),window.localStorage.removeItem("wc")}catch(f){t=!1}function a(){t&&sessionStorage.setItem("wc_cart_created",(new Date).getTime())}function s(e){t&&(localStorage.setItem(n,e),sessionStorage.setItem(n,e))}var o={url:wc_cart_fragments_params.wc_ajax_url.toString().replace("%%endpoint%%","get_refreshed_fragments"),type:"POST",data:new URLSearchParams({time:(new Date).getTime()}).toString(),timeout:wc_cart_fragments_params.request_timeout,success:function(e){e&&e.fragments&&(r.each(e.fragments,function(e,t){r(e).replaceWith(t)}),t&&(sessionStorage.setItem(wc_cart_fragments_params.fragment_name,JSON.stringify(e.fragments)),s(e.cart_hash),e.cart_hash&&a()),r(document.body).trigger("wc_fragments_refreshed"))},error:function(){r(document.body).trigger("wc_fragments_ajax_error")}};function i(){const e=new AbortController,t=setTimeout(()=>e.abort(),o.timeout);window.fetch(o.url,{method:o.type,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:o.data,signal:e.signal}).then(e=>{if(clearTimeout(t),e.ok)return e.json();throw new Error(e.statusText)}).then(o.success)["catch"](e=>o.error())}if(t){var e=null;r(document.body).on("wc_fragment_refresh updated_wc_div",function(){i()}),r(document.body).on("added_to_cart removed_from_cart",function(e,t,r){var o=sessionStorage.getItem(n);null!==o&&o!==undefined&&""!==o||a(),sessionStorage.setItem(wc_cart_fragments_params.fragment_name,JSON.stringify(t)),s(r)}),r(document.body).on("wc_fragments_refreshed",function(){clearTimeout(e),e=setTimeout(i,864e5)}),r(window).on("storage onstorage",function(e){n===e.originalEvent.key&&localStorage.getItem(n)!==sessionStorage.getItem(n)&&i()}),r(window).on("pageshow",function(e){e.originalEvent.persisted&&(r(".widget_shopping_cart_content").empty(),r(document.body).trigger("wc_fragment_refresh"))});try{var c=JSON.parse(sessionStorage.getItem(wc_cart_fragments_params.fragment_name)),m=sessionStorage.getItem(n),_=Cookies.get("woocommerce_cart_hash"),g=sessionStorage.getItem("wc_cart_created");if(null!==m&&m!==undefined&&""!==m||(m=""),null!==_&&_!==undefined&&""!==_||(_=""),m&&(null===g||g===undefined||""===g))throw"No cart_created";if(g){var d=+g+864e5,w=(new Date).getTime();if(d<w)throw"Fragment expired";e=setTimeout(i,d-w)}if(!c||!c["div.widget_shopping_cart_content"]||m!==_)throw"No fragment";r.each(c,function(e,t){r(e).replaceWith(t)}),r(document.body).trigger("wc_fragments_loaded")}catch(f){i()}}else i();0<Cookies.get("woocommerce_items_in_cart")?r(".hide_cart_widget_if_empty").closest(".widget_shopping_cart").show():r(".hide_cart_widget_if_empty").closest(".widget_shopping_cart").hide(),r(document.body).on("adding_to_cart",function(){r(".hide_cart_widget_if_empty").closest(".widget_shopping_cart").show()}),"undefined"!=typeof wp&&wp.customize&&wp.customize.selectiveRefresh&&wp.customize.widgetsPreview&&wp.customize.widgetsPreview.WidgetPartial&&wp.customize.selectiveRefresh.bind("partial-content-rendered",function(){i()})});