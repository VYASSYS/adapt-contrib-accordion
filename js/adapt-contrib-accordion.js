define([
    'core/js/adapt',
    'core/js/models/componentItemsModel',
    './accordionView'
], function(Adapt, ComponentItemsModel, accordionView) {

    return Adapt.register('accordion', {
        view: accordionView,
        // Use the ComponentItemsModel directly - no need to extend
        model: ComponentItemsModel
    });

});
