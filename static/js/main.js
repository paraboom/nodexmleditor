xmlOperations = {
    saveData: function(el, callback) {
        var node =  $(el).data('type') == 'attr' ? $(el) : $(el).closest('li');
        var data = {
                id: (node.data('type') == 'attr') ? node.closest('li.xml-node-name').attr('id') : node.attr('id'),
                text: el.data('textnode').nodeValue,
                type: node.data('type')
            };
        $.post('/change/', data, function(res){
            callback(res);
        });
    }
}

$(function(){
    var container = $('#xml_container'),
        editableNodes;
        
    processLoadedContent();
    
    container.on('click', '.icon-edit', function(evt){
        var node = $(this).closest('.xml-editable'),
            nodeDOM = node[0];
        
        node.toggleClass('active', true).attr('contentEditable', true).focus();
        
        for (var i=0, l = nodeDOM.childNodes.length; i<l; i++) {
            if (nodeDOM.childNodes[i].nodeType == 3 && nodeDOM.childNodes[i].length > 2) {
                nodeDOM = nodeDOM.childNodes[i];
                break;
            }
        }
        
        var range = document.createRange();
        range.setStart(nodeDOM, 0);
        range.setEnd(nodeDOM, nodeDOM.length);
        
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        node.data('oldvalue', node.text());
        node.data('textnode', nodeDOM);
    });
    
    container.on('click', '.icon-remove-sign', cancelEdit);
    
    container.on('click', '.icon-ok-sign', function(evt){
        var el = $(this).closest('.xml-editable');
        
        el
            .toggleClass('active', false)
            .toggleClass('edited', false)
            .attr('contentEditable', false);
        
        xmlOperations.saveData(el, function(res){
            container.html(res);
            processLoadedContent();
        });
    });
    
    container.on('keydown', '.xml-editable', function(evt){
        switch (evt.which) {
            case 13:
                evt.stopPropagation();
                evt.preventDefault();
                break;
            case 27:
                cancelEdit();
                break;
        }
    });
    
    container.on('keyup', '.xml-editable', function(evt){
        switch (evt.which) {
            default:
                var el = $(this);
                if (el.data('textnode').nodeValue != el.data('oldvalue')) {
                    el.toggleClass('edited', true);
                }
        } 
    });
    
    function cancelEdit() {
        var tmp = editableNodes.filter('.active');
        tmp.each(function(i, el){
            $(el).data('textnode').nodeValue = $(el).data('oldvalue');
            $(el)
                .toggleClass('active', false)
                .toggleClass('edited', false)
                .attr('contentEditable', false);
        });
    }
    
    function processLoadedContent() {
        editableNodes = container.find('.xml-editable');
        
        var iconsPanel = editableNodes.append('<span class="xml-edit-panel" contentEditable="false"></span>').find('.xml-edit-panel');
        iconsPanel.append('<i class="icon-edit icon-white" /><i class="icon-ok-sign icon-white" /><i class="icon-remove-sign icon-white" />');
    };
});