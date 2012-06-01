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
    var textNodes = $('.xml-node-text-value');
    
    textNodes.on('click', function(){
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
    });
});