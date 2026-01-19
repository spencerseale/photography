/* Flickr Slideshow Integration */
(function($) {
    $(function() {
        var $slideshow = $("#slideshow-container");
        var flickrUserId = $slideshow.data("flickr-user-id");
        
        if (!flickrUserId || $slideshow.length === 0) {
            console.error("No Flickr user ID found or slideshow container missing");
            return;
        }
        
        console.log("Loading slideshow images from Flickr for user:", flickrUserId);
        
        // Clear existing slides
        $slideshow.empty();
        
        // Fetch photos from Flickr public feed
        var feedUrl = "https://www.flickr.com/services/feeds/photos_public.gne?id=" + flickrUserId + "&format=json&jsoncallback=?";
        
        $.ajax({
            url: feedUrl,
            dataType: "jsonp",
            jsonp: "jsoncallback",
            success: function(data) {
                if (!data.items || data.items.length === 0) {
                    console.error("No photos found on Flickr for slideshow");
                    return;
                }
                
                // Shuffle and select 5-7 random images
                var shuffled = data.items.sort(function() { return 0.5 - Math.random(); });
                var numImages = Math.min(5 + Math.floor(Math.random() * 3), shuffled.length);
                var selectedImages = shuffled.slice(0, numImages);
                
                console.log("Loaded " + selectedImages.length + " photos from Flickr for slideshow");
                
                // Create slides
                $.each(selectedImages, function(i, item) {
                    // Try to use highest quality available
                    // _h (1600px) for best quality, fallback to _b (1024px) if load fails
                    var imgUrlHigh = item.media.m.replace("_m.jpg", "_h.jpg");
                    var imgUrlFallback = item.media.m.replace("_m.jpg", "_b.jpg");
                    
                    var $slide = $("<div>")
                        .addClass("slideshow-item")
                        .appendTo($slideshow);
                    
                    var $img = $("<img>")
                        .attr("src", imgUrlHigh)
                        .attr("alt", item.title)
                        .on("error", function() {
                            // Fallback to smaller size if high-res doesn't exist
                            console.log("Falling back to _b size for: " + item.title);
                            $(this).attr("src", imgUrlFallback);
                        })
                        .appendTo($slide);
                });
                
                // Initialize slideshow
                initializeSlideshow();
            },
            error: function(xhr, status, error) {
                console.error("Error loading Flickr photos for slideshow:", error);
            }
        });
        
        function initializeSlideshow() {
            var $slides = $slideshow.find(".slideshow-item");
            
            if ($slides.length === 0) {
                return;
            }
            
            var currentSlide = 0;
            
            // Show first slide
            $slides.eq(currentSlide).addClass("active");
            
            // Function to change slides
            function nextSlide() {
                $slides.eq(currentSlide).removeClass("active");
                currentSlide = (currentSlide + 1) % $slides.length;
                $slides.eq(currentSlide).addClass("active");
            }
            
            // Change slide every 5 seconds
            var slideInterval = setInterval(nextSlide, 5000);
            
            // Pause on hover
            $slideshow.hover(
                function() {
                    clearInterval(slideInterval);
                },
                function() {
                    slideInterval = setInterval(nextSlide, 5000);
                }
            );
        }
    });
})(jQuery);

