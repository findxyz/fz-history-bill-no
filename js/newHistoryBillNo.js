(function (source) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.textContent = '(' + source + ')();';
    document.head.appendChild(script);
    document.head.removeChild(script);
})(function () {

    var localDb = window.localStorage;

    var originalInput = document.getElementById("postid");
    var originalButton = document.getElementById("query");

    var simpleManager = {
        billNoPrefix: "billNo",
        billNoReg: /^billNo/,
        billFun: function(e){
            var e = e || window.event;
            var target = e.target || e.srcElement;
            if(target.nodeName == "A"){
                originalInput.value = target.innerText;
                originalButton.click();
            }else if(target.nodeName == "INPUT"){
                var localBillNoKey = target.id.replace("btn", "");
                simpleManager.delBillNo(localBillNoKey);
            }
        },
        addBillNo: function(){
            var currentBillNo = originalInput.value;
            var localBillNoKey = simpleManager.billNoPrefix + currentBillNo;
            if(!localDb.getItem(simpleManager.billNoPrefix + currentBillNo)){
                localDb.setItem(localBillNoKey, currentBillNo);
                // done 增加数据到页面面板上
                simpleManager.appendBill(localBillNoKey, currentBillNo);
            }
        },
        appendBill: function(key, value){
            var divAttr = [];
            divAttr.push({key: "style", value: "font-size: 16px; padding: 10px 10px 0px 10px;"});
            var div = simpleHelper.createElement("div", "div"+key, "", divAttr, historyPanel);
            simpleHelper.createElement("a", key, value, null, div);
            var btnAttr = [];
            btnAttr.push({key: "type", value: "button"});
            btnAttr.push({key: "value", value: "删除"});
            btnAttr.push({key: "style", value: "width: 72px; height: 25px; position: absolute; right: 20px;"});
            simpleHelper.createElement("input", "btn"+key, "", btnAttr, div);
        },
        delBillNo: function(localBillNoKey){
            localDb.removeItem(localBillNoKey);
            // done 删除页面面板上的数据
            var billNoParentNode = document.getElementById(localBillNoKey).parentNode;
            billNoParentNode.parentNode.removeChild(billNoParentNode);
        }
    };

    var simpleHelper = {
        createElement: function (eName, eId, eHtml, eAttr, parentNode) {
            var parentNode = parentNode || document.body;
            var eAttr = eAttr || [];
            var element = document.createElement(eName);
            element.setAttribute("id", eId);
            for(var i=0; i<eAttr.length; i++){
                var key = eAttr[i].key;
                var value = eAttr[i].value;
                element.setAttribute(key, value);
            }
            element.innerHTML = eHtml;
            parentNode.appendChild(element);
            return document.getElementById(eId);
        }
    };

    var initData = function(){
        var historyPanel = document.getElementById("historyPanel");
        for(var i=0; i<localDb.length; i++){
            var key = localDb.key(i);
            if(simpleManager.billNoReg.test(key)){
                var value = localDb.getItem(key);
                simpleManager.appendBill(key, value);
            }
        }
    };

    var titlePanelStyle = {
        key: "style",
        value: "width: 200px; z-index: 500; position: fixed; top: 200px; left: 28px; display: block; padding: 0 35px; height: 36px; font-size: 16px; font-weight: normal; color: #FFF; cursor: pointer; line-height: 36px; text-align: center; background-color: #ff9e40; border-left: 2px solid #FFF; border-right: 2px solid #FFF;"
    };
    var historyPanelStyle = {
        key: "style",
        value: "overflow: scroll; display: block; z-index: 500; width: 268px; height: 320px; position: fixed; top: 240px; border: 1px dashed blue; left: 30px;"
    };
    simpleHelper.createElement("div", "historyTitleDiv", "真の我的快递单 Click Here!", [titlePanelStyle]);
    simpleHelper.createElement("div", "historyPanel", "", [historyPanelStyle]);

    initData();

    document.getElementById("historyPanel").addEventListener("click", simpleManager.billFun);
    document.getElementById("historyTitleDiv").addEventListener("click", function(){
        var historyPanel = document.getElementById("historyPanel");
        if(historyPanel.style.display === "none"){
            historyPanel.style.display = "block";
        }else{
            historyPanel.style.display = "none";
        }
    }, false);
    originalButton.addEventListener("click", simpleManager.addBillNo);
    originalInput.addEventListener("keydown", function(e){
        var e = e || window.event;
        if(e.type === "keydown" && e.keyCode === 13){
            simpleManager.addBillNo();
        }
    });

});