(function (source) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.textContent = '(' + source + ')();';
    document.head.appendChild(script);
    document.head.removeChild(script);
})(function (){

    var localStoreage = window.localStorage;

    var historyHelper = {
        billSearch: function(billNo){
            if(billNo){
                document.getElementById("postid").value = billNo;
                document.getElementById("query").click();
            }
        },
        addClassEvent: function(node, fun){
            var foos = node.querySelectorAll(".foo");
            if(foos.length){
                for(var i=0; i<foos.length; i++){
                    foos[i].addEventListener("click", fun, false);
                }
            }
        },
        regKey: /^billno/,
        prefixKey: 'billno',
        valueKey: 'v',
        classKey: 'foo',
        clearKey: 'c'
    };

    var realHistoryDiv = document.createElement("div");
    var realHistoryContent = '<div id="realHistory" style="width: 200px; z-index: 500; position: fixed; top: 200px; left: 28px; display: block; padding: 0 35px; height: 36px; font-size: 16px; font-weight: normal; color: #FFF; cursor: pointer; line-height: 36px; text-align: center; background-color: #ff9e40; border-left: 2px solid #FFF; border-right: 2px solid #FFF;">真の我的快递单</div><div id="historyPanel" reg="true" style="overflow: scroll; display: none; z-index: 500; width: 268px; height: 200px; position: fixed; top: 240px; border: 1px dashed blue; left: 30px;"></div>';
    realHistoryDiv.innerHTML = realHistoryContent;

    // 当有新增node时，触发事件
    document.addEventListener("DOMNodeInserted", function(event){
        var node = event.target;
        // 当新增的node不是DIV时，不执行后续操作
        if(node.tagName !== 'DIV'){ return; }
        // 当新增node的id匹配div开头时，给其中的a连接增加事件，否则为初始化操作
        // console.log(node);
        if(/^div/.test(node.getAttribute('id'))){
            historyHelper.addClassEvent(node, function(event){
                var element = event.target;
                var value = element.getAttribute(historyHelper.valueKey);
                var clear = element.getAttribute(historyHelper.clearKey);
                if(value){
                    if(!clear){
                        historyHelper.billSearch(value);
                    }else{
                        // console.log(document.getElementById("div"+value));
                        // console.log(document.getElementById("div"+value).parentNode);
                        document.getElementById("div"+value).parentNode.removeChild(document.getElementById("div"+value));
                        localStorage.removeItem("billno"+value);
                    }
                }
            });
        }else{
            var panelContent = "";
            if(localStorage.length){
                for(var i=0; i<localStorage.length; i++){
                    var key = localStorage.key(i);
                    if(historyHelper.regKey.test(key)){
                        panelContent += "<div id='div"+localStorage.getItem(key)+"' style='font-size: 16px; padding-left: 10px; padding-top: 5px;'>";
                        panelContent += "<a class='"+historyHelper.classKey+"' "+historyHelper.valueKey+"="+JSON.stringify(localStorage.getItem(key))+">"+localStorage.getItem(key)+"</a>";
                        panelContent += "<span style='position: absolute; right: 20px;'><a class='"+historyHelper.classKey+"' "+historyHelper.valueKey+"='"+localStorage.getItem(key)+"' "+historyHelper.clearKey+"='1'>清除</a></span>";
                        panelContent += "</div>";
                    }
                }
            }
            document.getElementById("historyPanel").innerHTML = panelContent;

            document.getElementById("realHistory").addEventListener("click", function(event){
                var node = document.getElementById("historyPanel");
                if(node.style.display === "none"){
                    node.style.display = "block";
                }else{
                    node.style.display = "none";
                }
            }, false);
        }
    }, false);

    document.body.appendChild(realHistoryDiv);

    document.getElementById("query").addEventListener("click", function(event){
        var postValue = document.getElementById("postid").value;
        if(!localStoreage.getItem(historyHelper.prefixKey+postValue)){
            localStoreage.setItem(historyHelper.prefixKey+postValue, postValue);
            var billContent = "<div id='div"+postValue+"' style='font-size: 16px; padding-left: 10px; padding-top: 5px;'>";
            billContent += "<a class='"+historyHelper.classKey+"' "+historyHelper.valueKey+"="+postValue+">"+postValue+"</a>";
            billContent += "<span style='position: absolute; right: 20px;'><a class='"+historyHelper.classKey+"' "+historyHelper.valueKey+"='"+localStorage.getItem(historyHelper.prefixKey+postValue)+"' "+historyHelper.clearKey+"='1'>清除</a></span>";
            billContent += "</div>";
            document.getElementById("historyPanel").innerHTML = document.getElementById("historyPanel").innerHTML + billContent;
        }
    }, false);
    
    document.getElementById("postid").addEventListener("keydown", function(event){
        // console.log(event);
        if(event.type === "keydown" && event.keyCode === 13){
            var postValue = document.getElementById("postid").value;
            if(!localStoreage.getItem(historyHelper.prefixKey+postValue)){
                localStoreage.setItem(historyHelper.prefixKey+postValue, postValue);
                var billContent = "<div id='div"+postValue+"' style='font-size: 16px; padding-left: 10px; padding-top: 5px;'>";
                billContent += "<a class='"+historyHelper.classKey+"' "+historyHelper.valueKey+"="+postValue+">"+postValue+"</a>";
                billContent += "<span style='position: absolute; right: 20px;'><a class='"+historyHelper.classKey+"' "+historyHelper.valueKey+"='"+localStorage.getItem(historyHelper.prefixKey+postValue)+"' "+historyHelper.clearKey+"='1'>清除</a></span>";
                billContent += "</div>";
                document.getElementById("historyPanel").innerHTML = document.getElementById("historyPanel").innerHTML + billContent;
            }
        }
    }, false);
});