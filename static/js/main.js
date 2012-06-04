xmlOperations = {
    saveData: function(el) {
        var data = {
            id: $(el).closest('li').attr('id'),
            text: el.text()
        };
        console.log(data);
        $.post('/change/', data, function(res){
            console.log(res);
        })
    }
}

$(function(){
    var container = $('#xml_container'),
        editableNodes = container.find('.xml-editable'),
        iconsPanel = editableNodes.append('<span class="xml-edit-panel" contentEditable="false"></span>').find('.xml-edit-panel');
        
    iconsPanel.append('<i class="icon-edit" /><i class="icon-ok-sign" /><i class="icon-remove-sign" />');
    
    container.on('click', '.icon-edit', function(evt){
        var node = $(this).closest('.xml-editable');
        
        node.toggleClass('active', true).attr('contentEditable', 'true').focus();
        
        var range = document.createRange();
        console.log(node[0].firstChild);
        range.setStart(node[0].firstChild, 0);
        range.setEnd(node[0].firstChild, node[0].firstChild.length);
        
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    });
    
    /*textNodes.on('click', function(){
        var el = $(this);
        
        el.attr('contentEditable', 'true');
    });
    
    textNodes.on('keyup', function(evt){
        evt.stopPropagation();
        var el = $(this);
        
        if (el.data('timeout')) {
            clearTimeout(el.data('timeout'));
        }
        el.data('timeout', setTimeout(function(){
            xmlOperations.saveData(el);
        }, 1000));
    });*/
});