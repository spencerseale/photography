/* Flickr Gallery Integration */
(function($) {
    $(function() {
        // Initialize breakpoints
        breakpoints({
            xlarge: ["1281px", "1680px"],
            large: ["981px", "1280px"],
            medium: ["737px", "980px"],
            small: ["481px", "736px"],
            xsmall: [null, "480px"],
        });
        
        var $main = $("#main");
        var flickrUserId = $main.data("flickr-user-id");
        
        if (!flickrUserId) {
            console.error("No Flickr user ID found");
            return;
        }
        
        console.log("Loading images from Flickr for user:", flickrUserId);
        
        // Clear existing thumbnails
        $main.empty();
        
        // Show loading state
        $main.append('<div class="flickr-loading"><p>Loading photos from Flickr...</p></div>');
        
        // Fetch photos from Flickr public feed
        var feedUrl = "https://www.flickr.com/services/feeds/photos_public.gne?id=" + flickrUserId + "&format=json&jsoncallback=?";
        
        $.ajax({
            url: feedUrl,
            dataType: "jsonp",
            jsonp: "jsoncallback",
            success: function(data) {
                $main.find(".flickr-loading").remove();
                
                if (!data.items || data.items.length === 0) {
                    $main.append('<div class="flickr-error"><p>No photos found on Flickr.</p></div>');
                    return;
                }
                
                console.log("Loaded " + data.items.length + " photos from Flickr");
                
                // Create thumbnails for each photo
                $.each(data.items, function(i, item) {
                    // Get high quality images
                    // Flickr sizes: _m (240px), _c (800px), _b (1024px), _h (1600px)
                    // Using _c for thumbnails and _b for full (most reliable sizes)
                    var thumb = item.media.m.replace("_m.jpg", "_c.jpg"); // 800px for thumbnails
                    var full = item.media.m.replace("_m.jpg", "_b.jpg"); // 1024px for full view (most reliable)
                    
                    var $article = $("<article>").addClass("thumb");
                    var $link = $("<a>")
                        .addClass("image")
                        .attr("href", full)
                        .attr("data-flickr-link", item.link)
                        .attr("data-flickr-title", item.title)
                        .appendTo($article);
                    
                    var $img = $("<img>")
                        .attr("src", thumb)
                        .attr("alt", item.title)
                        .attr("data-name", "flickr-" + i)
                        .appendTo($link);
                    
                    $article.appendTo($main);
                    
                    // Set up the image background (same as original theme)
                    var $image = $link;
                    var $image_img = $img;
                    
                    $image.css("background-image", "url(" + $image_img.attr("src") + ")");
                    $image_img.hide();
                    
                    // IE compatibility
                    if (browser.name == "ie") {
                        $article
                            .css("cursor", "pointer")
                            .on("click", function() {
                                $image.trigger("click");
                            });
                    }
                });
                
                // Initialize Poptrox for the lightbox
                initializePoptrox();
            },
            error: function(xhr, status, error) {
                console.error("Error loading Flickr photos:", error);
                $main.find(".flickr-loading").remove();
                $main.append('<div class="flickr-error"><p>Error loading photos from Flickr. Please try again later.</p></div>');
            }
        });
        
        function initializePoptrox() {
            $main.poptrox({
                baseZIndex: 20000,
                caption: function($a) {
                    var flickrLink = $a.attr("data-flickr-link");
                    
                    var caption = "";
                    if (flickrLink) {
                        caption += "<p class='flickr-photo-link'><a href='" + flickrLink + "' target='_blank' rel='noopener noreferrer'><i class='icon brands fa-flickr'></i> View on Flickr</a></p>";
                    }
                    return caption || " ";
                },
                fadeSpeed: 300,
                onPopupClose: function() {
                    $("body").removeClass("modal-active");
                },
                onPopupOpen: function() {
                    $("body").addClass("modal-active");
                },
                overlayOpacity: 0,
                popupCloserText: "",
                popupHeight: 150,
                popupLoaderText: "",
                popupSpeed: 300,
                popupWidth: 150,
                selector: ".thumb > a.image",
                usePopupCaption: true,
                usePopupCloser: true,
                usePopupDefaultStyling: false,
                usePopupForceClose: true,
                usePopupLoader: true,
                usePopupNav: true,
                windowMargin: 50
            });
            
            // Hack: Set margins to 0 when "xsmall" activates.
            breakpoints.on("<=xsmall", function() {
                $main[0]._poptrox.windowMargin = 0;
            });
            
            breakpoints.on(">xsmall", function() {
                $main[0]._poptrox.windowMargin = 50;
            });
        }
    });
})(jQuery);

