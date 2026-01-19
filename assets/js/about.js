/* About Page Tab Functionality */
(function($) {
    $(function() {
        var $tabButtons = $(".tab-button");
        var $tabPanels = $(".tab-panel");
        
        $tabButtons.on("click", function() {
            var tabId = $(this).data("tab");
            
            // Remove active class from all buttons and panels
            $tabButtons.removeClass("active");
            $tabPanels.removeClass("active");
            
            // Add active class to clicked button and corresponding panel
            $(this).addClass("active");
            $("#" + tabId).addClass("active");
        });
    });
})(jQuery);

