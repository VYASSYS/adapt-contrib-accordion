define([
	'core/js/adapt',
	'core/js/views/componentDiffView'
], function(Adapt, ComponentDiffView) {

    var AccordionView = ComponentDiffView.extend({

        renderAttributes: [
            "displayTitle",
            "body",
            "title",
            "_currentIndex",
            "_currentIndexHeight",
            "_items",
            "_isComplete"
        ],

    	completionevent: "allItems",

        events: {
            'click .accordion-item-title': 'toggleItem'
        },

        postInitialize: function() {

            this.state.set({
                "_currentIndex": -1,
                "_currentIndexHeight": null
            });
            // Checks to see if the accordion should be reset on revisit
            this.model.checkIfResetOnRevisit();

            this.setUpEventListeners();

        },

        setUpEventListeners: function() {

        	this.listenTo(this.model, this.completionevent, this.onCompletion, this);
            this.listenTo(Adapt, "device:resize", this.onResize, this);

        },

        postRender: function(isFirstRender) {
            if (!isFirstRender) return;
            
        	this.$(".component-widget").imageready(_.bind(function() {
	            this.setReadyStatus();
	        }, this));

        },

        toggleItem: function(event) {

            event.preventDefault();

            var index = parseInt($(event.currentTarget).attr("data-index"));
            this.setVisited(index);

            var currentIndex = this.state.get("_currentIndex");

            if (currentIndex !== index) {
                // Open clicked item
                // Define container height based upon content outerHeight 
                //      this is to allow css height transition to animate
                //      as transitions require a fixed height
                var height = this.$(".accordion-item-body-inner-"+index).outerHeight();
                this.state.set({
                    "_currentIndexHeight": height,
                    "_currentIndex": index
                });

                // Make sure focus is set correctly after opening a new item and rerendering
                this.listenToOnce(this, "postRender", function() {
                    var currentIndex = this.state.get("_currentIndex");
                    this.$(".accordion-item-body-inner-"+index).a11y_focus();
                });
            } else {
                // Close all items
                this.state.set({
                    "_currentIndexHeight": null,
                    "_currentIndex": -1
                });
            }

        },

        onResize: function() {

            var currentIndex = this.state.get("_currentIndex");
            if (currentIndex === -1) return;

            // Resize open item container to fit content
            //      this is to allow css height transition to animate
            //      as transitions require a fixed height
            var height = this.$(".accordion-item-body-inner-"+currentIndex).outerHeight();
            this.state.set("_currentIndexHeight", height);

        },

        setVisited: function(index) {

            var item = this.model.getItem(index);
            item._isVisited = true;
            this.model.evaluateCompletion();

        },

        onCompletion: function() {
        	this.setCompletionStatus();

        	this.stopListening(this.model, this.completionevent);
        }

    });

    return AccordionView;

});
