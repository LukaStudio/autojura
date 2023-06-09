(function ($) {
    $.fn.hScroll = function (amount) {
        amount = amount || 120;
        $(this).on("DOMMouseScroll mousewheel", function (event) {
            var oEvent = event.originalEvent,
                direction = oEvent.detail ? oEvent.detail * -amount : oEvent.wheelDelta,
                position = $(this).scrollLeft();
            position += direction > 0 ? -amount : amount;
            $(this).scrollLeft(position);
            event.preventDefault();
        })
    };

    $(document).ready(function () {
        $('.ju-horizontal-tabs').hScroll(60);

        $('.open-popup-posts-list').magnificPopup({
            type:'inline',
            midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
        });

        $('.open-popup-posts-list').on('click', function () {
            var category_id  = $(this).data('category');
            var slug  = $(this).data('slug');
            if (typeof category_id === "undefined") {
                return;
            }

            $('#open-popup-posts-list-'+category_id+' .list_posts_sitemap').html('');
            $('.img-links-loader').show();

            $('.list_posts_sitemap .img-links-loader').show();
            $.ajax({
                url: wpms_localize.ajax_url,
                type: 'POST',
                dataType: 'json',
                data: {
                    action: 'wpms_list_posts_category',
                    category_id: category_id,
                    slug: slug,
                    wpms_nonce: wpms_localize.wpms_nonce
                },
                success: function (res) {
                    $('.img-links-loader').hide();
                    $('#open-popup-posts-list-'+category_id+' .list_posts_sitemap').html(res);
                    if ($('#category' + slug + ':checked').length) {
                        $('.category' + slug).prop('checked', true);
                    }
                }
            });
        });

        /*
         * Paging list posts in sitemap settings
         */
        $(".holder_posts").jPages({
            containerID: "wrap_sitemap_option_posts",
            previous: "←",
            next: "→",
            perPage: 100,
            delay: 20
        });

        $.each(wpmseositemap.post_type,function(i,v){
            $(".holder_"+v).jPages({
                containerID: "wrap_sitemap_option_"+v,
                previous: "←",
                next: "→",
                perPage: 100,
                delay: 20
            });
        });

        /*
         * Paging list pages in sitemap settings
         */
        $(".holder_pages").jPages({
            containerID: "wrap_sitemap_option_pages",
            previous: "←",
            next: "→",
            perPage: 100,
            delay: 20
        });

        /*
         * Paging list custom link
         */
        $(".holder_custom_url").jPages({
            containerID: "wrap_sitemap_option_customUrl",
            previous: "←",
            next: "→",
            perPage: 100,
            delay: 20
        });

        // Open tippy
        tippy('.wpms_source .ju-setting-label', {
            animation: 'scale',
            duration: 0,
            arrow: false,
            placement: 'top',
            theme: 'metaseo-tippy tippy-rounded',
            onShow(instance) {
                instance.popper.hidden = instance.reference.dataset.tippy ? false : true;
                instance.setContent(instance.reference.dataset.tippy);
            }
        });

        if($('#wpms_html_sitemap_theme').length > 0 && $('#wpms_html_sitemap_theme').val() !== 'default'){
            $('#wpms_html_sitemap_column').closest('tr').hide();
            $('.wpms_xmp_custom_column').hide();
            $('.wpms_xmp_order').show();
        }else{
            $('#wpms_html_sitemap_column').closest('tr').show();
            $('.wpms_xmp_custom_column').show();
            $('.wpms_xmp_order').hide();
        }

        $('#wpms_html_sitemap_theme').on('change',function(){
            if($('#wpms_html_sitemap_theme').length > 0 && $('#wpms_html_sitemap_theme').val() !== 'default'){
                $('#wpms_html_sitemap_column').closest('tr').hide();
                $('.wpms_xmp_custom_column').hide();
                $('.wpms_xmp_order').show();
            }else{
                $('#wpms_html_sitemap_column').closest('tr').show();
                $('.wpms_xmp_custom_column').show();
                $('.wpms_xmp_order').hide();
            }
        });

        $('.wpms_save_create_sitemaps').on('click', function () {
            wpms_save_create_sitemaps();
        });

        $('.wpms-sitemap-xml-link-button').on('click', function (e) {
            e.preventDefault();

            var link_sitemap = $(this).attr('href');
            wpms_save_create_sitemaps(link_sitemap);
        });

        $('.wpms-save-popup-posts-button').on('click', function() {
            wpms_save_create_sitemaps();
        });

        /**
         * Create sitemap
         */
        var wpms_save_create_sitemaps = function (link_sitemap) {
            // show spinner
            $('.spinner_save_sitemaps').css({'visibility': 'visible'}).show();
            var posts = {}, pages = {}, menus = {}, customUrl = {} ,taxonomies = [], columns_menu = {}, wpms_category_link = [], check_all_menu_items = [], wpms_category_select_all = [];
            var custom_post_type = {};
            // get custom post type params to save to sitemap
            $.each(wpmseositemap.post_type,function(i,post_type){
                custom_post_type[post_type] = {};
                $(".wpms_xmap_"+post_type).each(function (i, v) {
                    if ($(v).is(':checked')) {
                        var id = $(v).val();
                        var priority = $('#priority_'+post_type+'_' + id).val();
                        var frequency = $('#frequency_'+post_type+'_' + id).val();
                        custom_post_type[post_type][id] = {'post_id': id, 'priority': priority, 'frequency': frequency};
                    }
                });
            });

            // get custom url params to save to sitemap
            $(".wpms_xmap_customUrl").each(function (i, v) {
                if ($(v).is(':checked')) {
                    var id = $(v).val();
                    var priority = $('#priority_customUrl_' + id).val();
                    var frequency = $('#frequency_customUrl_' + id).val();
                    customUrl[id] = {'customUrl_id': id, 'priority': priority, 'frequency': frequency};
                }
            });

            // get post params to save to sitemap
            $(".wpms_xmap_posts").each(function (i, v) {
                if ($(v).is(':checked')) {
                    var id = $(v).val();
                    var priority = $('#priority_posts_' + id).val();
                    var frequency = $('#frequency_posts_' + id).val();
                    posts[id] = {'post_id': id, 'priority': priority, 'frequency': frequency};
                }
            });

            // get page params to save to sitemap
            $(".wpms_xmap_pages").each(function (i, v) {
                if ($(v).is(':checked')) {
                    var id = $(v).val();
                    var priority = $('#priority_pages_' + id).val();
                    var frequency = $('#frequency_pages_' + id).val();
                    pages[id] = {'post_id': id, 'priority': priority, 'frequency': frequency};
                }
            });

            // get menu params to save to sitemap
            $(".wpms_xmap_menu").each(function (i, v) {
                if ($(v).is(':checked')) {
                    var id = $(v).val();
                    var priority = $('#priority_menu_' + id).val();
                    var frequency = $('#frequency_menu_' + id).val();
                    menus[id] = {'menu_id': id, 'priority': priority, 'frequency': frequency};
                }
            });

            // get category params to save to sitemap
            $('.wpms_sitemap_taxonomies').each(function (i, v) {
                if ($(v).is(':checked')) {
                    taxonomies.push($(v).val());
                }
            });

            $(".xm_category_select_all").each(function (i, v) {
                if ($(v).is(':checked')) {
                    wpms_category_select_all.push($(v).val());
                }
            });

            $('.sitemap_addlink_categories').each(function (i, v) {
                if ($(v).is(':checked')) {
                    wpms_category_link.push($(v).val());
                }
            });

            $('.check_all_menu_items').each(function (i, v) {
                if ($(v).is(':checked')) {
                    check_all_menu_items.push($(v).val());
                }
            });

            // get author params to save to sitemap
            if ($('#wpms_sitemap_author').is(':checked')) {
                var wpms_sitemap_author = 1;
            } else {
                wpms_sitemap_author = 0;
            }

            if ($('#wpms_sitemap_root').is(':checked')) {
                var wpms_sitemap_root = 1;
            } else {
                wpms_sitemap_root = 0;
            }

            if ($('#wpms_sitemap_add').is(':checked')) {
                var wpms_sitemap_add = 1;
            } else {
                wpms_sitemap_add = 0;
            }

            if ($('#wpms_sitemap_enable_core').is(':checked')) {
                var wpms_sitemap_enable_core = 1;
            } else {
                wpms_sitemap_enable_core = 0;
            }

            // get position of menu to save to sitemap
            $('.wpms_display_column_menus').each(function (i, v) {
                var menu_id = $(v).data('menu_id');
                columns_menu[menu_id] = $(v).val()
            });

            var datas = {
                action: 'wpms_save_sitemap_settings',
                wpms_sitemap_posts: JSON.stringify(posts),
                wpms_sitemap_pages: JSON.stringify(pages),
                wpms_sitemap_menus: JSON.stringify(menus),
                wpms_sitemap_customUrl: JSON.stringify(customUrl),
                wpms_html_sitemap_page: $('#wpms_html_sitemap_page').val(),
                wpms_html_sitemap_column: $('#wpms_html_sitemap_column').val(),
                wpms_html_sitemap_theme: $('#wpms_html_sitemap_theme').val(),
                wpms_html_sitemap_position: $('#wpms_html_sitemap_position').val(),
                wpms_check_firstsave: $('#wpms_check_firstsave').val(),
                wpms_sitemap_author: wpms_sitemap_author,
                wpms_sitemap_root: wpms_sitemap_root,
                wpms_sitemap_add: wpms_sitemap_add,
                wpms_sitemap_enable_core: wpms_sitemap_enable_core,
                wpms_category_link: wpms_category_link,
                wpms_category_select_all: wpms_category_select_all,
                check_all_menu_items: check_all_menu_items,
                wpms_sitemap_taxonomies: taxonomies,
                wpms_public_name_posts: $('.public_name_posts').val(),
                wpms_public_name_pages: $('.public_name_pages').val(),
                wpms_public_name_customUrl: $('.public_name_customUrl').val(),
                wpms_display_column_menus: JSON.stringify(columns_menu),
                wpms_display_column_posts: $('.wpms_display_column_posts').val(),
                wpms_display_column_pages: $('.wpms_display_column_pages').val(),
                wpms_display_column_customUrl: $('.wpms_display_column_customUrl').val(),
                wpms_display_order_posts: $('.wpms_display_order_posts').val(),
                wpms_display_order_pages: $('.wpms_display_order_pages').val(),
                wpms_display_order_menus: $('.wpms_display_order_menus').val(),
                wpms_display_order_urls: $('.wpms_display_order_urls').val(),
                wpms_lang_list: $('.wpms_lang_list').val(),
                wpms_nonce: wpms_localize.wpms_nonce
            };

            $.each(wpmseositemap.post_type,function(i,post_type){
                datas['wpms_sitemap_'+post_type] = JSON.stringify(custom_post_type[post_type]);
                datas['wpms_display_column_'+post_type] = $('.wpms_display_column_'+post_type).val();
                datas['wpms_public_name_'+post_type] = $('.public_name_'+post_type).val();
            });

            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: datas,
                success: function () {
                    wpms_regen_sitemaps(link_sitemap);
                }
            });
        };

        /**
         * Generate sitemaps
         */
        var wpms_regen_sitemaps = function (link_sitemap) {
            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: {
                    action: 'wpms_regenerate_sitemaps',
                    wpms_nonce: wpms_localize.wpms_nonce
                },
                success: function () {
                    $('.spinner_save_sitemaps').hide();
                    $('.div_wpms_save_sitemaps .msg-success').fadeIn(100).delay(1000).fadeOut(3000);

                    if (typeof link_sitemap !== 'undefined') {
                        window.open(link_sitemap, '_blank');
                        window.location.reload();
                    }
                }
            });
        };

        /**
         * Remove custom url
         */
        var wpms_clear_customUrl = function(){
            $('.wpms_clear_customUrl').on('click',function(){
                var $this = $(this);
                var idUrl = $this.closest('.wpms_row').data('id');
                $.ajax({
                    url: ajaxurl,
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        action: 'wpms_clear_customUrl',
                        idUrl: idUrl,
                        wpms_nonce: wpms_localize.wpms_nonce
                    },
                    success: function (res) {
                        if(res){
                            $this.closest('.wpms_row').remove();
                            wpms_regen_sitemaps();
                        }
                    }
                });
            });
        };

        var wpms_columns = ['Zezo', 'One', 'Two', 'Three'];
        $('#wpms_html_sitemap_column').on('change', function () {
            $('.wpms_display_column').html(null);
            for (var i = 1; i <= parseInt($(this).val()); i++) {
                $('.wpms_display_column').append('<option value="' + i + '">' + wpms_columns[i] + '</option>');
            }
        });

        $('.xm_cb_all').on('click', function () {
            var category = $(this).data('category');
            if ($(this).is(':checked')) {
                $('.' + category).prop('checked', true);
            } else {
                $('.' + category).prop('checked', false);
            }
            // Create sitemap automatic
            wpms_save_create_sitemaps();
        });

        $('.xml_cb_customposttype_all').on('click', function () {
            var posttype = $(this).data('posttype');

            if ($(this).is(':checked')) {
                $('.cb_sitemaps_' + posttype).prop('checked', true);
            } else {
                $('.cb_sitemaps_' + posttype).prop('checked', false);
            }
        });


        $('.xm_category_select_all').on('click', function () {
            var categoryID = $(this).val();
            var category = $(this).data('category');

            if ($(this).is(':checked')) {
                $('.' + category).prop('checked', true);
                is_all = 1;
            } else {
                $('.' + category).prop('checked', false);
                is_all = 0;
            }

            var datas = {
                action: 'wpms_sitemap_check_all_category',
                wpms_sitemap_category_id: categoryID,
                wpms_sitemap_cateogry_is_all: is_all,
                wpms_nonce: wpms_localize.wpms_nonce
            };

            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: datas,
                success: function () {
                    wpms_regen_sitemaps();
                }
            });
        });

        // check all
        $('.sitemap_check_all').on('click', function () {
            var type = $(this).data('type');
            if ($(this).is(':checked')) {
                $('.cb_sitemaps_' + type).prop('checked', true);
                $('.check_all_menu_items').prop('checked', true);
                $('.xm_category_select_all_'+ type).prop('checked', true);
                $('.xml_cb_customposttype_all_' + type).prop('checked', true);
            } else {
                $('.cb_sitemaps_' + type).prop('checked', false);
                $('.check_all_menu_items').prop('checked', false);
                $('.xm_category_select_all_'+ type).prop('checked', false);
                $('.xml_cb_customposttype_all_' + type).prop('checked', false);
            }
            // Create sitemap automatic
            wpms_save_create_sitemaps();
        });

        // Add custom url
        $('.wpms_add_customurl').on('click', function () {
            if ($('#custom_url_link').val() === '' || $('#custom_url_title').val() === '') {
                return;
            }
            $('.wpms_customurl_spinner').css('visibility','visible').show();
            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: {
                    action : 'wpms_sitemaps_add_customUrl',
                    link: $('#custom_url_link').val(),
                    title: $('#custom_url_title').val(),
                    wpms_nonce: wpms_localize.wpms_nonce
                },
                success: function (res) {
                    if(res.status){
                        $('#wrap_sitemap_option_customUrl').append(res.html);
                        wpms_clear_customUrl();
                    }
                    $('.wpms_customurl_spinner').hide();
                }
            });
        });

        wpms_clear_customUrl();
    });
}(jQuery));